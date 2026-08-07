/**
 * SimSPEND · splash.js
 * 스플래시 화면 노출 후 메인 화면으로 자동 전환
 *
 * NOTE: 메인 대시보드 화면은 다음 작업 단계에서 main.html로 제작 예정입니다.
 * (index.html은 이번 요청에 따라 스플래시 화면 파일명으로 사용)
 */

(function () {
  var SPLASH_DURATION_MS = 1800; // 로고 노출 시간
  var FADE_DURATION_MS = 400;    // 페이드 아웃 시간
  var NEXT_PAGE = 'main.html';   // 다음 단계에서 생성될 메인 화면 파일

  var splashEl = document.getElementById('splash');

  function goToMain() {
    splashEl.classList.add('is-leaving');
    setTimeout(function () {
      window.location.href = NEXT_PAGE;
    }, FADE_DURATION_MS);
  }

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(goToMain, SPLASH_DURATION_MS);
  });
})();
