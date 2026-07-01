/*
 * classroom.js — Git Science Park v2.0 교실 모드 (Zero-Dependency)
 * ------------------------------------------------------------------
 * 네 가지 기능을 허브와 실험 페이지에서 공유한다.
 *   1) 발표 / 집중 모드  : 크롬을 숨기고 본문에 집중(+전체화면)
 *   2) 인쇄용 워크시트     : 예측·관찰·해석·메모 + 이름/날짜, 인쇄
 *   3) 수업 코스/플레이리스트 : localStorage 'gsp:course' 로 실험 묶음 구성·재생
 *   4) 교사 가이드 패널    : 실험별 메타·학습목표·핵심질문 빠른 참고
 *
 * 공개 API
 *   Classroom.initHub({ data:fn, catById:fn })  — 허브에서 호출
 *   Classroom.initExp(expObject)                 — 실험 페이지에서 호출(생성기가 주입)
 *
 * UI 문자열은 I18n 사전(classroom.*)에서 가져오되, 사전이 없으면 폴백을 쓴다.
 */
window.Classroom = (function () {
  'use strict';

  var COURSE_KEY = 'gsp:course';

  /* ---------- 다국어 헬퍼 ---------- */
  function T(key, fb, vars) {
    var v = window.I18n ? window.I18n.t(key, vars) : null;
    return (v && v !== key) ? v : fb;
  }

  /* ---------- 미니 DOM 빌더 ---------- */
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'on' && attrs[k]) Object.keys(attrs[k]).forEach(function (ev) { n.addEventListener(ev, attrs[k][ev]); });
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function esc(s) { return String(s == null ? '' : s); }
  function stars(n) {
    n = Math.max(0, Math.min(5, Number(n) || 0));
    var s = '';
    for (var i = 0; i < 5; i++) s += i < n ? '★' : '☆';
    return s;
  }

  /* ---------- 코스(플레이리스트) 저장 ---------- */
  function loadCourse() {
    try { var a = JSON.parse(localStorage.getItem(COURSE_KEY) || '[]'); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function saveCourse(arr) { try { localStorage.setItem(COURSE_KEY, JSON.stringify(arr)); } catch (e) {} }
  function courseHas(id) { return loadCourse().some(function (x) { return x.id === id; }); }
  function courseAdd(item) {
    var c = loadCourse();
    if (!c.some(function (x) { return x.id === item.id; })) { c.push(item); saveCourse(c); }
    return c;
  }
  function courseRemove(id) {
    var c = loadCourse().filter(function (x) { return x.id !== id; });
    saveCourse(c);
    return c;
  }
  function courseMove(id, dir) {
    var c = loadCourse();
    var i = c.findIndex(function (x) { return x.id === id; });
    var j = i + dir;
    if (i < 0 || j < 0 || j >= c.length) return c;
    var t = c[i]; c[i] = c[j]; c[j] = t;
    saveCourse(c);
    return c;
  }
  // 허브 기준 실험 URL
  function hubUrl(item) { return './experiments/' + item.category + '/' + item.slug + '.html'; }

  /* ---------- 오버레이 닫기 ---------- */
  function mountScrim(dialog, onClose) {
    var scrim = h('div', { 'class': 'gsp-scrim', role: 'dialog', 'aria-modal': 'true' }, [dialog]);
    function close() {
      document.removeEventListener('keydown', onKey);
      if (scrim.parentNode) scrim.parentNode.removeChild(scrim);
      if (onClose) onClose();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(scrim);
    return close;
  }

  function dialogShell(titleText, bodyNodes, onClose) {
    var closeRef = { fn: null };
    var head = h('div', { 'class': 'gsp-dialog__head' }, [
      h('h2', { 'class': 'gsp-dialog__title', text: titleText }),
      h('button', { 'class': 'gsp-dialog__close', 'aria-label': T('classroom.close', '닫기'), text: '✕',
        on: { click: function () { closeRef.fn(); } } })
    ]);
    var dialog = h('div', { 'class': 'gsp-dialog' }, [head, h('div', { 'class': 'gsp-dialog__body' }, bodyNodes)]);
    closeRef.fn = mountScrim(dialog, onClose);
    return closeRef;
  }

  /* ================================================================
   *  허브
   * ================================================================ */
  function initHub(opts) {
    var btn = document.getElementById('classroom-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      btn.setAttribute('aria-pressed', 'true');
      openHubModal(opts, function () { btn.setAttribute('aria-pressed', 'false'); btn.focus(); });
    });
  }

  function allExperiments(opts) {
    var d = (opts && opts.data) ? opts.data() : null;
    return (d && Array.isArray(d.experiments)) ? d.experiments : [];
  }
  function catName(opts, catId) {
    var v = T('cat.' + catId + '.name', null);
    if (v) return v;
    var map = (opts && opts.catById) ? opts.catById() : {};
    return (map[catId] && map[catId].name) || catId;
  }
  function catIcon(opts, catId) {
    var map = (opts && opts.catById) ? opts.catById() : {};
    return (map[catId] && map[catId].icon) || '';
  }

  function openHubModal(opts, onClose) {
    var body = [];

    // 1) 수업 플레이리스트
    var courseSection = h('div', { 'class': 'gsp-section' }, [
      h('h3', { 'class': 'gsp-section__title', text: '🎬 ' + T('classroom.course', '수업 플레이리스트') })
    ]);
    var courseHost = h('div', {});
    courseSection.appendChild(courseHost);
    body.push(courseSection);

    // 2) 교사 가이드(전체 실험 표)
    var guideSection = h('div', { 'class': 'gsp-section' }, [
      h('h3', { 'class': 'gsp-section__title', text: '📋 ' + T('classroom.teacherGuide', '교사 가이드') }),
      h('p', { 'class': 'gsp-muted', text: T('classroom.guideIntro', '교사용 빠른 참고: 각 실험의 시대·과학자·난이도·주제.') })
    ]);
    var guideHost = h('div', {});
    guideSection.appendChild(guideHost);
    body.push(guideSection);

    var ref = dialogShell('🎓 ' + T('classroom.toggle', '교실 모드').replace(/^🎓\s*/, ''), body, onClose);

    function renderCourse() {
      courseHost.innerHTML = '';
      var course = loadCourse();
      if (!course.length) {
        courseHost.appendChild(h('p', { 'class': 'gsp-muted', text: T('classroom.courseEmpty', '실험을 담아 수업 플레이리스트를 만드세요.') }));
        return;
      }
      var list = h('ol', { 'class': 'gsp-course-list' });
      course.forEach(function (item, i) {
        var row = h('li', { 'class': 'gsp-course-item' }, [
          h('span', { 'class': 'idx', text: String(i + 1) }),
          h('span', { 'class': 'ci-title' }, [
            h('b', { text: (item.icon ? item.icon + ' ' : '') + item.title }),
            h('small', { text: catIcon(opts, item.category) + ' ' + catName(opts, item.category) })
          ]),
          h('button', { 'class': 'gsp-iconbtn', 'aria-label': 'up', text: '▲',
            on: { click: function () { courseMove(item.id, -1); renderCourse(); } } }),
          h('button', { 'class': 'gsp-iconbtn', 'aria-label': 'down', text: '▼',
            on: { click: function () { courseMove(item.id, 1); renderCourse(); } } }),
          h('button', { 'class': 'gsp-iconbtn', 'aria-label': T('classroom.removeFromCourse', '빼기'), text: '✕',
            on: { click: function () { courseRemove(item.id); renderCourse(); renderGuide(); } } })
        ]);
        list.appendChild(row);
      });
      courseHost.appendChild(list);

      var start = h('button', { 'class': 'gsp-btn', text: T('classroom.startLesson', '▶ 수업 시작'),
        on: { click: function () { location.href = hubUrl(course[0]) + '#lesson'; } } });
      var clear = h('button', { 'class': 'gsp-btn gsp-btn--ghost', text: T('classroom.removeFromCourse', '빼기') + ' (all)',
        on: { click: function () { saveCourse([]); renderCourse(); renderGuide(); } } });
      courseHost.appendChild(h('div', { 'class': 'gsp-actions' }, [start, clear]));
      courseHost.querySelector('.gsp-actions').appendChild(
        h('span', { 'class': 'gsp-muted', text: T('classroom.courseCount', '수업에 {n}개', { n: course.length }) })
      );
    }

    function renderGuide() {
      guideHost.innerHTML = '';
      var exps = allExperiments(opts).slice().sort(function (a, b) {
        return (a.category + a.slug).localeCompare(b.category + b.slug);
      });
      if (!exps.length) { guideHost.appendChild(h('p', { 'class': 'gsp-muted', text: '—' })); return; }
      var table = h('table', { 'class': 'gsp-guide-table' });
      var headRow = h('tr', {}, [
        h('th', { text: '🧪' }),
        h('th', { text: '📅 / 👤' }),
        h('th', { text: '⭐' }),
        h('th', { text: '' })
      ]);
      table.appendChild(h('thead', {}, [headRow]));
      var tbody = h('tbody', {});
      exps.forEach(function (e) {
        var added = courseHas(e.id);
        var btn = h('button', { 'class': 'gsp-iconbtn add-btn',
          'aria-pressed': added ? 'true' : 'false',
          text: added ? T('classroom.inCourse', '✓ 담김') : T('classroom.addToCourse', '담기') });
        btn.addEventListener('click', function () {
          if (courseHas(e.id)) courseRemove(e.id);
          else courseAdd({ id: e.id, slug: e.slug, category: e.category, title: e.title, icon: e.icon });
          renderGuide(); renderCourse();
        });
        var ready = e.status === 'ready';
        tbody.appendChild(h('tr', { style: ready ? '' : 'opacity:.5' }, [
          h('td', {}, [
            h('b', { text: (e.icon || catIcon(opts, e.category)) + ' ' + e.title }),
            h('div', { 'class': 'gsp-muted', text: catName(opts, e.category) })
          ]),
          h('td', { 'class': 'gsp-muted', html: esc(e.year || '') + '<br>' + esc(e.scientist || '') }),
          h('td', { text: stars(e.difficulty) }),
          h('td', {}, [ready ? btn : h('span', { 'class': 'gsp-muted', text: '—' })])
        ]));
      });
      table.appendChild(tbody);
      guideHost.appendChild(table);
    }

    renderCourse();
    renderGuide();
    return ref;
  }

  /* ================================================================
   *  실험 페이지
   * ================================================================ */
  // 상단 바(.topbar) 다음에 끼워 넣되, 없으면 본문 맨 앞에 둔다.
  function insertAfterTopbar(node) {
    var tb = document.querySelector('.topbar');
    if (tb && tb.parentNode) tb.parentNode.insertBefore(node, tb.nextSibling);
    else document.body.insertBefore(node, document.body.firstChild);
  }

  function initExp(exp) {
    if (!exp) return;
    var toggle = document.getElementById('classroom-toggle');
    var bar = buildExpBar(exp);
    insertAfterTopbar(bar);
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = bar.hasAttribute('hidden');
        if (open) { bar.removeAttribute('hidden'); toggle.setAttribute('aria-pressed', 'true'); }
        else { bar.setAttribute('hidden', ''); toggle.setAttribute('aria-pressed', 'false'); }
      });
    }
    // 수업 모드 진입(플레이리스트 재생): #lesson
    if (/(^|#|&)lesson/.test(location.hash)) mountLessonNav(exp);
  }

  function buildExpBar(exp) {
    var addBtn = h('button', { type: 'button' });
    function syncAdd() {
      var inC = courseHas(exp.id);
      addBtn.setAttribute('aria-pressed', inC ? 'true' : 'false');
      addBtn.textContent = inC ? T('classroom.inCourse', '✓ 수업에 담김') : T('classroom.addToCourse', '＋ 수업에 추가');
    }
    addBtn.addEventListener('click', function () {
      if (courseHas(exp.id)) courseRemove(exp.id);
      else courseAdd({ id: exp.id, slug: exp.slug, category: exp.category, title: exp.title, icon: exp.icon });
      syncAdd();
    });
    syncAdd();

    var bar = h('div', { 'class': 'gsp-cbar', hidden: '', role: 'toolbar', 'aria-label': 'classroom' }, [
      h('button', { type: 'button', text: '⛶ ' + T('classroom.present', '집중 / 발표'),
        on: { click: function () { enterPresent(); } } }),
      h('button', { type: 'button', text: T('classroom.worksheet', '🖨 워크시트'),
        on: { click: function () { openWorksheet(exp); } } }),
      h('button', { type: 'button', text: T('classroom.teacherGuide', '📋 교사 가이드'),
        on: { click: function () { openGuidePanel(exp); } } }),
      addBtn
    ]);
    return bar;
  }

  /* ---- 발표 / 집중 모드 ---- */
  function enterPresent() {
    document.body.classList.add('gsp-present');
    var exit = h('button', { 'class': 'gsp-present-exit', text: T('classroom.exit', '교실 모드 종료') + ' ✕' });
    function leave() {
      document.body.classList.remove('gsp-present');
      if (exit.parentNode) exit.parentNode.removeChild(exit);
      document.removeEventListener('keydown', onKey);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    }
    function onKey(e) { if (e.key === 'Escape') leave(); }
    exit.addEventListener('click', leave);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(exit);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(function () {});
    }
  }

  /* ---- 교사 가이드 패널 ---- */
  function openGuidePanel(exp) {
    var meta = h('div', { 'class': 'gsp-guide-meta' }, [
      exp.icon ? h('span', { text: exp.icon + ' ' + (exp.titleEn || '') }) : null,
      h('span', { text: (exp.catIcon || '') + ' ' + (exp.catName || exp.category) }),
      exp.scientist ? h('span', { text: '👤 ' + exp.scientist }) : null,
      exp.year ? h('span', { text: '📅 ' + exp.year }) : null,
      h('span', { text: stars(exp.difficulty) })
    ]);
    var kw = (exp.keywords || []).slice(0, 8);
    var body = [
      h('h3', { text: '📋 ' + T('classroom.teacherGuide', '교사 가이드') }),
      h('p', { 'class': 'gsp-muted', text: T('classroom.guideIntro', '교사용 빠른 참고: 각 실험의 시대·과학자·난이도·주제.') }),
      meta,
      h('div', { 'class': 'gsp-section' }, [
        h('h4', { 'class': 'gsp-section__title', text: T('classroom.objectives', '학습 목표') }),
        h('p', { text: ((window.I18n && window.I18n.desc && window.I18n.desc(exp.slug)) || exp.description || '') })
      ])
    ];
    if (kw.length) {
      body.push(h('div', { 'class': 'gsp-section' }, [
        h('h4', { 'class': 'gsp-section__title', text: T('classroom.keyQuestions', '핵심 질문') }),
        h('div', { 'class': 'gsp-chips' }, kw.map(function (k) { return h('span', { text: k }); }))
      ]));
    }
    var panel = h('aside', { 'class': 'gsp-guide-panel', role: 'dialog', 'aria-label': T('classroom.teacherGuide', '교사 가이드') });
    body.forEach(function (n) { if (n) panel.appendChild(n); });
    var close = h('button', { 'class': 'gsp-dialog__close', 'aria-label': T('classroom.close', '닫기'), text: '✕',
      style: 'position:absolute;top:12px;inset-inline-end:12px;' });
    panel.style.position = 'fixed';
    panel.appendChild(close);
    function dismiss() {
      if (panel.parentNode) panel.parentNode.removeChild(panel);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') dismiss(); }
    close.addEventListener('click', dismiss);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(panel);
  }

  /* ---- 인쇄용 워크시트 ---- */
  function openWorksheet(exp) {
    function blockLines(label) {
      return h('div', { 'class': 'gsp-ws-block' }, [
        h('h3', { text: label }),
        h('div', { 'class': 'gsp-ws-lines' })
      ]);
    }
    var sheet = h('div', { 'class': 'gsp-ws-sheet' }, [
      h('h2', { text: exp.title }),
      h('p', { 'class': 'ws-sub', text: T('classroom.worksheetTitle', '수업 워크시트') + ' · ' +
        (exp.catName || exp.category) + (exp.scientist ? ' · ' + exp.scientist : '') }),
      h('div', { 'class': 'gsp-ws-fields' }, [
        h('div', { 'class': 'fld', text: T('classroom.name', '이름') + ': ' }),
        h('div', { 'class': 'fld', text: T('classroom.date', '날짜') + ': ' })
      ]),
      blockLines(T('classroom.predict', '예측')),
      blockLines(T('classroom.observe', '관찰')),
      blockLines(T('classroom.interpret', '해석')),
      blockLines(T('classroom.notes', '메모'))
    ]);
    var ref = { fn: null };
    var toolbar = h('div', { 'class': 'gsp-ws-toolbar' }, [
      h('button', { 'class': 'gsp-btn', text: T('classroom.print', '🖨 인쇄'),
        on: { click: function () {
          document.body.classList.add('gsp-printing');
          window.print();
          setTimeout(function () { document.body.classList.remove('gsp-printing'); }, 0);
        } } }),
      h('button', { 'class': 'gsp-btn gsp-btn--ghost', text: T('classroom.close', '닫기'),
        on: { click: function () { ref.fn(); } } })
    ]);
    var wrap = h('div', { 'class': 'gsp-dialog', style: 'background:transparent;border:0;box-shadow:none;max-width:820px;' }, [toolbar, sheet]);
    ref.fn = mountScrim(wrap, null);
  }

  /* ---- 수업 진행(플레이리스트) 내비게이션 ---- */
  function mountLessonNav(exp) {
    var course = loadCourse();
    if (!course.length) return;
    var i = course.findIndex(function (x) { return x.id === exp.id || x.slug === exp.slug; });
    if (i < 0) return;
    function expUrl(item) { return '../' + item.category + '/' + item.slug + '.html#lesson'; }
    var prev = course[i - 1], next = course[i + 1];
    var bar = h('div', { 'class': 'gsp-cbar', role: 'navigation', 'aria-label': 'lesson',
      style: 'justify-content:space-between;align-items:center;' }, [
      prev ? h('button', { text: T('classroom.prev', '◀ 이전'), on: { click: function () { location.href = expUrl(prev); } } })
           : h('span', {}),
      h('span', { 'class': 'gsp-muted', text: T('classroom.lessonOf', '{i} / {n}', { i: i + 1, n: course.length }) }),
      next ? h('button', { text: T('classroom.next', '다음 ▶'), on: { click: function () { location.href = expUrl(next); } } })
           : h('button', { text: T('classroom.exit', '교실 모드 종료'), on: { click: function () { location.href = '../../index.html'; } } })
    ]);
    insertAfterTopbar(bar);
  }

  return { initHub: initHub, initExp: initExp };
})();
