/**
 * SimSPEND · add.js
 * 캘린더 + 내역 리스트를 렌더링하고, 하단 시트 입력 폼으로 새 내역을 저장합니다.
 */

(function () {
  var WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

  var ICONS = {
    cafe:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"/><path d="M16 9.5h1.5a2 2 0 0 1 0 4H16"/>' +
      '</svg>',
    bus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M4 12h16"/><circle cx="8" cy="19" r="1.4"/><circle cx="16" cy="19" r="1.4"/>' +
      '</svg>',
    music:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M17 4 8 6v11"/><circle cx="6" cy="18" r="2.3"/><circle cx="15" cy="16" r="2.3"/>' +
      '</svg>',
    food:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M7 3v7M5 3v7M9 3v7M5 10c0 2 .8 3 2 3v8M15 3c-2 0-3 2-3 5s1 5 3 5v8"/>' +
      '</svg>',
    bag:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>' +
      '</svg>',
    home:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 11 12 4l8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/>' +
      '</svg>',
    travel:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M10.5 15.5 3 13l1.6-1.6 4.7 1 3.3-3.3-7-4L7 3.5l9 3 3-3a2 2 0 0 1 2.8 2.8l-3 3 3 9-1.6 1.6-4-7-3.3 3.3 1 4.7L13.5 21l-2.5-7.5Z"/>' +
      '</svg>'
  };

  var CATEGORY_ICON_MAP = {
    식비: 'food',
    교통: 'bus',
    쇼핑: 'bag',
    구독: 'music',
    의료: 'bag',
    주거: 'home',
    여행: 'travel',
    기타: 'bag'
  };

  var fmtWon = function (n) {
    return '₩' + Math.round(n).toLocaleString('ko-KR');
  };
  var fmtNum = function (n) {
    return Math.round(n).toLocaleString('ko-KR');
  };
  var pad2 = function (n) { return String(n).length < 2 ? '0' + n : String(n); };

  // ------------------------------------------------------------------
  // 상태
  // ------------------------------------------------------------------
  var state = {
    year: 2024,
    month: 10, // 1~12
    selectedDate: null // 'YYYY-MM-DD'
  };

  function monthKey() {
    return state.year + '-' + pad2(state.month);
  }

  // ------------------------------------------------------------------
  // 캘린더 렌더링
  // ------------------------------------------------------------------
  function renderCalendar() {
    document.getElementById('calendarMonthLabel').textContent = state.year + '년 ' + state.month + '월';

    var dailyTotals = window.SimSpendData.getDailyTotalsByMonth(monthKey());
    var firstWeekday = new Date(state.year, state.month - 1, 1).getDay();
    var totalDays = new Date(state.year, state.month, 0).getDate();

    // 선택된 날짜가 없으면, 이 달의 가장 최근 지출일을 기본 선택
    if (!state.selectedDate || state.selectedDate.indexOf(monthKey()) !== 0) {
      var dates = Object.keys(dailyTotals).sort();
      state.selectedDate = dates.length ? dates[dates.length - 1] : null;
    }

    var html = '';
    for (var i = 0; i < firstWeekday; i++) {
      html += '<div class="calendar__cell"></div>';
    }
    for (var d = 1; d <= totalDays; d++) {
      var dateStr = monthKey() + '-' + pad2(d);
      var isSelected = dateStr === state.selectedDate;
      var amount = dailyTotals[dateStr];
      html +=
        '<div class="calendar__cell' + (isSelected ? ' is-selected' : '') + '" data-date="' + dateStr + '">' +
        '<span class="calendar__date-num">' + d + '</span>' +
        (amount ? '<span class="calendar__amount">-' + fmtNum(amount) + '</span>' : '') +
        '</div>';
    }
    document.getElementById('calendarGrid').innerHTML = html;

    Array.prototype.forEach.call(document.querySelectorAll('.calendar__cell[data-date]'), function (cell) {
      cell.addEventListener('click', function () {
        state.selectedDate = cell.getAttribute('data-date');
        renderCalendar();
      });
    });
  }

  // ------------------------------------------------------------------
  // 총 사용 금액 + 내역 리스트 렌더링
  // ------------------------------------------------------------------
  function renderTotal() {
    var total = window.SimSpendData.getMonthlyTotal(monthKey());
    document.getElementById('monthTotal').textContent = fmtWon(total) + '원';
  }

  function formatDateHeader(dateStr) {
    var parts = dateStr.split('-');
    return parseInt(parts[1], 10) + '월 ' + parseInt(parts[2], 10) + '일';
  }

  function renderList() {
    var txs = window.SimSpendData.getTransactionsByMonth(monthKey());
    var container = document.getElementById('ledgerList');

    if (!txs.length) {
      container.innerHTML = '<p class="ledger__empty">이번 달 등록된 내역이 없어요.</p>';
      return;
    }

    // 날짜별 그룹핑 (getTransactionsByMonth는 이미 날짜desc/시간desc 정렬됨)
    var groups = [];
    var groupMap = {};
    txs.forEach(function (tx) {
      if (!groupMap[tx.date]) {
        groupMap[tx.date] = { date: tx.date, total: 0, items: [] };
        groups.push(groupMap[tx.date]);
      }
      groupMap[tx.date].items.push(tx);
      if (tx.type === 'expense') {
        groupMap[tx.date].total += tx.amount;
      }
    });

    container.innerHTML = groups
      .map(function (group) {
        var rows = group.items
          .map(function (tx) {
            var iconKey = ICONS[tx.icon] ? tx.icon : (CATEGORY_ICON_MAP[tx.category] || 'bag');
            var sign = tx.type === 'income' ? '+' : '-';
            return (
              '<div class="ledger-tx">' +
              '<span class="ledger-tx__icon">' + ICONS[iconKey] + '</span>' +
              '<div class="ledger-tx__info">' +
              '<p class="ledger-tx__memo">' + tx.memo + '</p>' +
              '<p class="ledger-tx__meta">' + tx.category + ' · ' + tx.paymentMethod + '</p>' +
              '</div>' +
              '<span class="ledger-tx__amount' + (tx.type === 'income' ? ' is-income' : '') + '">' +
              sign + fmtNum(tx.amount) + '원</span>' +
              '</div>'
            );
          })
          .join('');

        return (
          '<div class="ledger-day">' +
          '<div class="ledger-day__header">' +
          '<span class="ledger-day__date">' + formatDateHeader(group.date) + '</span>' +
          '<span class="ledger-day__total">지출 ' + fmtNum(group.total) + '원</span>' +
          '</div>' +
          '<div class="card ledger-card">' + rows + '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderAll() {
    renderTotal();
    renderCalendar();
    renderList();
  }

  // ------------------------------------------------------------------
  // 월 이동
  // ------------------------------------------------------------------
  function goToMonth(delta) {
    var next = state.month + delta;
    if (next < 1) {
      state.month = 12;
      state.year -= 1;
    } else if (next > 12) {
      state.month = 1;
      state.year += 1;
    } else {
      state.month = next;
    }
    state.selectedDate = null;
    renderAll();
  }

  // ------------------------------------------------------------------
  // 입력 폼 (바텀시트)
  // ------------------------------------------------------------------
  var formState = { type: 'expense', category: '식비' };

  function openSheet() {
    var overlay = document.getElementById('sheetOverlay');
    var dateInput = document.getElementById('txDate');
    dateInput.value = state.selectedDate || (monthKey() + '-' + pad2(new Date().getDate()));
    overlay.classList.add('is-open');
  }

  function closeSheet() {
    document.getElementById('sheetOverlay').classList.remove('is-open');
  }

  function setupSheetInteractions() {
    document.getElementById('openSheetBtn').addEventListener('click', openSheet);

    document.getElementById('sheetOverlay').addEventListener('click', function (e) {
      if (e.target.id === 'sheetOverlay') closeSheet();
    });

    var typeSegment = document.getElementById('typeSegment');
    typeSegment.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-type]');
      if (!btn) return;
      formState.type = btn.getAttribute('data-type');
      Array.prototype.forEach.call(typeSegment.children, function (c) {
        c.classList.toggle('is-active', c === btn);
      });
    });

    var chipGroup = document.getElementById('categoryChips');
    chipGroup.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-category]');
      if (!chip) return;
      formState.category = chip.getAttribute('data-category');
      Array.prototype.forEach.call(chipGroup.children, function (c) {
        c.classList.toggle('is-active', c === chip);
      });
    });

    document.getElementById('txForm').addEventListener('submit', function (e) {
      e.preventDefault();

      var date = document.getElementById('txDate').value;
      var amount = parseInt(document.getElementById('txAmount').value, 10);
      var payment = document.getElementById('txPayment').value;
      var memo = document.getElementById('txMemo').value.trim();

      if (!date || !amount || amount <= 0) return;

      var tx = {
        id: 'tx_' + Date.now(),
        date: date,
        type: formState.type,
        category: formState.category,
        paymentMethod: payment,
        amount: amount,
        memo: memo || formState.category,
        icon: CATEGORY_ICON_MAP[formState.category] || 'bag',
        createdAt: new Date().toISOString()
      };

      window.SimSpendData.addTransaction(tx);

      // 새 내역이 등록된 달로 화면 이동
      var parts = date.split('-');
      state.year = parseInt(parts[0], 10);
      state.month = parseInt(parts[1], 10);
      state.selectedDate = date;

      closeSheet();
      document.getElementById('txForm').reset();
      formState = { type: 'expense', category: '식비' };
      Array.prototype.forEach.call(typeSegment.children, function (c, i) { c.classList.toggle('is-active', i === 0); });
      Array.prototype.forEach.call(chipGroup.children, function (c, i) { c.classList.toggle('is-active', i === 0); });

      renderAll();
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('prevMonthBtn').addEventListener('click', function () { goToMonth(-1); });
    document.getElementById('nextMonthBtn').addEventListener('click', function () { goToMonth(1); });
    setupSheetInteractions();
    renderAll();
  });
})();
