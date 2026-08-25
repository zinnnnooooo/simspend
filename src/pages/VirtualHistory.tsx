import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { mockProducts, getProductById } from '@/data/mockProducts';
import { mockStores } from '@/data/mockStores';

interface MergedPurchaseItem {
  id: string;
  type: 'shopping' | 'delivery';
  title: string;
  subtitle?: string;
  price: number;
  date: string;
  status: '주문 완료' | '준비 중' | '배송 중' | '배송 완료';
  image: string;
  targetLink: string;
}

export const VirtualHistory: React.FC = () => {
  const navigate = useNavigate();
  const { virtualPurchases, transactions } = useLedger();

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 가상 쇼핑 상품의 실제 이미지 매칭 함수
  const getShoppingImage = (item: { productId?: string; image?: string; productName: string; brand: string; category?: string }) => {
    // 1. 직접 저장된 이미지가 있는 경우
    if (item.image && item.image.trim()) {
      return item.image;
    }
    // 2. productId로 매칭
    if (item.productId) {
      const prod = getProductById(item.productId);
      if (prod?.image) return prod.image;
    }
    // 3. 상품명 유사도 매칭
    const foundByName = mockProducts.find(p => 
      item.productName.includes(p.name) || p.name.includes(item.productName)
    );
    if (foundByName?.image) return foundByName.image;

    // 4. 브랜드 매칭
    const foundByBrand = mockProducts.find(p => 
      p.brand.toLowerCase() === item.brand.toLowerCase()
    );
    if (foundByBrand?.image) return foundByBrand.image;

    // 5. 카테고리 매칭
    const foundByCategory = mockProducts.find(p => p.category === item.category);
    if (foundByCategory?.image) return foundByCategory.image;

    return mockProducts[0]?.image || '';
  };

  // 가상 배달 음식의 실제 이미지 매칭 함수
  const getDeliveryImage = (memo: string, category: string) => {
    // 1. 가게명 매칭
    const store = mockStores.find(s => memo.includes(s.name) || s.name.includes(memo.split(' - ')[0]));
    if (store?.image) return store.image;

    // 2. 메뉴명 매칭
    const storeWithMenu = mockStores.find(s => 
      s.menus?.some(m => memo.includes(m.name))
    );
    if (storeWithMenu?.image) return storeWithMenu.image;

    // 3. 키워드별 가게 이미지 매칭
    if (memo.includes('피자') || memo.includes('파파존스')) {
      const pizzaStore = mockStores.find(s => s.category === '피자');
      if (pizzaStore?.image) return pizzaStore.image;
    }
    if (memo.includes('치킨') || memo.includes('BHC') || memo.includes('교촌')) {
      const chickenStore = mockStores.find(s => s.category === '치킨');
      if (chickenStore?.image) return chickenStore.image;
    }
    if (memo.includes('버거') || memo.includes('맥도날드') || memo.includes('버거킹')) {
      const burgerStore = mockStores.find(s => s.category === '버거');
      if (burgerStore?.image) return burgerStore.image;
    }
    if (memo.includes('카페') || memo.includes('스타벅스') || memo.includes('커피')) {
      const cafeStore = mockStores.find(s => s.category === '카페');
      if (cafeStore?.image) return cafeStore.image;
    }
    if (memo.includes('김밥') || memo.includes('분식') || memo.includes('떡볶이')) {
      const bsnkStore = mockStores.find(s => s.category === '분식');
      if (bsnkStore?.image) return bsnkStore.image;
    }
    if (memo.includes('쌈밥') || memo.includes('제육') || memo.includes('한식')) {
      const krStore = mockStores.find(s => s.category === '한식');
      if (krStore?.image) return krStore.image;
    }

    // 기본 배달 매장 이미지
    const fallbackStore = mockStores.find(s => s.image);
    return fallbackStore?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80';
  };

  // 1. 가상 쇼핑 내역 변환
  const shoppingItems: MergedPurchaseItem[] = (virtualPurchases || []).map((item, idx) => {
    let statusLabel: MergedPurchaseItem['status'] = '배송 중';
    if (item.status === 'payment_pending') statusLabel = '주문 완료';
    else if (item.status === 'shipping') statusLabel = '배송 중';
    else if (item.status === 'delivered') statusLabel = '배송 완료';
    else statusLabel = idx % 2 === 0 ? '배송 중' : '준비 중';

    const actualImage = getShoppingImage(item);

    return {
      id: item.id,
      type: 'shopping',
      title: item.productName,
      subtitle: `${item.brand} · ${item.color || '기본'}`,
      price: item.price,
      date: item.createdAt || new Date().toISOString(),
      status: statusLabel,
      image: actualImage,
      targetLink: '/delivery-status'
    };
  });

  // 2. 가상 배달 트랜잭션 변환
  const deliveryItems: MergedPurchaseItem[] = (transactions || [])
    .filter(tx => tx.id.startsWith('tx_delivery_') || tx.category === '식비' && (tx.memo.includes('점') || tx.memo.includes('식당') || tx.memo.includes('피자') || tx.memo.includes('치킨')))
    .map((tx, idx) => {
      const statusList: MergedPurchaseItem['status'][] = ['배송 완료', '배송 중', '준비 중', '주문 완료'];
      const actualImage = getDeliveryImage(tx.memo, tx.category);

      return {
        id: tx.id,
        type: 'delivery',
        title: tx.memo || '가상 맛집 주문',
        subtitle: '가상 배달 주문',
        price: tx.amount,
        date: tx.createdAt || tx.date,
        status: statusList[idx % statusList.length],
        image: actualImage,
        targetLink: '/delivery-status'
      };
    });

  // 3. 기본 시드 가상 구매 데이터 (실제 원본 상품/음식 이미지 매칭)
  const defaultSampleItems: MergedPurchaseItem[] = [
    {
      id: 'sample_01',
      type: 'shopping',
      title: 'iPhone 16 Pro Max 1TB 내추럴 티타늄',
      subtitle: 'Apple · 내추럴 티타늄',
      price: 2250000,
      date: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25분 전
      status: '배송 중',
      image: mockProducts.find(p => p.name.includes('iPhone 16 Pro'))?.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
      targetLink: '/delivery-status'
    },
    {
      id: 'sample_02',
      type: 'delivery',
      title: '파파존스가상슈퍼파파스 - 수퍼 파파스 피자 (L)',
      subtitle: '파파존스가상슈퍼파파스',
      price: 28500,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
      status: '배송 완료',
      image: mockStores.find(s => s.category === '피자')?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      targetLink: '/delivery-status'
    },
    {
      id: 'sample_03',
      type: 'shopping',
      title: '클래식 미디엄 플랩 백 캐비어 스킨 블랙 금장',
      subtitle: 'CHANEL · 블랙 금장',
      price: 14791500,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
      status: '배송 완료',
      image: mockProducts.find(p => p.name.includes('클래식 미디엄 플랩 백'))?.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      targetLink: '/delivery-status'
    },
    {
      id: 'sample_04',
      type: 'delivery',
      title: 'BHC가상골드킹 역삼점 - 골드킹 콤보',
      subtitle: 'BHC가상골드킹 역삼점',
      price: 23000,
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2일 전
      status: '배송 완료',
      image: mockStores.find(s => s.category === '치킨')?.image || 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',
      targetLink: '/delivery-status'
    }
  ];

  // 통합 및 최신순 정렬
  const combinedList = [...shoppingItems, ...deliveryItems];
  const displayList = combinedList.length > 0 ? combinedList : defaultSampleItems;

  const sortedList = [...displayList].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 1. 지금까지 가상 구매 총 사용 금액 (전체 합산)
  const totalAmount = sortedList.reduce((sum, item) => sum + (item.price || 0), 0);

  // 2. 이번 달 가상 구매 사용 금액 (이번 달 기준 합산)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthAmount = sortedList
    .filter(item => {
      try {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
      } catch {
        return true;
      }
    })
    .reduce((sum, item) => sum + (item.price || 0), 0);

  // 날짜 포맷터
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
    } catch {
      return isoStr;
    }
  };

  return (
    <VhContainer>
      {/* 1. 상단 네비게이션 헤더 */}
      <VhHeader>
        <HeaderBack onClick={() => navigate('/')} aria-label="메인으로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </HeaderBack>
        <HeaderTitle>가상 구매 목록</HeaderTitle>
        <HeaderSpacer />
      </VhHeader>

      {/* 2. 상단 통합 요약 카드 (총 금액 & 이번 달 금액) */}
      <SummaryBanner>
        <SummaryTopHeader>
          <SummaryTitleWrap>
            <BannerIcon>✨</BannerIcon>
            <div>
              <BannerTitle>심스펜드 가상 주문 내역</BannerTitle>
              <BannerSubtitle>
                총 <strong>{sortedList.length}건</strong>의 가상 지출로 실제 통장을 지켰어요!
              </BannerSubtitle>
            </div>
          </SummaryTitleWrap>
          <TotalCountBadge>총 {sortedList.length}건</TotalCountBadge>
        </SummaryTopHeader>

        <SummaryStatGrid>
          <StatBox>
            <StatLabel>지금까지 가상 구매 총액</StatLabel>
            <StatValue>{fmtWon(totalAmount)}</StatValue>
          </StatBox>
          <StatDivider />
          <StatBox>
            <StatLabel>이번 달 가상 구매액</StatLabel>
            <StatValue className="highlight">{fmtWon(currentMonthAmount)}</StatValue>
          </StatBox>
        </SummaryStatGrid>
      </SummaryBanner>

      {/* 3. 통합 구매 내역 리스트 */}
      {sortedList.length > 0 ? (
        <PurchaseList>
          {sortedList.map(item => (
            <PurchaseCard 
              key={item.id} 
              onClick={() => navigate(item.targetLink)}
            >
              <CardTopRow>
                <TypeBadge className={item.type}>
                  {item.type === 'shopping' ? '🛍️ 가상 쇼핑' : '🍗 가상 배달'}
                </TypeBadge>
                <StatusBadge className={item.status.replace(/\s+/g, '')}>
                  {item.status}
                </StatusBadge>
              </CardTopRow>

              <CardBodyRow>
                <ItemThumbnail src={item.image} alt={item.title} />
                <ItemInfo>
                  <ItemTitle>{item.title}</ItemTitle>
                  {item.subtitle && <ItemSubtitle>{item.subtitle}</ItemSubtitle>}
                  <ItemPrice>{fmtWon(item.price)}</ItemPrice>
                </ItemInfo>
              </CardBodyRow>

              <CardBottomRow>
                <OrderDate>{formatDate(item.date)}</OrderDate>
                <DetailLinkText>
                  배송 상태 보기 &gt;
                </DetailLinkText>
              </CardBottomRow>
            </PurchaseCard>
          ))}
        </PurchaseList>
      ) : (
        <EmptyState>
          <EmptyIcon>📦</EmptyIcon>
          <EmptyTitle>가상 구매 내역이 없습니다</EmptyTitle>
          <EmptyDesc>
            가상 쇼핑과 배달을 체험하고 사고 싶은 마음을 지혜롭게 다스려보세요.
          </EmptyDesc>
          <EmptyActions>
            <ActionBtn to="/shopping">가상 쇼핑하러 가기</ActionBtn>
            <ActionBtn to="/delivery" className="secondary">가상 배달 둘러보기</ActionBtn>
          </EmptyActions>
        </EmptyState>
      )}
    </VhContainer>
  );
};

// === styled-components ===

const VhContainer = styled.main`
  padding: 8px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100vh;
`;

const VhHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  min-height: 44px;
`;

const HeaderBack = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const HeaderTitle = styled.h1`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HeaderSpacer = styled.div`
  width: 32px;
`;

const SummaryBanner = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: linear-gradient(135deg, #1E1F2E 0%, #2A2C3E 100%);
  border-radius: 20px;
  padding: 18px 20px;
  color: #FFFFFF;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const SummaryTopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SummaryTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BannerIcon = styled.div`
  font-size: 24px;
  flex: none;
`;

const BannerTitle = styled.h2`
  font-size: 15px;
  font-weight: 800;
  color: #FFAE00;
`;

const BannerSubtitle = styled.p`
  font-size: 11.5px;
  color: #D1D5DB;
  margin-top: 2px;

  strong {
    color: #FFFFFF;
    font-weight: 700;
  }
`;

const TotalCountBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #FFAE00;
  background: rgba(255, 174, 0, 0.15);
  padding: 4px 10px;
  border-radius: 999px;
`;

const SummaryStatGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 12px 16px;
`;

const StatBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const StatLabel = styled.span`
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: 15.5px;
  font-weight: 800;
  color: #FFFFFF;

  &.highlight {
    color: #FFAE00;
  }
`;

const StatDivider = styled.div`
  width: 1px;
  height: 26px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 12px;
`;

const PurchaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PurchaseCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.brandYellow};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TypeBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;

  &.shopping {
    background: rgba(255, 174, 0, 0.12);
    color: #E69500;
  }

  &.delivery {
    background: rgba(47, 158, 110, 0.12);
    color: #2F9E6E;
  }
`;

const StatusBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;

  &.주문완료 {
    background: rgba(148, 163, 184, 0.15);
    color: #64748B;
  }

  &.준비중 {
    background: rgba(255, 174, 0, 0.15);
    color: #D97706;
  }

  &.배송중 {
    background: rgba(59, 130, 246, 0.15);
    color: #2563EB;
  }

  &.배송완료 {
    background: rgba(47, 158, 110, 0.15);
    color: #16A34A;
  }
`;

const CardBodyRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ItemThumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  flex: none;
  background: #F3F4F6;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const ItemTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemSubtitle = styled.p`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemPrice = styled.p`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardBottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const OrderDate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailLinkText = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandYellow};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  margin-top: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 44px;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
`;

const EmptyDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: 24px;
`;

const EmptyActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 240px;
`;

const ActionBtn = styled(Link)`
  padding: 12px 0;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 13.5px;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &.secondary {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;
