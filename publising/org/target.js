/**
 * SimSPEND · target.js
 * data.js의 저축 목표 리스트를 화면에 렌더링합니다.
 */

(function () {
  var fmtWon = function (n) {
    return n.toLocaleString('ko-KR') + '원';
  };

  var ICONS = {
    travel:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M10.5 15.5 3 13l1.6-1.6 4.7 1 3.3-3.3-7-4L7 3.5l9 3 3-3a2 2 0 0 1 2.8 2.8l-3 3 3 9-1.6 1.6-4-7-3.3 3.3 1 4.7L13.5 21l-2.5-7.5Z"/>' +
      '</svg>',
    laptop:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="4" y="5" width="16" height="10.5" rx="1.4"/>' +
      '<path d="M2.5 19h19"/>' +
      '</svg>',
    phone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/>' +
      '<circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none"/>' +
      '</svg>'
  };

  function renderTotalSaved() {
    var total = window.SimSpendData.getTotalSaved();
    document.getElementById('totalSaved').textContent = '₩' + total.toLocaleString('ko-KR');
  }

  function renderActionArea(goal) {
    if (goal.actionType === 'edit-fill') {
      return (
        '<div class="goal-item__actions">' +
        '<button type="button" class="goal-item__btn goal-item__btn--ghost">금액 수정</button>' +
        '<button type="button" class="goal-item__btn goal-item__btn--solid">채우기</button>' +
        '</div>'
      );
    }
    if (goal.actionType === 'tip') {
      return (
        '<div class="goal-item__tip">' +
        '<span class="goal-item__tip-icon" aria-hidden="true">i</span>' +
        '<p class="goal-item__tip-text">' + goal.tip + '</p>' +
        '</div>'
      );
    }
    if (goal.actionType === 'celebrate') {
      var remaining = goal.target - goal.saved;
      return (
        '<div class="goal-item__celebrate">🎉 거의 다 왔어요! ' + remaining.toLocaleString('ko-KR') + '원 남음</div>'
      );
    }
    return '';
  }

  function renderGoalList() {
    var goals = window.SimSpendData.getSavingsGoalsList();
    var container = document.getElementById('goalList');

    container.innerHTML = goals
      .map(function (goal) {
        var percent = Math.round((goal.saved / goal.target) * 100);
        var meta = goal.daysLeft !== null
          ? 'D-' + goal.daysLeft + ' · ' + goal.targetDate + ' 목표'
          : goal.statusLabel;

        return (
          '<div class="card goal-item">' +
          '<div class="goal-item__top">' +
          '<span class="goal-item__icon">' + ICONS[goal.icon] + '</span>' +
          '<div class="goal-item__title-wrap">' +
          '<p class="goal-item__title">' + goal.title + '</p>' +
          '<p class="goal-item__meta">' + meta + '</p>' +
          '</div>' +
          '<span class="goal-item__percent">' + percent + '%</span>' +
          '</div>' +
          '<div class="goal-item__amount-row">' +
          '<span>' + fmtWon(goal.saved) + '</span>' +
          '<span>목표 ' + fmtWon(goal.target) + '</span>' +
          '</div>' +
          '<div class="goal-item__bar"><div class="goal-item__bar-fill" style="width:' + percent + '%"></div></div>' +
          renderActionArea(goal) +
          '</div>'
        );
      })
      .join('');
  }

  window.addEventListener('DOMContentLoaded', function () {
    renderTotalSaved();
    renderGoalList();
  });
})();
