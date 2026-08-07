/**
 * SimSPEND · data.js
 * 가계부 데이터 관리 (공통 로직)
 *
 * - transactions(내역)는 localStorage에 영속화합니다.
 * - 대시보드용 요약 데이터(주간 합계/최다 지출/저축 목표/스트릭)는
 *   현재는 목데이터이며, 추후 transactions 기반 계산 로직 또는 API 응답으로
 *   교체하기 쉽도록 함수 형태로 감싸 두었습니다. (리액트 전환 시 그대로 훅/셀렉터로 이동 가능)
 */

window.SimSpendData = (function () {
  var STORAGE_KEY = 'simspend_transactions_v2';

  // ------------------------------------------------------------------
  // 내역(transactions) 시드 데이터
  // 스키마:
  // {
  //   id: string,
  //   date: 'YYYY-MM-DD',
  //   type: 'expense' | 'income',
  //   category: string,          // 식비, 교통, 구독, 쇼핑, 의료, 주거, 여행 ...
  //   paymentMethod: string,     // 카드, 현금, 계좌이체, 정기지출 ...
  //   amount: number,            // 원 단위 절대값
  //   memo: string,              // 내역명
  //   icon: string,              // 'cafe' | 'bus' | 'music' | 'food' | 'bag' | 'home' | 'travel'
  //   createdAt: ISOString
  // }
  // ------------------------------------------------------------------
  var seedTransactions = [
    { id: 'tx_01', date: '2024-10-24', type: 'expense', category: '식비', paymentMethod: '카드', amount: 4500, memo: '스타벅스 신사점', icon: 'cafe', createdAt: '2024-10-24T09:12:00.000Z' },
    { id: 'tx_02', date: '2024-10-24', type: 'expense', category: '교통', paymentMethod: '카드', amount: 1250, memo: '서울버스교통', icon: 'bus', createdAt: '2024-10-24T08:03:00.000Z' },
    { id: 'tx_03', date: '2024-10-24', type: 'expense', category: '쇼핑', paymentMethod: '카드', amount: 139250, memo: '쿠팡 겨울용품 구매', icon: 'bag', createdAt: '2024-10-24T07:00:00.000Z' },

    { id: 'tx_04', date: '2024-10-23', type: 'expense', category: '구독', paymentMethod: '정기지출', amount: 8900, memo: '애플뮤직 구독', icon: 'music', createdAt: '2024-10-23T23:50:00.000Z' },
    { id: 'tx_05', date: '2024-10-23', type: 'expense', category: '식비', paymentMethod: '카드', amount: 12700, memo: '김밥천국 선릉점', icon: 'food', createdAt: '2024-10-23T12:31:00.000Z' },
    { id: 'tx_06', date: '2024-10-23', type: 'expense', category: '쇼핑', paymentMethod: '카드', amount: 6400, memo: '올리브영 강남점', icon: 'bag', createdAt: '2024-10-23T10:15:00.000Z' },

    { id: 'tx_07', date: '2024-10-20', type: 'expense', category: '식비', paymentMethod: '카드', amount: 5200, memo: '스타벅스 여의도점', icon: 'cafe', createdAt: '2024-10-20T08:40:00.000Z' },
    { id: 'tx_08', date: '2024-10-18', type: 'expense', category: '쇼핑', paymentMethod: '카드', amount: 82000, memo: '쿠팡 온라인쇼핑', icon: 'bag', createdAt: '2024-10-18T21:20:00.000Z' },
    { id: 'tx_09', date: '2024-10-17', type: 'expense', category: '식비', paymentMethod: '카드', amount: 32000, memo: '한식당 점심', icon: 'food', createdAt: '2024-10-17T12:05:00.000Z' },
    { id: 'tx_10', date: '2024-10-15', type: 'expense', category: '의료', paymentMethod: '카드', amount: 45000, memo: '우리동네의원', icon: 'bag', createdAt: '2024-10-15T15:30:00.000Z' },
    { id: 'tx_11', date: '2024-10-10', type: 'expense', category: '구독', paymentMethod: '계좌이체', amount: 68000, memo: '통신비 자동이체', icon: 'bag', createdAt: '2024-10-10T09:00:00.000Z' },
    { id: 'tx_12', date: '2024-10-08', type: 'expense', category: '쇼핑', paymentMethod: '카드', amount: 120000, memo: '무신사 스토어', icon: 'bag', createdAt: '2024-10-08T19:45:00.000Z' },
    { id: 'tx_13', date: '2024-10-05', type: 'expense', category: '식비', paymentMethod: '카드', amount: 15300, memo: '김밥천국', icon: 'food', createdAt: '2024-10-05T18:10:00.000Z' },
    { id: 'tx_14', date: '2024-10-03', type: 'expense', category: '구독', paymentMethod: '정기지출', amount: 17900, memo: '넷플릭스 구독', icon: 'music', createdAt: '2024-10-03T00:10:00.000Z' },
    { id: 'tx_15', date: '2024-10-02', type: 'expense', category: '교통', paymentMethod: '카드', amount: 3200, memo: '서울버스교통', icon: 'bus', createdAt: '2024-10-02T08:15:00.000Z' },
    { id: 'tx_16', date: '2024-10-06', type: 'expense', category: '여행', paymentMethod: '카드', amount: 196000, memo: '국내선 항공권', icon: 'travel', createdAt: '2024-10-06T11:00:00.000Z' },
    { id: 'tx_17', date: '2024-10-01', type: 'expense', category: '주거', paymentMethod: '계좌이체', amount: 600000, memo: '월세 자동이체', icon: 'home', createdAt: '2024-10-01T09:00:00.000Z' }
  ];

  // 이번 주 요일별 지출 합계 (막대그래프, 메인 대시보드용 별도 목데이터)
  var weeklySummary = {
    days: ['월', '화', '수', '목', '금'],
    amounts: [24800, 31200, 62400, 37600, 17900],
    total: 173900,
    diffFromLastWeek: 30000
  };

  var topCategory = { name: '식비', percentage: 60 };

  var savingsGoal = {
    title: '아이패드 프로 구매하기',
    dDay: -42,
    target: 660000,
    saved: 528000
  };

  var streak = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    checked: [true, true, true, true, false, false, false],
    currentStreak: 12
  };

  var quickMenu = [
    { id: 'virtual-shopping', label: '가상 쇼핑' },
    { id: 'virtual-delivery', label: '가상 배달' },
    { id: 'virtual-wishlist', label: '가상 구매 목록' },
    { id: 'ai-report', label: 'AI 리포트' }
  ];

  function loadTransactions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTransactions));
        return seedTransactions.slice();
      }
      return JSON.parse(raw);
    } catch (e) {
      return seedTransactions.slice();
    }
  }

  function saveTransactions(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      /* localStorage 미지원 환경 무시 */
    }
  }

  function getTransactions() {
    return loadTransactions();
  }

  function addTransaction(tx) {
    var list = loadTransactions();
    list.unshift(tx);
    saveTransactions(list);
    return list;
  }

  function deleteTransaction(id) {
    var list = loadTransactions().filter(function (tx) { return tx.id !== id; });
    saveTransactions(list);
    return list;
  }

  // month: 'YYYY-MM'
  function getMonthlyTotal(month) {
    return loadTransactions()
      .filter(function (tx) { return tx.date.indexOf(month) === 0 && tx.type === 'expense'; })
      .reduce(function (sum, tx) { return sum + tx.amount; }, 0);
  }

  // month: 'YYYY-MM' → 최신순(날짜desc, 등록시간desc) 정렬된 내역 배열
  function getTransactionsByMonth(month) {
    return loadTransactions()
      .filter(function (tx) { return tx.date.indexOf(month) === 0; })
      .sort(function (a, b) {
        if (a.date === b.date) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.date < b.date ? 1 : -1;
      });
  }

  // month: 'YYYY-MM' → { '2024-10-24': dayTotal, ... } (일자별 지출 합계, 캘린더 마킹용)
  function getDailyTotalsByMonth(month) {
    var totals = {};
    loadTransactions()
      .filter(function (tx) { return tx.date.indexOf(month) === 0 && tx.type === 'expense'; })
      .forEach(function (tx) {
        totals[tx.date] = (totals[tx.date] || 0) + tx.amount;
      });
    return totals;
  }

  function getWeeklySummary() { return weeklySummary; }
  function getTopCategory() { return topCategory; }
  function getSavingsGoal() { return savingsGoal; }
  function getStreak() { return streak; }
  function getQuickMenu() { return quickMenu; }

  // ------------------------------------------------------------------
  // 통계 화면용 목데이터
  // ------------------------------------------------------------------
  var monthlyStats = {
    diffPercentFromLastMonth: 12 // 전월 대비 지출 증감률(%)
  };

  var budgetGoal = {
    target: 1900000,
    achievedPercent: 76
  };

  var savedAmount = 128900; // 가상구매로 아낀 금액

  var savingsProgress = {
    percentage: 83 // 가상구매 중 성공한 비율
  };

  var categoryBreakdown = [
    { name: '식비', percentage: 60 },
    { name: '쇼핑', percentage: 20 },
    { name: '교통', percentage: 10 },
    { name: '취미', percentage: 5 },
    { name: '기타', percentage: 5 }
  ];

  var topSpendingCategory = {
    name: '식비',
    icon: '🍔',
    amount: 850000,
    diffPercentFromLastMonth: 28
  };

  var weeklyByDayOfWeek = {
    days: ['월', '화', '수', '목', '금', '토', '일'],
    amounts: [32000, 28000, 25000, 30000, 45000, 98000, 20000]
  };

  var aiInsight = '이번 달은 쇼핑 소비가 25% 증가했어요. 지난 달보다 의류 구매가 많아진 것이 주요 원인이에요.';

  function getMonthlyStats() { return monthlyStats; }
  function getBudgetGoal() { return budgetGoal; }
  function getSavedAmount() { return savedAmount; }
  function getSavingsProgress() { return savingsProgress; }
  function getCategoryBreakdown() { return categoryBreakdown; }
  function getTopSpendingCategory() { return topSpendingCategory; }
  function getWeeklyByDayOfWeek() { return weeklyByDayOfWeek; }
  function getAiInsight() { return aiInsight; }

  // ------------------------------------------------------------------
  // 저축 목표 관리 화면용 목데이터
  // ------------------------------------------------------------------
  // 스키마:
  // {
  //   id, title, icon, target, saved,
  //   daysLeft: number | null,     // 목표까지 남은 일수 (없으면 상시 저축)
  //   targetDate: 'YYYY.MM.DD' | null,
  //   statusLabel: string | null,  // daysLeft가 없을 때 표시할 라벨 (예: '상시 저축 중')
  //   actionType: 'edit-fill' | 'tip' | 'celebrate',
  //   tip: string | null           // actionType이 'tip'일 때 표시할 안내 문구
  // }
  var savingsGoalsList = [
    {
      id: 'goal_travel',
      title: '유럽 배낭여행',
      icon: 'travel',
      target: 5000000,
      saved: 3750000,
      daysLeft: 142,
      targetDate: '2024.12.24',
      statusLabel: null,
      actionType: 'edit-fill',
      tip: null
    },
    {
      id: 'goal_macbook',
      title: '맥북 프로 14',
      icon: 'laptop',
      target: 3000000,
      saved: 900000,
      daysLeft: 45,
      targetDate: '2024.08.15',
      statusLabel: null,
      actionType: 'tip',
      tip: '매주 15,000원씩 더 모으면 목표일보다 5일 일찍 달성할 수 있어요.'
    },
    {
      id: 'goal_phone',
      title: '새 스마트폰',
      icon: 'phone',
      target: 1500000,
      saved: 1425000,
      daysLeft: null,
      targetDate: null,
      statusLabel: '상시 저축 중',
      actionType: 'celebrate',
      tip: null
    }
  ];

  function getSavingsGoalsList() { return savingsGoalsList; }

  function getTotalSaved() {
    return savingsGoalsList.reduce(function (sum, goal) { return sum + goal.saved; }, 0);
  }

  return {
    getTransactions: getTransactions,
    addTransaction: addTransaction,
    deleteTransaction: deleteTransaction,
    getMonthlyTotal: getMonthlyTotal,
    getTransactionsByMonth: getTransactionsByMonth,
    getDailyTotalsByMonth: getDailyTotalsByMonth,
    getWeeklySummary: getWeeklySummary,
    getTopCategory: getTopCategory,
    getSavingsGoal: getSavingsGoal,
    getStreak: getStreak,
    getQuickMenu: getQuickMenu,
    getMonthlyStats: getMonthlyStats,
    getBudgetGoal: getBudgetGoal,
    getSavedAmount: getSavedAmount,
    getSavingsProgress: getSavingsProgress,
    getCategoryBreakdown: getCategoryBreakdown,
    getTopSpendingCategory: getTopSpendingCategory,
    getWeeklyByDayOfWeek: getWeeklyByDayOfWeek,
    getAiInsight: getAiInsight,
    getSavingsGoalsList: getSavingsGoalsList,
    getTotalSaved: getTotalSaved
  };
})();
