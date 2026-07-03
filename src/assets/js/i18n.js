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
        return loadDesc().then(loadBody).then(applyBody).then(function () { return dict; });
      })
      .catch(function () { /* 정적 서버 아님: 원문 유지 */ return {}; });
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
    load: load, t: t, set: set, apply: apply, mountSwitcher: mountSwitcher, desc: desc,
    lang: function () { return lang; }, dir: function () { return dir; }, supported: SUPPORTED
  };
})();
