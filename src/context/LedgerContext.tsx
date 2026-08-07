import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, VirtualPurchase, SavingsGoal } from '@/@types';

interface LedgerContextType {
  transactions: Transaction[];
  virtualPurchases: VirtualPurchase[];
  savingsGoals: SavingsGoal[];
  addTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addVirtualPurchase: (purchase: VirtualPurchase) => void;
  
  // 데이터 계산 selector 헬퍼들
  getMonthlyTotal: (month: string) => number;
  getTransactionsByMonth: (month: string) => Transaction[];
  getDailyTotalsByMonth: (month: string) => Record<string, number>;
  getWeeklySummary: () => { days: string[]; amounts: number[]; total: number; diffFromLastWeek: number };
  getTopCategory: () => { name: string; percentage: number };
  getSavingsGoal: () => { title: string; dDay: number; target: number; saved: number };
  getStreak: () => { labels: string[]; checked: boolean[]; currentStreak: number };
  getQuickMenu: () => { id: string; label: string }[];
  getMonthlyStats: () => { diffPercentFromLastMonth: number };
  getBudgetGoal: () => { target: number; achievedPercent: number };
  getSavedAmount: () => number;
  getSavingsProgress: () => { percentage: number };
  getCategoryBreakdown: () => { name: string; percentage: number }[];
  getTopSpendingCategory: () => { name: string; icon: string; amount: number; diffPercentFromLastMonth: number };
  getWeeklyByDayOfWeek: () => { days: string[]; amounts: number[] };
  getAiInsight: () => string;
  getTotalSaved: () => number;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

const TX_STORAGE_KEY = 'simspend_transactions_v2';
const VIRTUAL_STORAGE_KEY = 'simspendVirtualPurchases';

// data.js의 시드 데이터 이식
const seedTransactions: Transaction[] = [
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

const seedVirtualPurchases: VirtualPurchase[] = [];

const defaultSavingsGoals: SavingsGoal[] = [
  { id: 'goal_travel', title: '유럽 배낭여행', icon: 'travel', target: 5000000, saved: 3750000, daysLeft: 142, targetDate: '2024.12.24', statusLabel: null, actionType: 'edit-fill', tip: null },
  { id: 'goal_macbook', title: '맥북 프로 14', icon: 'laptop', target: 3000000, saved: 900000, daysLeft: 45, targetDate: '2024.08.15', statusLabel: null, actionType: 'tip', tip: '매주 15,000원씩 더 모으면 목표일보다 5일 일찍 달성할 수 있어요.' },
  { id: 'goal_phone', title: '새 스마트폰', icon: 'phone', target: 1500000, saved: 1425000, daysLeft: null, targetDate: null, statusLabel: '상시 저축 중', actionType: 'celebrate', tip: null }
];

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [virtualPurchases, setVirtualPurchases] = useState<VirtualPurchase[]>([]);
  const [savingsGoals] = useState<SavingsGoal[]>(defaultSavingsGoals);

  // 초기 LocalStorage 바인딩
  useEffect(() => {
    const rawTx = localStorage.getItem(TX_STORAGE_KEY);
    if (!rawTx) {
      localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(seedTransactions));
      setTransactions(seedTransactions);
    } else {
      setTransactions(JSON.parse(rawTx));
    }

    const rawVirtual = localStorage.getItem(VIRTUAL_STORAGE_KEY);
    if (!rawVirtual) {
      localStorage.setItem(VIRTUAL_STORAGE_KEY, JSON.stringify(seedVirtualPurchases));
      setVirtualPurchases(seedVirtualPurchases);
    } else {
      setVirtualPurchases(JSON.parse(rawVirtual));
    }
  }, []);

  const addTransaction = (tx: Transaction) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    setTransactions(updated);
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated));
  };

  const addVirtualPurchase = (purchase: VirtualPurchase) => {
    const updated = [purchase, ...virtualPurchases];
    setVirtualPurchases(updated);
    localStorage.setItem(VIRTUAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Selector 헬퍼 메서드들 (data.js 비즈니스 로직 포팅)
  const getMonthlyTotal = (month: string) => {
    return transactions
      .filter((tx) => tx.date.startsWith(month) && tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const getTransactionsByMonth = (month: string) => {
    return transactions
      .filter((tx) => tx.date.startsWith(month))
      .sort((a, b) => {
        if (a.date === b.date) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.date < b.date ? 1 : -1;
      });
  };

  const getDailyTotalsByMonth = (month: string) => {
    const totals: Record<string, number> = {};
    transactions
      .filter((tx) => tx.date.startsWith(month) && tx.type === 'expense')
      .forEach((tx) => {
        totals[tx.date] = (totals[tx.date] || 0) + tx.amount;
      });
    return totals;
  };

  const getWeeklySummary = () => {
    return {
      days: ['월', '화', '수', '목', '금'],
      amounts: [24800, 31200, 62400, 37600, 17900],
      total: 173900,
      diffFromLastWeek: 30000
    };
  };

  const getTopCategory = () => ({ name: '식비', percentage: 60 });

  const getSavingsGoal = () => ({
    title: '아이패드 프로 구매하기',
    dDay: -42,
    target: 660000,
    saved: 528000
  });

  const getStreak = () => ({
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    checked: [true, true, true, true, false, false, false],
    currentStreak: 12
  });

  const getQuickMenu = () => [
    { id: 'virtual-shopping', label: '가상 쇼핑' },
    { id: 'virtual-delivery', label: '가상 배달' },
    { id: 'virtual-wishlist', label: '가상 구매 목록' },
    { id: 'ai-report', label: 'AI 리포트' }
  ];

  const getMonthlyStats = () => ({ diffPercentFromLastMonth: 12 });
  const getBudgetGoal = () => ({ target: 1900000, achievedPercent: 76 });
  const getSavedAmount = () => 128900;
  const getSavingsProgress = () => ({ percentage: 83 });
  
  const getCategoryBreakdown = () => [
    { name: '식비', percentage: 60 },
    { name: '쇼핑', percentage: 20 },
    { name: '교통', percentage: 10 },
    { name: '취미', percentage: 5 },
    { name: '기타', percentage: 5 }
  ];

  const getTopSpendingCategory = () => ({
    name: '식비',
    icon: '🍔',
    amount: 850000,
    diffPercentFromLastMonth: 28
  });

  const getWeeklyByDayOfWeek = () => ({
    days: ['월', '화', '수', '목', '금', '토', '일'],
    amounts: [32000, 28000, 25000, 30000, 45000, 98000, 20000]
  });

  const getAiInsight = () =>
    '이번 달은 쇼핑 소비가 25% 증가했어요. 지난 달보다 의류 구매가 많아진 것이 주요 원인이에요.';

  const getTotalSaved = () => {
    return savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
  };

  return (
    <LedgerContext.Provider
      value={{
        transactions,
        virtualPurchases,
        savingsGoals,
        addTransaction,
        deleteTransaction,
        addVirtualPurchase,
        getMonthlyTotal,
        getTransactionsByMonth,
        getDailyTotalsByMonth,
        getWeeklySummary,
        getTopCategory,
        getSavingsGoal,
        getStreak,
        getQuickMenu,
        getMonthlyStats,
        getBudgetGoal,
        getSavedAmount,
        getSavingsProgress,
        getCategoryBreakdown,
        getTopSpendingCategory,
        getWeeklyByDayOfWeek,
        getAiInsight,
        getTotalSaved
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};
