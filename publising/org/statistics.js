/**
 * SimSPEND · statistics.js
 * data.js의 통계 관련 데이터를 통계 화면 DOM에 바인딩합니다.
 */

(function () {
  var CATEGORY_COLORS = ['#2B2D42', '#5C5F7A', '#9799AC', '#C6C8D4', '#E4E5EA'];

  var fmtWon = function (n) {
    return '₩' + Math.round(n).toLocaleString('ko-KR');
  };

  function setRingPercent(ringEl, percent, radius) {
    var circumference = 2 * Math.PI * radius;
    var fillLength = (percent / 100) * circumference;
    ringEl.setAttribute('stroke-dasharray', fillLength + ' ' + circumference);
    ringEl.setAttribute('stroke-linecap', percent > 0 && percent < 100 ? 'round' : 'butt');
  }

  function renderMonthlyTotal() {
    var month = '2024-10';
    var total = window.SimSpendData.getMonthlyTotal(month);
    var stats = window.SimSpendData.getMonthlyStats();

    document.getElementById('monthlyTotal').textContent = fmtWon(total);
    document.getElementById('monthlyDiffPill').textContent =
      (stats.diffPercentFromLastMonth >= 0 ? '+' : '') + stats.diffPercentFromLastMonth + '%';
  }

  function renderBudget() {
    var budget = window.SimSpendData.getBudgetGoal();
    setRingPercent(document.getElementById('budgetRing'), budget.achievedPercent, 40);
    document.getElementById('budgetPercent').textContent = budget.achievedPercent + '%';
    document.getElementById('budgetCaption').textContent = '예산 ' + budget.target.toLocaleString('ko-KR') + '원';
  }

  function renderSaved() {
    var saved = window.SimSpendData.getSavedAmount();
    document.getElementById('savedAmount').textContent = fmtWon(saved);
  }

  function renderSavingsProgress() {
    var progress = window.SimSpendData.getSavingsProgress();
    document.getElementById('savingsProgressFill').style.width = progress.percentage + '%';
    document.getElementById('savingsProgressPercent').textContent = progress.percentage + '%';
  }

  function renderCategoryBreakdown() {
    var list = window.SimSpendData.getCategoryBreakdown();
    var top = list[0];

    setRingPercent(document.getElementById('categoryRing'), top.percentage, 40);
    document.getElementById('categoryDonutValue').textContent = top.percentage + '%';

    var legend = document.getElementById('categoryLegend');
    legend.innerHTML = list
      .map(function (item, i) {
        return (
          '<div class="category-legend__row">' +
          '<span class="category-legend__dot" style="background:' + CATEGORY_COLORS[i % CATEGORY_COLORS.length] + '"></span>' +
          '<span class="category-legend__name">' + item.name + '</span>' +
          '<span class="category-legend__percent">' + item.percentage + '%</span>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderTopCategoryCards() {
    var top = window.SimSpendData.getTopSpendingCategory();
    document.getElementById('topCategoryEmoji').textContent = top.icon;
    document.getElementById('topCategoryName').textContent = top.name;
    document.getElementById('topCategoryAmount').textContent = fmtWon(top.amount);

    document.getElementById('diffValue').innerHTML =
      '+' + top.diffPercentFromLastMonth + '%' +
      document.getElementById('diffValue').querySelector('svg').outerHTML;
    document.getElementById('diffCategoryName').textContent = top.name;
  }

  function renderWeekdayChart() {
    var weekly = window.SimSpendData.getWeeklyByDayOfWeek();
    var container = document.getElementById('weekdayChart');
    var maxAmount = Math.max.apply(null, weekly.amounts);
    var peakIndex = weekly.amounts.indexOf(maxAmount);

    container.innerHTML = weekly.days
      .map(function (day, i) {
        var heightPct = Math.max(12, Math.round((weekly.amounts[i] / maxAmount) * 100));
        var isPeak = i === peakIndex;
        return (
          '<div class="weekday-chart__col' + (isPeak ? ' is-peak' : '') + '">' +
          '<div class="weekday-chart__bar" style="height:' + heightPct + '%"></div>' +
          '<span class="weekday-chart__label">' + day + '</span>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderAiInsight() {
    document.getElementById('aiInsightText').textContent = window.SimSpendData.getAiInsight();
  }

  window.addEventListener('DOMContentLoaded', function () {
    renderMonthlyTotal();
    renderBudget();
    renderSaved();
    renderSavingsProgress();
    renderCategoryBreakdown();
    renderTopCategoryCards();
    renderWeekdayChart();
    renderAiInsight();
  });
})();
