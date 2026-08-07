/**
 * SimSPEND · main.js (메인 대시보드)
 * data.js의 데이터를 메인 대시보드 DOM에 바인딩합니다.
 */

(function () {
  var fmtWon = function (n) {
    return '₩' + Math.round(n).toLocaleString('ko-KR');
  };

  function renderAvatar() {
    var el = document.getElementById('headerAvatar');
    el.innerHTML =
      '<svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="46" height="46" fill="#FFE8B8"/>' +
      '<circle cx="23" cy="19" r="8" fill="#2B2D42"/>' +
      '<path d="M6 46c0-10 7.5-16 17-16s17 6 17 16" fill="#2B2D42"/>' +
      '</svg>' +
      '<span class="header__avatar-edit" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M15.5 4.5 19.5 8.5 9 19H5v-4L15.5 4.5Z" stroke="#2B2D42" stroke-width="2" stroke-linejoin="round"/>' +
      '</svg>' +
      '</span>';
  }

  function renderStreak() {
    var streak = window.SimSpendData.getStreak();
    var row = document.getElementById('streakRow');
    var checkSvg =
      '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17 19 7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    row.innerHTML = streak.labels
      .map(function (label, i) {
        var checked = streak.checked[i];
        return (
          '<div class="streak__day' + (checked ? ' is-checked' : '') + '">' +
          '<span class="streak__badge">' + (checked ? checkSvg : '') + '</span>' +
          '<span class="streak__day-label">' + label + '</span>' +
          '</div>'
        );
      })
      .join('');

    document.getElementById('streakTitle').textContent =
      streak.currentStreak + '일 연속 가계부 작성 중! 🔥';
  }

  function renderBarChart() {
    var weekly = window.SimSpendData.getWeeklySummary();
    var container = document.getElementById('barChart');
    var maxAmount = Math.max.apply(null, weekly.amounts);
    var peakIndex = weekly.amounts.indexOf(maxAmount);

    container.innerHTML = weekly.days
      .map(function (day, i) {
        var heightPct = Math.max(14, Math.round((weekly.amounts[i] / maxAmount) * 100));
        var isPeak = i === peakIndex;
        return (
          '<div class="bar-chart__col' + (isPeak ? ' is-peak' : '') + '">' +
          '<div class="bar-chart__bar" style="height:' + heightPct + '%"></div>' +
          '<span class="bar-chart__label">' + day + '</span>' +
          '</div>'
        );
      })
      .join('');

    document.getElementById('weeklyTotal').textContent = fmtWon(weekly.total);

    var badge = document.getElementById('weeklyDiffBadge');
    var diff = weekly.diffFromLastWeek;
    if (diff === 0) {
      badge.textContent = '지난주와 지출이 같아요!';
    } else {
      var manwon = Math.round(Math.abs(diff) / 10000);
      var diffLabel = manwon > 0 ? manwon + '만원' : Math.abs(diff).toLocaleString('ko-KR') + '원';
      badge.textContent =
        '지난주 보다 ' + diffLabel + (diff > 0 ? ' 더 썼어요!' : ' 덜 썼어요!');
    }
  }

  function renderDonut() {
    var top = window.SimSpendData.getTopCategory();
    var ring = document.getElementById('donutRing');
    var radius = 40;
    var circumference = 2 * Math.PI * radius;
    var fillLength = (top.percentage / 100) * circumference;

    ring.setAttribute('stroke-dasharray', fillLength + ' ' + circumference);
    document.getElementById('donutValue').textContent = top.percentage + '%';
    document.getElementById('topCategoryName').textContent = top.name;
  }

  function renderGoal() {
    var goal = window.SimSpendData.getSavingsGoal();
    var percent = Math.round((goal.saved / goal.target) * 100);
    var remaining = goal.target - goal.saved;
    var segmentCount = 5;
    var progressUnits = (percent / 100) * segmentCount;

    document.getElementById('goalTitle').textContent = goal.title;
    document.getElementById('goalDday').textContent = 'D' + (goal.dDay <= 0 ? goal.dDay : '+' + goal.dDay);
    document.getElementById('goalPercent').textContent = percent + '%';
    document.getElementById('goalCaption').textContent =
      '목표까지 ' + fmtWon(remaining) + ' 남았어요!';

    var progressEl = document.getElementById('goalProgress');
    var segmentsHtml = '';
    for (var i = 0; i < segmentCount; i++) {
      var fillRatio = Math.min(1, Math.max(0, progressUnits - i));
      segmentsHtml +=
        '<div class="goal-progress__seg">' +
        '<div class="goal-progress__seg-fill" style="width:' + fillRatio * 100 + '%"></div>' +
        '</div>';
    }
    progressEl.innerHTML = segmentsHtml;
  }

  function renderQuickMenu() {
    var items = window.SimSpendData.getQuickMenu();
    var grid = document.getElementById('quickMenuGrid');
    grid.innerHTML = items
      .map(function (item) {
        return (
          '<div class="quickmenu__item">' +
          '<div class="quickmenu__thumb">' +
(item.label === '가상 쇼핑'
  ? '<i class="fa-solid fa-cart-shopping"></i>'
  : item.label === '가상 배달'
  ? '<i class="fa-solid fa-burger"></i>'
    : item.label === '가상 구매 목록'
  ? '<i class="fa-solid fa-list-check"></i>'
      : item.label === 'AI 리포트'
  ? '<i class="fa-solid fa-chart-column"></i>'
  : '') +
'</div>' +
          '<span class="quickmenu__label">' + item.label + '</span>' +
          '</div>'
        );
      })
      .join('');
  }

  window.addEventListener('DOMContentLoaded', function () {
    renderAvatar();
    renderStreak();
    renderBarChart();
    renderDonut();
    renderGoal();
    renderQuickMenu();
  });
})();
