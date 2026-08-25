// SimSPEND 공통 데이터 타입 정의

export interface Transaction {
  id: string;
  date: string;         // YYYY-MM-DD
  type: 'expense' | 'income' | 'savings';
  category: string;     // 식비, 교통, 쇼핑, 적금, 예금 등
  paymentMethod?: string;
  amount: number;
  memo: string;
  icon: string;
  createdAt: string;    // ISOString
}

export interface VirtualPurchase {
  id: string;
  productId?: string;
  image?: string;
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

// === 가상 쇼핑 데이터 타입 정의 ===

export interface ProductOptionItem {
  name: string;
  priceDelta?: number; // 옵션 추가금
}

export interface ProductOptionGroup {
  name: string;
  required?: boolean;
  options: ProductOptionItem[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ShoppingProduct {
  id: string;
  name: string;
  category: '패션' | '전자기기' | '생활용품' | '뷰티' | '취미' | '명품' | '스포츠' | '도서' | '전체' | string;
  brand: string;
  originalPrice: number;
  discountRate: number; // 할인율 (%)
  price: number;        // 실제 판매가 (원)
  savedAmount: number;  // 절약/아낀 금액 (originalPrice - price)
  image: string;
  badge?: 'BEST' | 'HOT' | 'SALE' | '추천' | string;
  rating: number;
  reviewCount: number;
  colors?: string[];
  options?: ProductOptionGroup[];
  description: string;
  specs?: ProductSpec[];
  reviews?: ProductReview[];
}

