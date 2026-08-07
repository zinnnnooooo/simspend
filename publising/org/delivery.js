/**
 * SimSPEND · delivery.js
 * 오늘 구매 총액과 배송 프로세스 스테퍼를 렌더링합니다.
 */

(function () {
  var fmtWon = function (n) {
    return '₩' + Math.round(n).toLocaleString('ko-KR');
  };

  var ICONS = {
    box:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3.5 8.2 12 4l8.5 4.2v7.6L12 20l-8.5-4.2Z"/>' +
      '<path d="M3.5 8.2 12 12l8.5-3.8"/>' +
      '<path d="M12 12v8"/>' +
      '</svg>',
    truck:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="2.5" y="7" width="11.5" height="9" rx="1.2"/>' +
      '<path d="M14 10h4l3 3v3h-7z"/>' +
      '<circle cx="7" cy="18" r="1.6"/>' +
      '<circle cx="17.5" cy="18" r="1.6"/>' +
      '</svg>',
    pin:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/>' +
      '<circle cx="12" cy="9.5" r="2.2"/>' +
      '</svg>'
  };

  // 배송 진행 단계 (state: 'done' | 'active' | 'pending')
  var steps = [
    { key: 'prepare', label: '준비 중', icon: 'box', state: 'done' },
    { key: 'shipping', label: '배송 중', icon: 'truck', state: 'active' },
    { key: 'arrived', label: '도착 완료', icon: 'pin', state: 'pending' }
  ];

  function renderAmount() {
    var weekly = window.SimSpendData.getWeeklySummary();
    document.getElementById('deliveryAmount').textContent = fmtWon(weekly.total);
  }

  function renderStepper() {
    var container = document.getElementById('deliveryStepper');
    var html = '';

    steps.forEach(function (step, i) {
      var stateClass = step.state === 'pending' ? '' : ' is-' + step.state;
      html +=
        '<div class="delivery__step' + stateClass + '">' +
        '<span class="delivery__step-icon">' + ICONS[step.icon] + '</span>' +
        '<span class="delivery__step-label">' + step.label + '</span>' +
        '</div>';

      if (i < steps.length - 1) {
        var nextIsFilled = step.state === 'done';
        html += '<span class="delivery__connector' + (nextIsFilled ? ' is-filled' : '') + '"></span>';
      }
    });

    container.innerHTML = html;
  }

  window.addEventListener('DOMContentLoaded', function () {
    renderAmount();
    renderStepper();
  });
})();
