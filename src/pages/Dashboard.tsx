import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    getStreak,
    getWeeklySummary,
    getTopCategory,
    getSavingsGoal,
    getQuickMenu
  } = useLedger();

  const streak = getStreak();
  const weekly = getWeeklySummary();
  const topCat = getTopCategory();
  const goal = getSavingsGoal();
  const quickItems = getQuickMenu();

  // 요일별 지출 최댓값 기반 막대 높이 pct 계산
  const maxAmount = Math.max(...weekly.amounts);
  const peakIndex = weekly.amounts.indexOf(maxAmount);

  // 도넛 차트 호 길이 계산
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const fillLength = (topCat.percentage / 100) * circumference;

  // 저축 목표 세그먼트 개수 및 비율 계산
  const goalPercent = Math.round((goal.saved / goal.target) * 100);
  const remaining = goal.target - goal.saved;
  const segmentCount = 5;
  const progressUnits = (goalPercent / 100) * segmentCount;

  // 원화 포맷
  const fmtWon = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

  const checkSvg = (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5 10 17 19 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <MainContainer>
      {/* 헤더 */}
      <Header>
        <HeaderProfile>
          <HeaderAvatar onClick={() => navigate('/mypage')}>
            <svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
              <rect width="46" height="46" fill="#FFE8B8"/>
              <circle cx="23" cy="19" r="8" fill="#2B2D42"/>
              <path d="M6 46c0-10 7.5-16 17-16s17 6 17 16" fill="#2B2D42"/>
            </svg>
            <AvatarEdit aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 4.5 19.5 8.5 9 19H5v-4L15.5 4.5Z" stroke="#2B2D42" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </AvatarEdit>
          </HeaderAvatar>
          <div>
            <GreetingSub>안녕하세요,</GreetingSub>
            <GreetingMain>사용자님!</GreetingMain>
          </div>
        </HeaderProfile>
        <HeaderActions>
          <IconButton aria-label="알림">
            <IconButtonDot aria-hidden="true" />
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" stroke="#2B2D42" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke="#2B2D42" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </IconButton>
          <IconButton aria-label="마이페이지" onClick={() => navigate('/mypage')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8.5" r="3.5" stroke="#2B2D42" strokeWidth="1.8"/>
              <path d="M4.5 19.5c1.4-3.2 4.3-5 7.5-5s6.1 1.8 7.5 5" stroke="#2B2D42" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </IconButton>
        </HeaderActions>
      </Header>

      {/* 스트릭 카드 */}
      <Card className="streak-card">
        <StreakTitle>{streak.currentStreak}일 연속 가계부 작성 중! 🔥</StreakTitle>
        <StreakSubtitle>작은 습관이 큰 변화를 만들어요.</StreakSubtitle>
        
        <StreakRow>
          {streak.labels.map((label, i) => {
            const checked = streak.checked[i];
            return (
              <StreakDay key={i} className={checked ? 'is-checked' : ''}>
                <StreakBadge>{checked ? checkSvg : null}</StreakBadge>
                <StreakDayLabel>{label}</StreakDayLabel>
              </StreakDay>
            );
          })}
        </StreakRow>

        <StreakCta to="/add">가계부 작성하기</StreakCta>
      </Card>

      {/* 2열 카드: 막대그래프 / 도넛 */}
      <StatRow>
        <Card className="stat-card weekly-card">
          <WeeklyCardTitle>이번 주 지출 금액 요약</WeeklyCardTitle>
          <BarChartContainer>
            {weekly.days.map((day, i) => {
              const amount = weekly.amounts[i];
              const heightPct = Math.max(14, Math.round((amount / maxAmount) * 100));
              const isPeak = i === peakIndex;
              return (
                <BarChartCol key={i} className={isPeak ? 'is-peak' : ''}>
                  <BarChartBar style={{ height: `${heightPct}%` }} />
                  <BarChartLabel>{day}</BarChartLabel>
                </BarChartCol>
              );
            })}
          </BarChartContainer>
          <StatCardAmount>{fmtWon(weekly.total)}</StatCardAmount>
          <StatCardBadge>
            지난주 보다 {Math.round(weekly.diffFromLastWeek / 10000)}만원 더 썼어요!
          </StatCardBadge>
        </Card>

        <Card className="stat-card donut-card">
          <DonutContainer>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ECEDF1" strokeWidth="14" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#2B2D42"
                strokeWidth="14"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                strokeDasharray={`${fillLength} ${circumference}`}
              />
            </svg>
            <DonutValue>{topCat.percentage}%</DonutValue>
          </DonutContainer>
          <DonutCardCaption>이번 주 가장 많은 지출</DonutCardCaption>
          <DonutCardCategory>{topCat.name}</DonutCardCategory>
        </Card>
      </StatRow>

      {/* 저축 목표 카드 */}
      <Card onClick={() => navigate('/target')} style={{ cursor: 'pointer' }}>
        <GoalCardTop>
          <GoalCardIcon>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="2.5" width="12" height="19" rx="2.2" stroke="#FFAE00" strokeWidth="1.8"/>
              <circle cx="12" cy="18" r="0.9" fill="#FFAE00"/>
            </svg>
          </GoalCardIcon>
          <GoalCardTitleWrap>
            <GoalCardTitle>{goal.title}</GoalCardTitle>
            <GoalCardDday>D{goal.dDay <= 0 ? goal.dDay : `+${goal.dDay}`}</GoalCardDday>
          </GoalCardTitleWrap>
          <GoalCardPercent>{goalPercent}%</GoalCardPercent>
        </GoalCardTop>
        <GoalProgress>
          {Array.from({ length: segmentCount }).map((_, i) => {
            const fillRatio = Math.min(1, Math.max(0, progressUnits - i));
            return (
              <GoalProgressSeg key={i}>
                <GoalProgressSegFill style={{ width: `${fillRatio * 100}%` }} />
              </GoalProgressSeg>
            );
          })}
        </GoalProgress>
        <GoalCardCaption>목표까지 {fmtWon(remaining)} 남았어요!</GoalCardCaption>
      </Card>

      {/* 퀵메뉴 */}
      <Card>
        <QuickmenuTitle>심스펜드 시작하기</QuickmenuTitle>
        <QuickmenuGrid>
          {quickItems.map((item) => {
            let iconClass = '';
            let targetPath = '/';
            if (item.label === '가상 쇼핑') {
              iconClass = 'fa-solid fa-cart-shopping';
              targetPath = '/pay';
            } else if (item.label === '가상 배달') {
              iconClass = 'fa-solid fa-burger';
              targetPath = '/pay';
            } else if (item.label === '가상 구매 목록') {
              iconClass = 'fa-solid fa-list-check';
              targetPath = '/target';
            } else if (item.label === 'AI 리포트') {
              iconClass = 'fa-solid fa-chart-column';
              targetPath = '/statistics';
            }
            return (
              <QuickmenuItem key={item.id} onClick={() => navigate(targetPath)}>
                <QuickmenuThumb>
                  <i className={iconClass} />
                </QuickmenuThumb>
                <QuickmenuLabel>{item.label}</QuickmenuLabel>
              </QuickmenuItem>
            );
          })}
        </QuickmenuGrid>
      </Card>
    </MainContainer>
  );
};

// Styled Components
const MainContainer = styled.main`
  width: 100%;
  padding: 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const HeaderProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderAvatar = styled.span`
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  flex: none;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};

  svg:first-child {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 14px;
    overflow: hidden;
  }
`;

const AvatarEdit = styled.span`
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1.5px solid ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(43, 45, 66, 0.15);

  svg {
    width: 10px;
    height: 10px;
  }
`;

const GreetingSub = styled.p`
  margin-bottom: 2px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GreetingMain = styled.p`
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  position: relative;
  display: block;
  width: 26px;
  height: 26px;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const IconButtonDot = styled.span`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandNegative};
  border: 1.5px solid ${({ theme }) => theme.colors.background};
`;

const Card = styled.section`
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.card};

  &.streak-card {
    padding: 18px 16px 16px;
  }
`;

const StreakTitle = styled.p`
  margin-bottom: 3px;
  font-size: 14px;
  line-height: 1.35;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StreakSubtitle = styled.p`
  margin-bottom: 16px;
  font-size: 10px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StreakRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 18px;
`;

const StreakBadge = styled.span`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a8b4c8;
  color: #ffffff;
  flex: none;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StreakDay = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  &.is-checked ${StreakBadge} {
    background: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const StreakDayLabel = styled.span`
  font-size: 9px;
  line-height: 1;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StreakCta = styled(Link)`
  display: block;
  width: fit-content;
  margin: 0 auto;
  padding: 4px 8px;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 800;
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatRow = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 16px;
`;

const WeeklyCardTitle = styled.p`
  width: 100%;
  margin-bottom: 18px;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BarChartContainer = styled.div`
  width: 100%;
  height: 105px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const BarChartBar = styled.div`
  position: relative;
  z-index: 1;
  width: 28px;
  max-height: 78px;
  border-radius: 3px 3px 0 0;
  background: #c8d2df;
`;

const BarChartCol = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    width: 28px;
    height: 78px;
    border-radius: 3px 3px 0 0;
    background: #eef2fa;
  }

  &.is-peak ${BarChartBar} {
    background: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const BarChartLabel = styled.span`
  position: relative;
  z-index: 2;
  font-size: 10px;
  line-height: 1;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};

  .is-peak & {
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const StatCardAmount = styled.p`
  margin: 0 0 12px;
  font-size: 26px;
  line-height: 1.1;
  font-weight: 800;
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

const StatCardBadge = styled.span`
  display: inline-block;
  align-self: center;
  margin: 0;
  padding: 7px 10px;
  border-radius: 999px;
  background: #fff3d9;
  color: #c97b00;
  font-size: 9px;
  line-height: 1.3;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
`;

const DonutContainer = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  margin-bottom: 14px;
  flex: none;
`;

const DonutValue = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DonutCardCaption = styled.p`
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DonutCardCategory = styled.p`
  font-size: 26px;
  line-height: 1.2;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.brandYellow};
`;

const GoalCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const GoalCardIcon = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #fff3d9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const GoalCardTitleWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const GoalCardTitle = styled.p`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const GoalCardDday = styled.p`
  margin-top: 2px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GoalCardPercent = styled.p`
  flex: none;
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.brandYellow};
`;

const GoalProgress = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 12px;
`;

const GoalProgressSeg = styled.div`
  position: relative;
  flex: 1;
  height: 16px;
  border-radius: 999px;
  background: #dde0ea;
  overflow: hidden;
`;

const GoalProgressSegFill = styled.div`
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.textPrimary};
`;

const GoalCardCaption = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const QuickmenuTitle = styled.p`
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const QuickmenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
`;

const QuickmenuItem = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  cursor: pointer;
`;

const QuickmenuThumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  background: #e4e5ea;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #d8d9de;
  }

  i {
    font-size: 32px;
    color: #2b2d42;
  }
`;

const QuickmenuLabel = styled.span`
  font-size: 10.5px;
  line-height: 1.3;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
