/*
 * a11y.js — Git Science Park v2.0-B 접근성 보조 (Zero-Dependency)
 * ------------------------------------------------------------------
 * - 색약(color-blind) 보조 모드 토글: localStorage 'gsp:cb', <html class="gsp-cb">
 *   허브 카테고리 색을 Okabe-Ito(색약 친화) 팔레트로 교체한다.
 * - prefers-reduced-motion 감지 플래그 제공(window.A11y.reducedMotion()).
 * - 상단바용 아이콘 토글 버튼(mountToggle): 텍스트 대신 aria-label/title 로 접근명 제공.
 * 색 정보엔 항상 텍스트·아이콘·별점 등 비색(非色) 단서를 함께 둔다.
 */
window.A11y = (function () {
  'use strict';
  var CB_KEY = 'gsp:cb';

  // Okabe-Ito: 8색 정성 팔레트(1·2·3색약에서 구분 가능)
  var OKABE = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#666666'];

  function isCB() {
    try { return localStorage.getItem(CB_KEY) === '1'; } catch (e) { return false; }
  }
  function applyClass() {
    document.documentElement.classList.toggle('gsp-cb', isCB());
  }
  function toggle() {
    try { localStorage.setItem(CB_KEY, isCB() ? '0' : '1'); } catch (e) {}
    location.reload();
  }
  function palette() { return OKABE.slice(); }

  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  function mountToggle(mount, label) {
    if (!mount) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'cb-toggle';
    btn.className = 'topbar-btn';
    btn.textContent = '◐';
    btn.setAttribute('aria-pressed', isCB() ? 'true' : 'false');
    btn.setAttribute('aria-label', label || 'Color-blind palette');
    btn.setAttribute('title', label || 'Color-blind palette');
    btn.addEventListener('click', toggle);
    mount.appendChild(btn);
  }

  applyClass(); // 로드 즉시 클래스 반영(렌더 전)

  return {
    isCB: isCB, toggle: toggle, palette: palette,
    reducedMotion: reducedMotion, mountToggle: mountToggle, applyClass: applyClass
  };
})();
