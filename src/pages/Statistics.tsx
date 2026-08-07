import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';

export const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const {
    getMonthlyTotal,
    getMonthlyStats,
    getBudgetGoal,
    getSavedAmount,
    getSavingsProgress,
    getCategoryBreakdown,
    getTopSpendingCategory,
    getWeeklyByDayOfWeek,
    getAiInsight
  } = useLedger();

  const totalExpense = getMonthlyTotal('2024-10');
  const monthlyStats = getMonthlyStats();
  const budget = getBudgetGoal();
  const savedAmount = getSavedAmount();
  const savingsProgress = getSavingsProgress();
  const categories = getCategoryBreakdown();
  const topCategory = getTopSpendingCategory();
  const weekly = getWeeklyByDayOfWeek();
  const aiInsight = getAiInsight();

  // 예산 달성 도넛 차트 계산
  const budgetRadius = 40;
  const budgetCircumference = 2 * Math.PI * budgetRadius;
  const budgetFillLength = (budget.achievedPercent / 100) * budgetCircumference;

  // 요일별 지출 최댓값 기준 높이 pct
  const maxWeeklyAmount = Math.max(...weekly.amounts);
  const peakIndex = weekly.amounts.indexOf(maxWeeklyAmount);

  // 카테고리 도넛 조각 계산 (stroke-dasharray & stroke-dashoffset)
  const categoryRadius = 40;
  const categoryCircumference = 2 * Math.PI * categoryRadius;
  
  // 색상 맵핑
  const categoryColors = ['#2b2d42', '#5c5f7a', '#9799ac', '#c6c8d4', '#e4e5ea'];
  let currentOffset = 0;

  const fmtWon = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

  return (
    <StatsContainer>
      {/* 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/')} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>통계</HeaderTitle>
      </PageHeader>

      {/* 2x2 요약 카드 */}
      <StatsGrid>
        {/* 카드 1: 이번 달 총 지출 */}
        <Card className="stat-box">
          <StatBoxLabel>이번 달 총 지출</StatBoxLabel>
          <StatBoxValue>{fmtWon(totalExpense)}</StatBoxValue>
          <StatBoxFooter>
            <div>
              <Pill className={monthlyStats.diffPercentFromLastMonth >= 0 ? 'pill--negative' : 'pill--positive'}>
                {monthlyStats.diffPercentFromLastMonth >= 0 ? '+' : ''}{monthlyStats.diffPercentFromLastMonth}%
              </Pill>
              <p className="stat-box__caption">지난 달 대비</p>
            </div>
            <span className="stat-box__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="13" rx="2.2" stroke="#2B2D42" strokeWidth="1.8"/>
                <path d="M3 10.2h18" stroke="#2B2D42" strokeWidth="1.8"/>
              </svg>
            </span>
          </StatBoxFooter>
        </Card>

        {/* 카드 2: 예산 달성률 */}
        <Card className="stat-box stat-box--center">
          <StatBoxLabel>예산 달성률</StatBoxLabel>
          <MiniDonut>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ECEDF1" strokeWidth="12"/>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#2B2D42"
                strokeWidth="12"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                strokeDasharray={`${budgetFillLength} ${budgetCircumference}`}
              />
            </svg>
            <span className="mini-donut__value">{budget.achievedPercent}%</span>
          </MiniDonut>
          <p className="stat-box__caption">예산 {budget.target.toLocaleString('ko-KR')}원</p>
        </Card>

        {/* 카드 3: 이번 달 모은 금액 */}
        <Card className="stat-box">
          <StatBoxLabel>이번 달 모은 금액</StatBoxLabel>
          <StatBoxValue className="stat-box__value--accent">{fmtWon(savedAmount)}</StatBoxValue>
          <div style={{ marginTop: 'auto' }}>
            <p className="stat-box__caption">
              지난 달 보다<br />
              10% 더 저금하셨어요!
            </p>
          </div>
        </Card>

        {/* 카드 4: 목표 저축 진행률 */}
        <Card className="stat-box">
          <StatBoxLabel>목표 저축 진행률</StatBoxLabel>
          <ProgressBar>
            <ProgressBarFill style={{ width: `${savingsProgress.percentage}%` }} />
          </ProgressBar>
          <StatBoxValueLg>{savingsProgress.percentage}%</StatBoxValueLg>
          <p className="stat-box__caption">
            거의 다 왔어요!<br />
            조금만 더 파이팅!
          </p>
        </Card>
      </StatsGrid>

      {/* 카테고리별 소비 */}
      <Card className="category-card">
        <CategoryCardTitle>카테고리별 소비</CategoryCardTitle>
        <CategoryCardBody>
          <CategoryDonut>
            <svg viewBox="0 0 100 100">
              {categories.map((item, idx) => {
                const strokeLength = (item.percentage / 100) * categoryCircumference;
                const strokeOffset = -currentOffset;
                currentOffset += strokeLength;
                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={categoryColors[idx % categoryColors.length]}
                    strokeWidth="14"
                    strokeDasharray={`${strokeLength} ${categoryCircumference}`}
                    strokeDashoffset={strokeOffset}
                    transform="rotate(-90 50 50)"
                  />
                );
              })}
            </svg>
            <span className="category-donut__value">{categories[0]?.percentage || 0}%</span>
          </CategoryDonut>

          <CategoryLegend>
            {categories.map((item, idx) => (
              <CategoryLegendRow key={idx}>
                <CategoryLegendDot style={{ background: categoryColors[idx % categoryColors.length] }} />
                <span className="category-legend__name">{item.name}</span>
                <span className="category-legend__percent">{item.percentage}%</span>
              </CategoryLegendRow>
            ))}
          </CategoryLegend>
        </CategoryCardBody>
      </Card>

      {/* TOP1 / 지난 달 대비 */}
      <StatsGrid>
        {/* 소비 TOP 1 */}
        <Card className="top-card">
          <TopCardLabel>소비 TOP 1</TopCardLabel>
          <TopCardTitle>
            <span className="top-card__emoji">{topCategory.icon}</span>
            <span>{topCategory.name}</span>
          </TopCardTitle>
          <TopCardAmount>{fmtWon(topCategory.amount)}</TopCardAmount>
          <p className="stat-box__caption">가장 많이 사용한 분야</p>
        </Card>

        {/* 지난 달 대비 */}
        <Card className="diff-card">
          <TopCardLabel>지난 달 대비</TopCardLabel>
          <DiffCardValue>
            +{topCategory.diffPercentFromLastMonth}%
            <span className="diff-card__arrow">↑</span>
          </DiffCardValue>
          <DiffCardFooter>
            <p className="stat-box__caption">
              지난 달보다 식비를<br />
              30% 더 사용했어요
            </p>
            <DiffCardBars>
              <span style={{ height: '35%' }} />
              <span style={{ height: '60%' }} />
              <span style={{ height: '85%' }} />
            </DiffCardBars>
          </DiffCardFooter>
        </Card>
      </StatsGrid>

      {/* 요일별 소비 */}
      <Card className="weekday-card">
        <WeekdayCardTitle>요일별 소비</WeekdayCardTitle>
        <WeekdayChart>
          {weekly.days.map((day, i) => {
            const amount = weekly.amounts[i];
            const heightPct = Math.max(12, Math.round((amount / maxWeeklyAmount) * 100));
            const isPeak = i === peakIndex;
            return (
              <WeekdayChartCol key={day} className={isPeak ? 'is-peak' : ''}>
                <WeekdayChartBar style={{ height: `${heightPct}%` }} />
                <span className="weekday-chart__label">{day}</span>
              </WeekdayChartCol>
            );
          })}
        </WeekdayChart>
      </Card>

      {/* AI 소비 분석 */}
      <Card className="ai-analysis">
        <AiCardTitle>AI 소비 분석</AiCardTitle>
        <AiCardContent>
          <AiCardIcon>💡</AiCardIcon>
          <AiCardText>{aiInsight}</AiCardText>
        </AiCardContent>
      </Card>
    </StatsContainer>
  );
};

// Styled Components
const StatsContainer = styled.main`
  padding: 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PageHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0 12px;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2b2d42;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 800;
  color: #2b2d42;
`;

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};

  &.stat-box {
    min-height: 170px;
    padding: 18px;
    display: flex;
    flex-direction: column;
  }

  &.category-card {
    padding: 22px;
  }

  &.top-card,
  &.diff-card {
    min-height: 188px;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  &.weekday-card {
    min-height: 200px;
    padding: 22px;
  }

  &.ai-analysis {
    min-height: 120px;
    padding: 24px;
  }
`;

const StatBoxLabel = styled.p`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatBoxValue = styled.p`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.textPrimary};

  &.stat-box__value--accent {
    color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const StatBoxFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .stat-box__caption {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.4;
  }
`;

const Pill = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  padding: 5px 9px;
  border-radius: 999px;
  margin-bottom: 6px;

  &.pill--negative {
    background: #ffe1e1;
    color: ${({ theme }) => theme.colors.brandNegative};
  }

  &.pill--positive {
    background: #e4f5ec;
    color: ${({ theme }) => theme.colors.brandPositive};
  }
`;

const StatBoxIcon = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  svg {
    width: 22px;
    height: 22px;
    color: #2b2d42;
  }
`;

const StatBoxLg = styled.div`
  align-items: center;
  text-align: center;
`;

const MiniDonut = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 4px 0 10px;

  .mini-donut__value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 800;
    color: #2b2d42;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin: 4px 0 10px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: #2b2d42;
`;

const StatBoxValueLg = styled.p`
  font-size: 26px;
  font-weight: 800;
  color: #2b2d42;
  margin-bottom: 4px;
`;

const CategoryCardTitle = styled.p`
  margin-bottom: 22px;
  font-size: 17px;
  font-weight: 800;
  color: #2b2d42;
`;

const CategoryCardBody = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 24px;
`;

const CategoryDonut = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex: none;

  .category-donut__value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 800;
    color: #2b2d42;
  }
`;

const CategoryLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  min-width: 0;
`;

const CategoryLegendRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};

  .category-legend__name {
    flex: 1;
  }

  .category-legend__percent {
    margin-left: 12px;
    font-weight: 800;
    color: #2b2d42;
  }
`;

const CategoryLegendDot = styled.span`
  width: 10px;
  height: 10px;
  margin-right: 10px;
  flex: none;
  border-radius: 50%;
`;

const TopCardLabel = styled.p`
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TopCardTitle = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: auto;
  font-size: 24px;
  font-weight: 800;
  color: #2b2d42;

  .top-card__emoji {
    font-size: 32px;
    line-height: 1;
  }
`;

const TopCardAmount = styled.p`
  margin-bottom: 6px;
  font-size: 30px;
  font-weight: 800;
  color: #2b2d42;
`;

const DiffCardValue = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.brandNegative};

  .diff-card__arrow {
    font-size: 28px;
    line-height: 1;
  }
`;

const DiffCardFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
`;

const DiffCardBars = styled.div`
  height: 48px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
  flex: none;

  span {
    width: 10px;
    border-radius: 3px 3px 0 0;
    background: #dce3ec;
  }

  span:nth-child(2) {
    background: #c5d0df;
  }

  span:nth-child(3) {
    background: #96a8bf;
  }
`;

const WeekdayCardTitle = styled.p`
  margin-bottom: 24px;
  font-size: 17px;
  font-weight: 800;
  color: #2b2d42;
`;

const WeekdayChart = styled.div`
  height: 125px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

const WeekdayChartBar = styled.div`
  width: 20px;
  max-height: 96px;
  border-radius: 3px 3px 0 0;
  background: #eef2f7;
`;

const WeekdayChartCol = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  &.is-peak ${WeekdayChartBar} {
    background: #2b2d42;
  }

  .weekday-chart__label {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &.is-peak .weekday-chart__label {
    font-weight: 800;
    color: #2b2d42;
  }
`;

const AiCardTitle = styled.p`
  margin-bottom: 18px;
  font-size: 17px;
  font-weight: 800;
  color: #2b2d42;
`;

const AiCardContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const AiCardIcon = styled.div`
  width: 54px;
  height: 54px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f7fb;
  font-size: 28px;
`;

const AiCardText = styled.p`
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.8;
  color: #2b2d42;
`;
