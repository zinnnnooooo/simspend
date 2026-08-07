/**
 * SimSPEND · mypage.js
 * 프로필 아바타 렌더링 및 다크모드 토글 인터랙션
 */

(function () {
  function renderAvatar() {
    var el = document.getElementById('profileAvatar');
    el.innerHTML =
      '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="56" height="56" fill="#FFE8B8"/>' +
      '<circle cx="28" cy="23" r="10" fill="#2B2D42"/>' +
      '<path d="M6 56c0-12 9-19 22-19s22 7 22 19" fill="#2B2D42"/>' +
      '</svg>';
  }

  function setupDarkModeToggle() {
    var toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('click', function () {
      var isOn = toggle.classList.toggle('is-on');
      toggle.setAttribute('aria-checked', isOn ? 'true' : 'false');
      // NOTE: 실제 다크모드 테마 전환 로직은 추후 스타일 가이드 확정 후 연결 예정
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    renderAvatar();
    setupDarkModeToggle();
  });
})();
