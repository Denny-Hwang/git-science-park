/*
 * i18n.js — Git Science Park 다국어 엔진 (Zero-Dependency)
 * ---------------------------------------------------------------
 * 10개 언어 UI 번역. 허브와 실험 페이지가 공유한다.
 *  - I18n.load()             : 저장/브라우저 언어로 로케일 로드, <html lang/dir> 설정, [data-i18n] 적용
 *  - I18n.t(key, vars)       : 키 → 번역 문자열({n} 등 치환)
 *  - I18n.apply(root)        : [data-i18n]/[data-i18n-ph|aria|title] 적용
 *  - I18n.mountSwitcher(el)  : 언어 드롭다운(<select>) 생성, 변경 시 저장 후 reload
 * 로케일 경로는 window.I18N_BASE (허브 "./assets/i18n/", 실험 "../../assets/i18n/").
 */
window.I18n = (function () {
  'use strict';
  var SUPPORTED = [
    ['en', 'English'], ['ko', '한국어'], ['zh', '中文'], ['ja', '日本語'],
    ['es', 'Español'], ['hi', 'हिन्दी'], ['ru', 'Русский'], ['he', 'עברית'],
    ['pt', 'Português'], ['ar', 'العربية']
  ];
  var CODES = SUPPORTED.map(function (s) { return s[0]; });
  var dict = {}, lang = 'en', dir = 'ltr';
  var descDict = {}; // 실험 설명(slug → 번역문) — assets/i18n/exp/<lang>.json
  var bodyDict = {}; // 실험 본문(한국어 원문 → 번역문) — assets/i18n/body/<lang>.json
  var runDict = null; // 런타임 조각 사전(한국어 조각 → 번역문) — assets/i18n/runtime/<lang>.json
  var runKeys = [];   // runDict 키 길이 내림차순(긴 조각부터 치환해 부분 겹침 방지)
  var HANGUL = /[가-힣]/;

  function base() { return window.I18N_BASE || './assets/i18n/'; }

  function pick() {
    var saved = null;
    try { saved = localStorage.getItem('gsp:lang'); } catch (e) {}
    if (saved && CODES.indexOf(saved) !== -1) return saved;
    var nav = ((navigator.language || 'en').slice(0, 2)).toLowerCase();
    return CODES.indexOf(nav) !== -1 ? nav : 'en';
  }

  function get(key) {
    return key.split('.').reduce(function (o, k) {
      return (o && o[k] != null) ? o[k] : null;
    }, dict);
  }

  function t(key, vars) {
    var v = get(key);
    if (v == null) return key;
    if (vars) Object.keys(vars).forEach(function (k) {
      v = v.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    });
    return v;
  }

  function apply(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    scope.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
  }

  function load() {
    lang = pick();
    var url = base() + lang + '.json';
    return fetch(url, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('locale'); return r.json(); })
      .catch(function () { return fetch(base() + 'en.json').then(function (r) { return r.json(); }); })
      .then(function (j) {
        dict = j || {};
        lang = dict._lang || lang;
        dir = dict._dir || 'ltr';
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dir);
        apply(document);
        return loadDesc().then(loadBody).then(applyBody).then(loadRuntime).then(activateRuntime).then(function () { return dict; });
      })
      .catch(function () { /* 정적 서버 아님: 원문 유지 */ return {}; });
  }

  /* ================================================================
   *  런타임 조각 번역(runtime) — canvas 라벨, JS가 쓰는 동적 DOM 텍스트,
   *  실험 페이지 헤더(제목·연도·과학자), 허브 카드 메타를 한 사전으로 처리.
   *  키는 "한국어 조각"이고, 렌더된 문자열에서 조각을 치환한다.
   * ================================================================ */
  function loadRuntime() {
    if (lang === 'ko') { setRuntime(null); return Promise.resolve(); }
    return fetch(base() + 'runtime/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { setRuntime(j); })
      .catch(function () { setRuntime(null); });
  }
  function setRuntime(j) {
    runDict = null; runKeys = [];
    if (j && typeof j === 'object') {
      // tr()이 매칭 전 공백을 하나로 접으므로 키도 같은 방식으로 정규화한다
      // (원본 JSON 키에 개행/이중 공백이 있어도 런타임 텍스트와 일치하도록).
      runDict = {};
      Object.keys(j).forEach(function (k) {
        var nk = k.replace(/[\s\u00a0]+/g, ' ');
        if (!(nk in runDict)) runDict[nk] = j[k];
      });
      runKeys = Object.keys(runDict).sort(function (a, b) { return b.length - a.length; });
    }
  }

  // 짧은 한글 조각(≤2자)은 앞뒤가 한글이면 단어 내부로 보고 치환하지 않는다.
  // 단, 앞이 숫자면(예: "10년", "45도") 단위로 보고 뒤가 한글이어도 치환한다.
  function replAll(s, k, v) {
    if (k.length <= 2 && /^[가-힣]+$/.test(k)) {
      var out = '', i = 0, kl = k.length;
      while (i < s.length) {
        if (s.substr(i, kl) === k) {
          var prev = i > 0 ? s.charAt(i - 1) : '';
          var next = s.charAt(i + kl);
          var safe = (!HANGUL.test(prev) && !HANGUL.test(next)) || /[0-9]/.test(prev);
          if (safe) { out += v; i += kl; continue; }
        }
        out += s.charAt(i); i++;
      }
      return out;
    }
    return s.split(k).join(v);
  }

  // 한 문자열 안의 한국어 조각을 번역으로 치환. 한국어가 없으면 그대로 반환.
  function tr(s) {
    if (s == null) return s;
    s = String(s);
    if (!runDict || !HANGUL.test(s)) return s;
    // 사전 키는 공백이 하나로 정규화돼 있으므로 DOM 텍스트의 nbsp·개행·연속 공백을
    // 하나로 접어 매칭한다(인라인 라벨이라 시각적 영향 없음). 한국어가 있을 때만 수행.
    s = s.replace(/[\s\u00a0]+/g, ' ');
    for (var i = 0; i < runKeys.length; i++) {
      var k = runKeys[i], v = runDict[k];
      if (v == null || v === '') continue;
      if (s.indexOf(k) !== -1) s = replAll(s, k, v);
      if (!HANGUL.test(s)) break; // 남은 한국어가 없으면 조기 종료(짧은 라벨 최적화)
    }
    return s;
  }

  // canvas 텍스트 그리기(fillText/strokeText)를 감싸 그려지는 문자열을 번역.
  var canvasPatched = false;
  function patchCanvas() {
    if (canvasPatched) return; canvasPatched = true;
    var P = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (!P) return;
    ['fillText', 'strokeText'].forEach(function (m) {
      var orig = P[m];
      if (typeof orig !== 'function') return;
      P[m] = function (text) {
        if (typeof text === 'string' && HANGUL.test(text)) {
          try { arguments[0] = tr(text); } catch (e) {}
        }
        return orig.apply(this, arguments);
      };
    });
  }

  // 요소 하위 텍스트 노드의 한국어를 번역(스크립트/스타일/캔버스/편집영역 제외).
  function fixNode(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      if (node.nodeValue && HANGUL.test(node.nodeValue)) {
        var v = tr(node.nodeValue);
        if (v !== node.nodeValue) node.nodeValue = v;
      }
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CANVAS' || tag === 'TEXTAREA' || node.isContentEditable) return;
    for (var n = node.firstChild; n; n = n.nextSibling) fixNode(n);
  }

  // 정적 헤더/네비/푸터(제목·메타·배지·관련링크·저작권) 번역.
  // <main> 본문은 BodyI18n가 먼저 처리하고, 남은 한국어 조각(초기 동적 텍스트·
  // 사전 미등록 라벨·수식 상자 등)은 여기서 한 번 훑어 마저 번역한다.
  function translateStatic() {
    if (!runDict) return;
    ['header', 'nav', '.cat-badge', 'footer', 'main'].forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) fixNode(els[i]);
    });
  }

  // JS가 갱신하는 동적 DOM 텍스트(판정·피드백·계산 라벨)를 감시해 번역.
  var observing = false;
  function observeDynamic() {
    if (observing || !runDict || !window.MutationObserver) return;
    var main = document.querySelector('main');
    if (!main) return;
    observing = true;
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var mu = muts[i];
        if (mu.type === 'characterData') fixNode(mu.target);
        else if (mu.addedNodes) { for (var j = 0; j < mu.addedNodes.length; j++) fixNode(mu.addedNodes[j]); }
      }
    });
    mo.observe(main, { subtree: true, childList: true, characterData: true });
  }

  // 번역 사전이 준비된 뒤 초기 캔버스를 다시 그리도록 상호작용 이벤트를 유도.
  // 페이지 핸들러가 던지는 예외로 다른 컨트롤 재렌더가 막히지 않게 개별 보호한다.
  function forceRedraw() {
    var ctrls = document.querySelectorAll('input[type=range], input[type=number], select');
    for (var i = 0; i < ctrls.length; i++) {
      try { ctrls[i].dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
    }
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('gsp:i18n')); } catch (e) {}
  }

  function activateRuntime() {
    try {
      patchCanvas();          // 이후 모든 canvas 텍스트 자동 번역
      if (runDict) {
        translateStatic();    // 헤더/네비/배지
        observeDynamic();     // 동적 DOM 감시
        forceRedraw();        // 초기 캔버스 재렌더
      }
    } catch (e) {}
    return Promise.resolve();
  }

  // 실험 설명 로케일(slug → 번역) 로드. 실패해도 원문(데이터의 description) 유지.
  function loadDesc() {
    return fetch(base() + 'exp/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('desc'); return r.json(); })
      .then(function (j) { descDict = j || {}; })
      .catch(function () { descDict = {}; });
  }
  function desc(slug) {
    return (descDict && descDict[slug] != null) ? descDict[slug] : null;
  }

  // 실험 본문 로케일 로드. body/manifest.json 의 langs 에 있는 언어만 실제 사전을
  // 가져온다(아직 번역이 없는 언어는 요청 자체를 하지 않아 404가 발생하지 않음).
  function loadBody() {
    if (lang === 'ko') { bodyDict = {}; return Promise.resolve(); }
    return fetch(base() + 'body/manifest.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : { langs: [] }; })
      .then(function (m) {
        var langs = (m && m.langs) || [];
        if (langs.indexOf(lang) === -1) { bodyDict = {}; return; }
        return fetch(base() + 'body/' + lang + '.json', { cache: 'no-cache' })
          .then(function (r) { return r.ok ? r.json() : {}; })
          .then(function (j) { bodyDict = j || {}; });
      })
      .catch(function () { bodyDict = {}; });
  }
  // 실험 페이지 <main> 정적 본문을 번역(BodyI18n 있고 번역 사전 있을 때만).
  function applyBody() {
    try {
      if (lang !== 'ko' && window.BodyI18n && bodyDict) {
        var main = document.querySelector('main');
        if (main) window.BodyI18n.apply(main, bodyDict);
      }
    } catch (e) {}
  }

  function set(code) {
    try { localStorage.setItem('gsp:lang', code); } catch (e) {}
    location.reload();
  }

  function mountSwitcher(mount) {
    if (!mount) return;
    var sel = document.createElement('select');
    sel.className = 'lang-switcher';
    sel.setAttribute('aria-label', t('lang.label') || 'Language');
    SUPPORTED.forEach(function (s) {
      var o = document.createElement('option');
      o.value = s[0]; o.textContent = s[1];
      if (s[0] === lang) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () { set(sel.value); });
    mount.appendChild(sel);
  }

  return {
    load: load, t: t, set: set, apply: apply, mountSwitcher: mountSwitcher, desc: desc, tr: tr,
    lang: function () { return lang; }, dir: function () { return dir; }, supported: SUPPORTED
  };
})();
