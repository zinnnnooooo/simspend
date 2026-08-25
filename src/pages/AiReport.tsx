import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { useGraphAnimation } from '@/hooks/useGraphAnimation';

interface MergedItem {
  id: string;
  type: 'shopping' | 'delivery';
  title: string;
  category: string;
  price: number;
  date: string;
}

export const AiReport: React.FC = () => {
  const navigate = useNavigate();
  const { virtualPurchases, transactions } = useLedger();

  const progress = useGraphAnimation(1000);

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 가상 쇼핑 데이터
  const shoppingItems: MergedItem[] = (virtualPurchases || []).map(item => ({
    id: item.id,
    type: 'shopping',
    title: item.productName,
    category: item.category || '쇼핑',
    price: item.price,
    date: item.createdAt || new Date().toISOString()
  }));

  // 가상 배달 데이터
  const deliveryItems: MergedItem[] = (transactions || [])
    .filter(tx => tx.id.startsWith('tx_delivery_') || (tx.category === '식비' && (tx.memo.includes('점') || tx.memo.includes('식당'))))
    .map(tx => ({
      id: tx.id,
      type: 'delivery',
      title: tx.memo || '가상 배달',
      category: '배달/외식',
      price: tx.amount,
      date: tx.createdAt || tx.date
    }));

  // 기본 시드 데이터 (기본 fallback)
  const defaultItems: MergedItem[] = [
    { id: 'd1', type: 'shopping', title: 'iPhone 16 Pro Max 1TB', category: '전자기기', price: 2250000, date: new Date().toISOString() },
    { id: 'd2', type: 'shopping', title: '클래식 플랩 백 캐비어 스킨', category: '명품', price: 14791500, date: new Date().toISOString() },
    { id: 'd3', type: 'delivery', title: '파파존스 수퍼 파파스 피자 (L)', category: '배달/외식', price: 28500, date: new Date().toISOString() },
    { id: 'd4', type: 'shopping', title: '에어팟 맥스 스페이스 그레이', category: '전자기기', price: 653650, date: new Date().toISOString() }
  ];

  const allItems = [...shoppingItems, ...deliveryItems].length > 0
    ? [...shoppingItems, ...deliveryItems]
    : defaultItems;

  // 1. 총 가상 구매 금액 & 이번 달 금액 계산
  const totalAmount = allItems.reduce((sum, item) => sum + item.price, 0);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthAmount = allItems
    .filter(item => {
      try {
        const d = new Date(item.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      } catch {
        return true;
      }
    })
    .reduce((sum, item) => sum + item.price, 0);

  // 2. 카테고리별 비중 계산
  const categoryMap: Record<string, number> = {};
  allItems.forEach(item => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.price;
  });

  const categoryList = Object.entries(categoryMap)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: Math.round((amount / (totalAmount || 1)) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryList[0] || { name: '전자기기', percent: 65, amount: 2903650 };

  // 3. 최고가 품목
  const mostExpensiveItem = [...allItems].sort((a, b) => b.price - a.price)[0] || {
    title: '클래식 미디엄 플랩 백',
    price: 14791500,
    category: '명품'
  };

  // 4. 불필요 소비 고위험 항목 추출 (단일가 30만원 이상 또는 야간 배달 등)
  const highRiskItems = allItems.filter(item => item.price >= 300000 || item.type === 'delivery' && item.price >= 30000);

  // AI 절약 점수 계산 (가상 구매로 방어한 충동구매 점수: 85~98점)
  const defenseScore = Math.min(98, Math.max(82, 80 + allItems.length * 2));

  return (
    <ReportContainer>
      {/* 1. 상단 헤더 */}
      <ReportHeader>
        <HeaderBack onClick={() => navigate('/')} aria-label="메인으로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </HeaderBack>
        <HeaderTitle>AI 소비 분석 리포트</HeaderTitle>
        <HeaderSpacer />
      </ReportHeader>

      {/* 2. AI 종합 진단 배너 */}
      <AiDiagnosisCard>
        <DiagnosisTop>
          <AiBadge>
            <span>🤖</span> AI 심스펜드 분석관
          </AiBadge>
          <ScoreBadge>
            지출 방어율 <strong>{Math.round(defenseScore * progress)}점</strong>
          </ScoreBadge>
        </DiagnosisTop>
        <DiagnosisTitle>
          가상 소비로 <strong>{fmtWon(totalAmount * progress)}</strong>의<br />
          충동 지출을 성공적으로 방어했어요!
        </DiagnosisTitle>
        <DiagnosisDesc>
          사고 싶은 순간 가상으로 결제하여 뇌의 보상 심리를 충족하고, 실제 통장 잔고의 유출을 완벽하게 차단했습니다.
        </DiagnosisDesc>
      </AiDiagnosisCard>

      {/* 3. 총 금액 및 이번 달 금액 요약 카드 */}
      <StatSummaryGrid>
        <StatCard>
          <StatLabel>지금까지 가상 방어 총액</StatLabel>
          <StatValue>{fmtWon(totalAmount * progress)}</StatValue>
          <StatSub>총 {allItems.length}건의 가상 구매</StatSub>
        </StatCard>
        <StatCard className="highlight">
          <StatLabel>이번 달 가상 절약액</StatLabel>
          <StatValue className="yellow">{fmtWon(currentMonthAmount * progress)}</StatValue>
          <StatSub>이번 달 충동구매 방어</StatSub>
        </StatCard>
      </StatSummaryGrid>

      {/* 4. 카테고리별 지출 비중 */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>📊 카테고리별 지출 비중</SectionTitle>
          <SectionSub>가장 많이 쏠린 항목: <strong>{topCategory.name}</strong></SectionSub>
        </SectionHeader>

        <CategoryBarContainer>
          {categoryList.map((cat, idx) => {
            const colors = ['#FFAE00', '#FF5C5C', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];
            const barColor = colors[idx % colors.length];
            return (
              <CategoryBarRow key={cat.name}>
                <CategoryLabelRow>
                  <span className="name">{cat.name}</span>
                  <span className="val">{fmtWon(cat.amount * progress)} ({Math.round(cat.percent * progress)}%)</span>
                </CategoryLabelRow>
                <BarTrack>
                  <BarFill style={{ width: `${cat.percent * progress}%`, backgroundColor: barColor }} />
                </BarTrack>
              </CategoryBarRow>
            );
          })}
        </CategoryBarContainer>
      </SectionCard>

      {/* 5. 최다 지출 카테고리 & 최고가 방어 품목 */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>🏆 주요 소비 패턴 요약</SectionTitle>
        </SectionHeader>
        <InsightGrid>
          <InsightBox>
            <InsightIcon>🔥</InsightIcon>
            <InsightInfo>
              <InsightTitle>최다 구매 카테고리</InsightTitle>
              <InsightValue>{topCategory.name} ({topCategory.percent}%)</InsightValue>
            </InsightInfo>
          </InsightBox>
          <InsightBox>
            <InsightIcon>💎</InsightIcon>
            <InsightInfo>
              <InsightTitle>최고가 방어 품목</InsightTitle>
              <InsightValue>{mostExpensiveItem.title}</InsightValue>
              <InsightSub>{fmtWon(mostExpensiveItem.price)} 절약</InsightSub>
            </InsightInfo>
          </InsightBox>
        </InsightGrid>
      </SectionCard>

      {/* 6. 불필요 소비 고위험 항목 */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>⚠️ 불필요 충동구매 위험 항목</SectionTitle>
        </SectionHeader>
        <RiskItemList>
          {highRiskItems.slice(0, 3).map(item => (
            <RiskItemRow key={item.id}>
              <RiskTag>고위험</RiskTag>
              <RiskInfo>
                <p className="title">{item.title}</p>
                <p className="price">{fmtWon(item.price)}</p>
              </RiskInfo>
              <RiskReason>단기 충동 지출 위험</RiskReason>
            </RiskItemRow>
          ))}
        </RiskItemList>
      </SectionCard>

      {/* 7. 절약을 위한 AI 맞춤 추천 행동 3가지 */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>💡 절약을 위한 AI 추천 행동 3가지</SectionTitle>
        </SectionHeader>
        <ActionPlanList>
          <ActionPlanItem>
            <ActionNum>1</ActionNum>
            <ActionText>
              <strong>72시간 장바구니 쿨다운 규칙</strong><br />
              고가 품목({topCategory.name} 등)은 가상 장바구니에 담아두고 3일 뒤에도 필요한지 스스로 점검해보세요.
            </ActionText>
          </ActionPlanItem>
          <ActionPlanItem>
            <ActionNum>2</ActionNum>
            <ActionText>
              <strong>야간 배달 충동 가상 주문으로 대체</strong><br />
              심야 시간대 배달 욕구가 생길 때는 가상 배달 기능을 통해 지출 없이 시각적 만족을 먼저 채워보세요.
            </ActionText>
          </ActionPlanItem>
          <ActionPlanItem>
            <ActionNum>3</ActionNum>
            <ActionText>
              <strong>가상 절약액 50% 실전 저축 이체</strong><br />
              이번 달 가상으로 아낀 <strong>{fmtWon(currentMonthAmount)}</strong> 중 50%를 실제 저축 계좌로 이체해 성취감을 극대화하세요.
            </ActionText>
          </ActionPlanItem>
        </ActionPlanList>
      </SectionCard>
    </ReportContainer>
  );
};

// === styled-components ===

const ReportContainer = styled.main`
  padding: 8px 20px 50px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ReportHeader = styled.header`
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

const AiDiagnosisCard = styled.section`
  background: linear-gradient(135deg, #1E1F2E 0%, #2B2D42 100%);
  border-radius: 20px;
  padding: 20px;
  color: #FFFFFF;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const DiagnosisTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const AiBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 174, 0, 0.15);
  color: #FFAE00;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
`;

const ScoreBadge = styled.div`
  font-size: 11.5px;
  color: #A0A3B5;

  strong {
    color: #43C68A;
    font-size: 13px;
    font-weight: 800;
  }
`;

const DiagnosisTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
  margin-bottom: 10px;

  strong {
    color: #FFAE00;
  }
`;

const DiagnosisDesc = styled.p`
  font-size: 12.5px;
  line-height: 1.55;
  color: #D1D5DB;
`;

const StatSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.highlight {
    border-color: rgba(255, 174, 0, 0.3);
  }
`;

const StatLabel = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`;

const StatValue = styled.span`
  font-size: 16.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};

  &.yellow {
    color: #FFAE00;
  }
`;

const StatSub = styled.span`
  font-size: 10.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const SectionCard = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 18px;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: #FFAE00;
    font-weight: 700;
  }
`;

const CategoryBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategoryBarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CategoryLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;

  .name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .val {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 500;
  }
`;

const BarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease-in-out;
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const InsightBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InsightIcon = styled.div`
  font-size: 20px;
  flex: none;
`;

const InsightInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const InsightTitle = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`;

const InsightValue = styled.span`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InsightSub = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #2F9E6E;
`;

const RiskItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RiskItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background};
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const RiskTag = styled.span`
  font-size: 10.5px;
  font-weight: 800;
  color: #FF5C5C;
  background: rgba(255, 92, 92, 0.12);
  padding: 3px 6px;
  border-radius: 4px;
  flex: none;
`;

const RiskInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  flex: 1;
  min-width: 0;

  .title {
    font-size: 12.5px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
  }
`;

const RiskReason = styled.span`
  font-size: 11px;
  color: #FF5C5C;
  font-weight: 600;
  flex: none;
`;

const ActionPlanList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionPlanItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: ${({ theme }) => theme.colors.background};
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionNum = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 11.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  margin-top: 1px;
`;

const ActionText = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textPrimary};

  strong {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
