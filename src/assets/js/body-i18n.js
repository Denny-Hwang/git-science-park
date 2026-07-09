/*
 * body-i18n.js — 실험 페이지 본문(HTML) 런타임 다국어화 (Zero-Dependency)
 * ------------------------------------------------------------------
 * 실험 페이지 <main> 안의 정적 한국어 텍스트를 언어별 사전으로 치환한다.
 * 페이지 HTML을 고치지 않고 런타임 DOM 워크로 적용하므로 안전하다.
 *  - 동적 값(id 가진 요소)·입력·canvas/script/style 은 건드리지 않는다.
 *  - 키는 "정규화된 한국어 원문" 자체 → 같은 문장은 한 번만 번역(중복 제거).
 *  - extract(root): 번역 대상 원문 목록(추출) / apply(root, map): 사전 적용
 * canvas 안에 그려지는 라벨은 DOM 텍스트가 아니라 JS 드로잉이라 대상이 아니다.
 */
window.BodyI18n = (function () {
  'use strict';

  // 통째로 번역해도 안전한 인라인 강조 태그(중첩 구조를 평문으로 눌러도 무방)
  var SAFE_INLINE = { STRONG: 1, EM: 1, B: 1, I: 1, CODE: 1, SUB: 1, SUP: 1, MARK: 1, SMALL: 1, U: 1, BR: 1 };
  // 본문 콘텐츠로 볼 요소들(+ SVG <text>). formula-box(수식)와 header/nav/footer는 제외.
  var CONTENT_SEL = 'p,li,h2,h3,h4,button,label,th,td,figcaption,summary,dt,dd,div,span,text';

  function hasKorean(s) { return /[가-힣]/.test(s); }
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  function skip(el) {
    // 이미 UI i18n 처리된 것/수식/동적 오버레이 등은 건너뛴다.
    return el.closest('.formula-box, [data-i18n], .gsp-scrim, .gsp-guide-panel, .gsp-cbar, .topbar, .exp-related, .exp-learn, script, style');
  }

  function units(root) {
    var out = [];
    var seenText = []; // 중복 텍스트노드 방지용(부모-자식 동시 선택 대비)
    var els = root.querySelectorAll(CONTENT_SEL);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      // id 있는 요소는 원칙적으로 제외(동적 값). 단, 정적 라벨인 <button> 과
      // 정적 퀴즈 문항(#quiz-q)은 예외로 번역한다. (판정·결과·서술 등 JS가
      // 다시 쓰는 요소는 그대로 두어 상호작용 시 언어가 뒤섞이지 않게 한다.)
      if (el.id && el.tagName !== 'BUTTON' && el.id !== 'quiz-q') continue;
      if (skip(el)) continue;
      // pureInline: 자식이 전부 안전한 인라인 태그이고 id가 없으면 통째 번역.
      // 인라인 태그 "속에" id 요소(동적 값)가 중첩돼 있으면 통째 치환 시 그 요소가
      // 파괴되므로 제외한다(예: <strong><span id="r-state">…</span></strong>).
      var pure = true;
      var kids = el.children;
      for (var k = 0; k < kids.length; k++) {
        if (SAFE_INLINE[kids[k].tagName] !== 1 || kids[k].id ||
            (kids[k].querySelector && kids[k].querySelector('[id]'))) { pure = false; break; }
      }
      if (pure) {
        var txt = el.textContent;
        if (hasKorean(txt)) out.push({ el: el, mode: 'whole', key: norm(txt) });
      } else {
        // 직속 텍스트 노드만(라벨 접두/접미), 동적 자식 요소는 그대로 둔다.
        for (var n = el.firstChild; n; n = n.nextSibling) {
          if (n.nodeType === 3 && hasKorean(n.nodeValue) && seenText.indexOf(n) === -1) {
            seenText.push(n);
            out.push({ node: n, mode: 'text', key: norm(n.nodeValue) });
          }
        }
      }
    }
    return out;
  }

  function extract(root) {
    var keys = {}, list = units(root || document.querySelector('main') || document.body);
    for (var i = 0; i < list.length; i++) keys[list[i].key] = 1;
    return Object.keys(keys);
  }

  function apply(root, map) {
    if (!map) return 0;
    var n = 0, list = units(root || document.querySelector('main') || document.body);
    for (var i = 0; i < list.length; i++) {
      var u = list[i], v = map[u.key];
      if (v == null || v === '') continue;
      if (u.mode === 'whole') { u.el.textContent = v; n++; }
      else {
        // 원문의 앞뒤 공백을 유지하며 가운데만 치환
        var raw = u.node.nodeValue;
        var lead = (raw.match(/^\s*/) || [''])[0];
        var trail = (raw.match(/\s*$/) || [''])[0];
        u.node.nodeValue = lead + v + trail;
        n++;
      }
    }
    return n;
  }

  return { extract: extract, apply: apply };
})();
