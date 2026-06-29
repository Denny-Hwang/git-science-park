/*
 * exp.js — Git Science Park 실험 페이지 공통 셸(shell) 스크립트
 * ---------------------------------------------------------------
 * 신규/리팩토링 실험 페이지에서 재사용하는 헬퍼.
 *  - SciExp.initTabs()       : .tab-btn ↔ .tab-content 전환 + ARIA
 *  - SciExp.grade(...)       : 퀴즈 라디오 채점
 *  - SciExp.mountRelated()   : experiments.json을 읽어 "관련 실험" 칩 렌더(선택)
 * 외부 의존성 없음(ES6+). 기존 v1.0 실험은 인라인 자기완결을 유지하며 이 파일은 점진 적용 대상이다.
 */
(function (global) {
  'use strict';

  function initTabs(root) {
    var scope = root || document;
    var btns = [].slice.call(scope.querySelectorAll('.tab-btn'));
    var panels = [].slice.call(scope.querySelectorAll('.tab-content'));
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        var target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  }

  // 퀴즈 채점: name(라디오 그룹), feedbackEl(id), 정답 value, 메시지
  function grade(name, feedbackId, correctValue, correctMsg, wrongMsg) {
    var picked = document.querySelector('input[name="' + name + '"]:checked');
    var out = document.getElementById(feedbackId);
    if (!out) return;
    if (!picked) { out.textContent = '답을 선택하세요.'; out.className = 'feedback'; return; }
    var ok = picked.value === correctValue;
    out.textContent = ok ? (correctMsg || '정답입니다! 🎉') : (wrongMsg || '다시 생각해 보세요.');
    out.className = 'feedback ' + (ok ? 'correct' : 'wrong');
  }

  // 현재 페이지 slug/category 를 경로에서 추정해 관련 실험 칩을 mountSel 안에 렌더
  function mountRelated(mountSel, dataUrl) {
    var mount = document.querySelector(mountSel || '.exp-related .chips');
    if (!mount) return;
    var parts = location.pathname.split('/');
    var file = parts.pop() || '';
    var category = parts.pop() || '';
    var slug = file.replace(/\.html$/, '');
    fetch(dataUrl || '../../data/experiments.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var exps = data.experiments || [];
        var self = exps.filter(function (e) { return e.category === category && e.slug === slug; })[0];
        if (!self) return;
        var sameCat = exps.filter(function (e) { return e.category === category; })
          .sort(function (a, b) { return a.id - b.id; });
        var idx = sameCat.findIndex(function (e) { return e.id === self.id; });
        var picks = [];
        if (idx > 0) picks.push({ e: sameCat[idx - 1], tag: '◀ 이전' });
        if (idx >= 0 && idx < sameCat.length - 1) picks.push({ e: sameCat[idx + 1], tag: '다음 ▶' });
        // 키워드 겹침 상위
        var kw = new Set(self.keywords || []);
        var scored = exps.filter(function (e) { return e.id !== self.id; })
          .map(function (e) {
            var s = (e.keywords || []).filter(function (k) { return kw.has(k); }).length;
            return { e: e, s: s };
          }).filter(function (o) { return o.s > 0; }).sort(function (a, b) { return b.s - a.s; });
        var usedIds = picks.map(function (p) { return p.e.id; });
        scored.forEach(function (o) {
          if (picks.length >= 5 || usedIds.indexOf(o.e.id) !== -1) return;
          picks.push({ e: o.e, tag: '🔗' }); usedIds.push(o.e.id);
        });
        picks.forEach(function (p) {
          var a = document.createElement('a');
          a.href = '../' + p.e.category + '/' + p.e.slug + '.html';
          a.textContent = p.tag + ' ' + p.e.title;
          mount.appendChild(a);
        });
      })
      .catch(function () { /* 정적 서버 아닐 때 조용히 무시 */ });
  }

  global.SciExp = { initTabs: initTabs, grade: grade, mountRelated: mountRelated };
})(window);
