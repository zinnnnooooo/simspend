// SimSPEND 공통 데이터 타입 정의

export interface Transaction {
  id: string;
  date: string;         // YYYY-MM-DD
  type: 'expense' | 'income';
  category: string;     // 식비, 교통, 쇼핑, 구독, 의료, 주거, 여행, 기타
  paymentMethod: string; // 카드, 현금, 계좌이체, 정기지출
  amount: number;
  memo: string;
  icon: string;
  createdAt: string;    // ISOString
}

export interface VirtualPurchase {
  id: string;
  productName: string;
  category: string;
  brand: string;
  color: string;
  price: number;
  memo: string;
  status: 'payment_pending' | 'shipping' | 'delivered';
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  icon: string;
  target: number;
  saved: number;
  daysLeft: number | null;
  targetDate: string | null;
  statusLabel: string | null;
  actionType: 'edit-fill' | 'tip' | 'celebrate';
  tip: string | null;
}
