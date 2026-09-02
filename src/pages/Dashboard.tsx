import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { useSequentialAnimation } from '@/hooks/useSequentialAnimation';
import { useGraphAnimation } from '@/hooks/useGraphAnimation';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'noti_1',
    title: 'AI 소비 리포트 발행 💡',
    message: '이번 주 소비 패턴 분석과 똑똑한 절약 팁이 도착했습니다.',
    time: '10분 전',
    isRead: false
  },
  {
    id: 'noti_2',
    title: '가상 구매 배송 완료 📦',
    message: '가상 주문하신 상품이 성공적으로 배송 완료 처리되었습니다.',
    time: '2시간 전',
    isRead: false
  },
  {
    id: 'noti_3',
    title: '목표 저축 응원 🎯',
    message: '목표 달성까지 얼마 남지 않았어요! 오늘도 힘내서 저축해보세요.',
    time: '어제',
    isRead: true
  },
  {
    id: 'noti_4',
    title: '가계부 작성 알림 ✍️',
    message: '오늘의 소비 내역을 잊지 말고 가계부에 기록해보세요.',
    time: '2일 전',
    isRead: true
  }
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const { showSnackbar, showConfirm } = useUI();
  const [progress1, progress2, progress3] = useSequentialAnimation(3, 700, 300);
  const {
    getStreak,
    getWeeklySummary,
    getTopCategory,
    getSavingsGoal,
    getQuickMenu
  } = useLedger();

  const progress = useGraphAnimation(1000);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

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
  const fillLength = ((topCat.percentage * progress2) / 100) * circumference;

  // 저축 목표 세그먼트 개수 및 비율 계산
  const goalPercent = Math.round((goal.saved / goal.target) * 100);
  const animatedGoalPercent = Math.round(goalPercent * progress3);
  const animatedSaved = goal.saved * progress3;
  const remaining = goal.target - animatedSaved;
  const segmentCount = 5;
  const progressUnits = ((goalPercent * progress3) / 100) * segmentCount;

  // 원화 포맷
  const fmtWon = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

  const checkSvg = (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5 10 17 19 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <MainContainer>
      {/* 헤더 (시안처럼 흰색 카드 형태로 렌더링) */}
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
          <IconButton 
            aria-label="알림"
            onClick={handleToggleNotification}
          >
            {unreadCount > 0 && <IconButtonDot aria-hidden="true" />}
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
          <AuthTextButton 
            onClick={() => {
              if (user) {
                showConfirm('로그아웃 하시겠습니까?', async () => {
                  try {
                    await logout();
                    showSnackbar('로그아웃되었습니다.');
                    navigate('/login', { replace: true });
                  } catch (error) {
                    console.error('로그아웃 에러:', error);
                  }
                });
              } else {
                try {
                  loginWithGoogle().then(() => {
                    showSnackbar('Google 로그인이 완료되었습니다.');
                  });
                } catch (error) {
                  console.error('로그인 에러:', error);
                }
              }
            }}
          >
            {user ? '로그아웃' : '로그인'}
          </AuthTextButton>
        </HeaderActions>
      </Header>

      {/* 알림 드롭다운 팝업 오버레이 */}
      {isNotificationOpen && (
        <NotificationOverlay onClick={() => setIsNotificationOpen(false)}>
          <NotificationCard onClick={(e) => e.stopPropagation()}>
            <NotificationHeader>
              <NotificationTitleWrap>
                <NotificationTitle>알림</NotificationTitle>
                {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
              </NotificationTitleWrap>
              <NotificationActionGroup>
                {unreadCount > 0 && (
                  <NotificationHeaderBtn type="button" onClick={handleMarkAllAsRead}>
                    모두 읽음
                  </NotificationHeaderBtn>
                )}
                <NotificationCloseBtn 
                  type="button" 
                  onClick={() => setIsNotificationOpen(false)}
                  aria-label="알림 닫기"
                >
                  ✕
                </NotificationCloseBtn>
              </NotificationActionGroup>
            </NotificationHeader>

            <NotificationList>
              {notifications.length === 0 ? (
                <NotificationEmpty>
                  <span className="empty-icon">🔔</span>
                  <p className="empty-text">받은 알림이 없습니다.</p>
                </NotificationEmpty>
              ) : (
                notifications.map((noti) => (
                  <NotificationItemRow
                    key={noti.id}
                    className={noti.isRead ? 'is-read' : 'is-unread'}
                    onClick={() => handleNotificationClick(noti.id)}
                  >
                    <NotificationDot $isRead={noti.isRead} />
                    <NotificationContent>
                      <NotificationItemHead>
                        <NotificationItemTitle>{noti.title}</NotificationItemTitle>
                        <NotificationItemTime>{noti.time}</NotificationItemTime>
                      </NotificationItemHead>
                      <NotificationItemMessage>{noti.message}</NotificationItemMessage>
                    </NotificationContent>
                  </NotificationItemRow>
                ))
              )}
            </NotificationList>
          </NotificationCard>
        </NotificationOverlay>
      )}

      {/* 스트릭 카드 */}
      <Card className="streak-card" $index={0}>
        <StreakTitle>{streak.currentStreak}일 연속 가계부 작성 중!🔥</StreakTitle>
        <StreakSubtitle>작은 습관이 큰 변화를 만들어요.</StreakSubtitle>
        
        <StreakRow>
          {streak.labels.map((label, i) => {
            const checked = streak.checked[i];
            return (
              <StreakDay key={i} className={checked ? 'is-checked' : ''}>
                {/* 시안처럼 체크 여부에 관계없이 아이콘을 띄우고 클래스 투명도로 구분 */}
                <StreakBadge className={checked ? 'checked' : 'unchecked'}>
                  {checkSvg}
                </StreakBadge>
                <StreakDayLabel>{label}</StreakDayLabel>
              </StreakDay>
            );
          })}
        </StreakRow>

        <StreakCta to="/add">가계부 작성하기</StreakCta>
      </Card>

      {/* 2열 카드: 막대그래프 / 도넛 */}
      <StatRow>
        <Card 
          className="stat-card weekly-card" 
          onClick={() => navigate('/statistics')} 
          style={{ cursor: 'pointer' }}
          $index={1}
        >
          <WeeklyCardTitle>이번 주 지출 금액 요약</WeeklyCardTitle>
          <BarChartContainer>
            {weekly.days.map((day, i) => {
              const amount = weekly.amounts[i];
              const heightPct = Math.max(14, Math.round((amount / maxAmount) * 100));
              const animatedHeight = heightPct * progress1;
              const isPeak = i === peakIndex;
              return (
                <BarChartCol key={i} className={isPeak ? 'is-peak' : ''}>
                  <BarChartBar style={{ height: `${animatedHeight}%` }} />
                  <BarChartLabel>{day}</BarChartLabel>
                </BarChartCol>
              );
            })}
          </BarChartContainer>
          <StatCardAmount>{fmtWon(weekly.total * progress1)}</StatCardAmount>
          <StatCardBadge>
            지난주 보다 {Math.round(weekly.diffFromLastWeek / 10000)}만원 더 썼어요!
          </StatCardBadge>
        </Card>

        <Card 
          className="stat-card donut-card" 
          onClick={() => navigate('/statistics')} 
          style={{ cursor: 'pointer' }}
          $index={2}
        >
          <DonutContainer>
            <svg viewBox="0 0 100 100">
              {/* 시안의 부드럽고 통통한 도넛 그래프 모양에 가깝게 strokeWidth 조정 */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ECEDF1" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1E1F2E"
                strokeWidth="12"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                strokeDasharray={`${fillLength} ${circumference}`}
              />
            </svg>
            <DonutValue>{Math.round(topCat.percentage * progress2)}%</DonutValue>
          </DonutContainer>
          <DonutCardCaption>이번 주 가장 많은 지출</DonutCardCaption>
          <DonutCardCategory>{topCat.name}</DonutCardCategory>
        </Card>
      </StatRow>

      {/* 저축 목표 카드 */}
      <Card onClick={() => navigate('/target')} style={{ cursor: 'pointer' }} $index={3}>
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
          <GoalCardPercent>{animatedGoalPercent}%</GoalCardPercent>
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
        {/* 남은 금액 텍스트 강조(strong) 적용 */}
        <GoalCardCaption>목표까지 <strong>{fmtWon(remaining)}</strong> 남았어요!</GoalCardCaption>
      </Card>

      {/* 퀵메뉴 (하단 아이콘/기능 수정 제외 반영) */}
      <Card $index={4}>
        <QuickmenuTitle>심스펜드 시작하기</QuickmenuTitle>
        <QuickmenuGrid>
          {quickItems.map((item) => {
            let iconClass = '';
            let targetPath = '/';
            if (item.label === '가상 쇼핑') {
              iconClass = 'fa-solid fa-cart-shopping';
              targetPath = '/shopping';
            } else if (item.label === '가상 배달') {
              iconClass = 'fa-solid fa-burger';
              targetPath = '/delivery';
            } else if (item.label === '가상 구매 목록') {
              iconClass = 'fa-solid fa-list-check';
              targetPath = '/virtual-history';
            } else if (item.label === 'AI 리포트') {
              iconClass = 'fa-solid fa-chart-column';
              targetPath = '/ai-report';
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
  height: 100dvh;
  padding: clamp(10px, 1.5vh, 20px) 16px clamp(96px, 13vh, 104px);
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.8vh, 20px);
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(8px, 1.2vh, 14px) 18px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderAvatar = styled.span`
  position: relative;
  width: clamp(38px, 5vh, 44px);
  height: clamp(38px, 5vh, 44px);
  border-radius: 50%;
  flex: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }

  svg:first-child {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
`;

const AvatarEdit = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  svg {
    width: 7px;
    height: 7px;
  }
`;

const GreetingSub = styled.p`
  margin-bottom: 1px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const GreetingMain = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AuthTextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#F1F3F6' : '#202336'};
  border-radius: 18px;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s ease;
  box-sizing: border-box;

  &:hover {
    background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#EBECEF' : '#25283D'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const IconButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#F1F3F6' : '#202336'};
  border-radius: 50%;
  transition: background 0.2s, transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#EBECEF' : '#25283D'};
  }

  &:active {
    transform: scale(0.93);
  }

  svg {
    display: block;
    width: 18px;
    height: 18px;
    stroke: ${({ theme }) => theme.colors.textPrimary};
    path {
      stroke: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const IconButtonDot = styled.span`
  position: absolute;
  top: 9px;
  right: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandNegative};
  border: 1px solid ${({ theme }) => theme.colors.cardBackground};
`;

const slideUpFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Card = styled.section<{ $index?: number }>`
  width: 100%;
  padding: clamp(14px, 2.2vh, 24px) 18px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: 
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
    box-shadow 0.3s ease, 
    border-color 0.3s ease, 
    background-color 0.3s ease;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;

  /* Stagger entry animation */
  animation: ${slideUpFadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: ${({ $index = 0 }) => $index * 120}ms;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-5px) scale(1.01) rotateX(1deg) rotateY(0.5deg);
      border-color: rgba(255, 174, 0, 0.3);
      box-shadow: 
        ${({ theme }) => 
          theme.colors.cardBackground === '#FFFFFF' 
            ? '0 12px 30px rgba(25, 27, 46, 0.12)' 
            : '0 12px 30px rgba(0, 0, 0, 0.4)'},
        0 0 15px rgba(255, 174, 0, 0.08);

      /* Parallax element translation inside cards (Only for graphics) */
      svg, img, circle, .goal-icon, span.checked, span.unchecked {
        transform: translateY(-2px) scale(1.03);
      }
    }
  }

  &:active {
    transform: scale(0.98) translateY(-2px);
  }

  /* Transition definition for graphics only */
  svg, img, circle, .goal-icon, span.checked, span.unchecked {
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.22, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
    animation: none !important;
    &:hover, &:active {
      transform: none !important;
      box-shadow: ${({ theme }) => theme.shadows.card} !important;
      border-color: ${({ theme }) => theme.colors.border} !important;
    }
    svg, img, circle {
      transform: none !important;
      transition: none !important;
    }
  }

  /* Level 1 Hero card styling for Streak card */
  &.streak-card {
    background: ${({ theme }) => 
      theme.colors.cardBackground === '#FFFFFF' 
        ? 'linear-gradient(135deg, #191B2E 0%, #20243E 100%)' 
        : 'linear-gradient(135deg, #131422 0%, #191B2E 100%)'};
    color: #FFFFFF;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 12px 30px rgba(25, 27, 46, 0.12);
    padding: clamp(16px, 2.5vh, 26px) 20px clamp(12px, 2vh, 20px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &.weekly-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &.donut-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }) => theme.colors.border} !important;
    }
    svg, img, circle, p, span, h3, h1 {
      transform: none !important;
      transition: none !important;
    }
  }

  /* Level 1 Hero card styling for Streak card */
  &.streak-card {
    background: ${({ theme }) => 
      theme.colors.cardBackground === '#FFFFFF' 
        ? 'linear-gradient(135deg, #191B2E 0%, #20243E 100%)' 
        : 'linear-gradient(135deg, #131422 0%, #191B2E 100%)'};
    color: #FFFFFF;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 12px 30px rgba(25, 27, 46, 0.12);
    padding: clamp(16px, 2.5vh, 26px) 20px clamp(12px, 2vh, 20px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &.weekly-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &.donut-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

const StreakTitle = styled.p`
  margin-bottom: 4px;
  font-size: 17px;
  line-height: 1.35;
  font-weight: 700;
  color: #FFFFFF;
`;

const StreakSubtitle = styled.p`
  margin-bottom: clamp(10px, 1.6vh, 22px);
  font-size: 12px;
  line-height: 1.4;
  color: #9099A8;
  font-weight: 500;
`;

const StreakRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: clamp(12px, 2vh, 24px);
`;

const StreakBadge = styled.span`
  width: clamp(30px, 4.2vh, 38px);
  height: clamp(30px, 4.2vh, 38px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  flex: none;
  transition: background-color 0.2s, transform 0.2s;

  svg {
    width: 15px;
    height: 15px;
  }

  &.checked {
    background: ${({ theme }) => theme.colors.brandYellow};
    color: #191B2E;
    svg path {
      stroke: #191B2E;
    }
  }

  &.unchecked {
    background: rgba(255, 255, 255, 0.12);
    opacity: 0.6;
    svg path {
      stroke: rgba(255, 255, 255, 0.4);
    }
  }
`;

const StreakDay = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4px, 0.6vh, 6px);
`;

const StreakDayLabel = styled.span`
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  color: #9099A8;
  
  .is-checked & {
    color: #FFFFFF;
  }
`;

const StreakCta = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(40px, 5.2vh, 48px);
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.brandYellow};
  color: #191B2E;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: 
    background-color 0.25s cubic-bezier(0.25, 1, 0.22, 1), 
    transform 0.25s cubic-bezier(0.25, 1, 0.22, 1),
    box-shadow 0.25s ease;
  box-shadow: 0 4px 12px rgba(255, 174, 0, 0.15);

  /* Shine Sweep overlay */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.35) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-20deg);
    pointer-events: none;
  }

  @media (hover: hover) {
    &:hover {
      background: #FFB000;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 174, 0, 0.3);

      &::after {
        left: 200%;
        transition: left 0.6s ease-out;
      }
    }
  }

  &:active {
    transform: scale(0.97) translateY(0);
    box-shadow: 0 2px 6px rgba(255, 174, 0, 0.15);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &::after {
      display: none;
    }
    &:hover, &:active {
      transform: none !important;
      box-shadow: none !important;
    }
  }
`;

const StatRow = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 14px;
`;

const WeeklyCardTitle = styled.p`
  width: 100%;
  margin-bottom: 12px;
  font-size: 12px;
  line-height: 1.4;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BarChartContainer = styled.div`
  width: 100%;
  height: clamp(65px, 9vh, 90px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: clamp(10px, 1.5vh, 16px);
  padding: 0 2px;
`;

const BarChartBar = styled.div`
  position: relative;
  z-index: 2;
  width: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#CBD5E1' : '#454861'};
  transition: background-color 0.2s ease;
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
    width: 8px;
    height: 60px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#EEF2FA' : '#232537'};
  }

  &.is-peak ${BarChartBar} {
    background: ${({ theme }) => theme.colors.brandYellow};
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
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const StatCardAmount = styled.p`
  margin: 0 0 6px;
  font-size: 20px;
  line-height: 1.1;
  font-weight: 700;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

const StatCardBadge = styled.span`
  display: inline-block;
  align-self: flex-start;
  margin: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFF4DF' : '#332715'};
  color: ${({ theme }) => theme.colors.brandYellow};
  font-size: 10px;
  line-height: 1.3;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
`;

const DonutContainer = styled.div`
  position: relative;
  width: clamp(80px, 11vh, 105px);
  height: clamp(80px, 11vh, 105px);
  margin: 0 auto clamp(8px, 1.2vh, 14px);
  flex: none;
`;

const DonutValue = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(18px, 2.5vh, 23px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DonutCardCaption = styled.p`
  margin-bottom: 2px;
  font-size: clamp(11px, 1.5vh, 12.5px);
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
  text-align: center;
`;

const DonutCardCategory = styled.p`
  font-size: clamp(18px, 2.8vh, 24px);
  line-height: 1.2;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandYellow};
  text-align: center;
`;

const GoalCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: clamp(10px, 1.6vh, 18px);
`;

const GoalCardIcon = styled.span`
  width: clamp(34px, 4.8vh, 42px);
  height: clamp(34px, 4.8vh, 42px);
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFF4DF' : '#332715'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  svg {
    width: clamp(16px, 2.2vh, 20px);
    height: clamp(16px, 2.2vh, 20px);
    rect {
      stroke: ${({ theme }) => theme.colors.brandYellow};
    }
    circle {
      fill: ${({ theme }) => theme.colors.brandYellow};
    }
  }
`;

const GoalCardTitleWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const GoalCardTitle = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const GoalCardDday = styled.p`
  margin-top: 2px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`;

const GoalCardPercent = styled.p`
  flex: none;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandYellow};
`;

const GoalProgress = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: clamp(8px, 1.2vh, 14px);
`;

const GoalProgressSeg = styled.div`
  position: relative;
  flex: 1;
  height: clamp(6px, 1vh, 8px);
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#EEF2FA' : '#232537'};
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
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
`;

const QuickmenuTitle = styled.p`
  margin-bottom: clamp(8px, 1.2vh, 16px);
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const QuickmenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(8px, 1.2vh, 16px);
`;

const QuickmenuItem = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px) scale(1.03);
      
      div {
        background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#EBECEF' : '#2D3048'};
        box-shadow: 0 6px 16px rgba(255, 174, 0, 0.12);
        transform: translateY(-2px) scale(1.06);
      }
      
      div i {
        transform: scale(1.1) rotate(3deg);
      }

      span {
        color: ${({ theme }) => theme.colors.textPrimary};
      }
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover, &:active {
      transform: none !important;
      div {
        transform: none !important;
        box-shadow: none !important;
      }
    }
  }
`;

const QuickmenuThumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#F5F6F9' : '#232537'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 
    background-color 0.3s cubic-bezier(0.25, 1, 0.22, 1), 
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
    box-shadow 0.3s ease;

  i {
    font-size: clamp(18px, 2.4vh, 22px);
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.22, 1);
  }
`;

const QuickmenuLabel = styled.span`
  font-size: 11px;
  line-height: 1.3;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NotificationOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 16, 26, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12px 16px;
  animation: fadeIn 0.18s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const NotificationCard = styled.div`
  width: 100%;
  max-width: 440px;
  margin-top: 64px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideDown} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
`;

const NotificationTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotificationTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const NotificationBadge = styled.span`
  background: ${({ theme }) => theme.colors.brandYellow};
  color: #191B2E;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
`;

const NotificationActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NotificationHeaderBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.background};
  }
`;

const NotificationCloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const NotificationList = styled.div`
  max-height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
`;

const NotificationItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &.is-unread {
    background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFFDF5' : '#232014'};
  }

  &.is-read {
    background: ${({ theme }) => theme.colors.cardBackground};
    opacity: 0.75;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    opacity: 1;
  }
`;

const NotificationDot = styled.span<{ $isRead: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 6px;
  flex: none;
  background: ${({ $isRead, theme }) => ($isRead ? 'transparent' : theme.colors.brandYellow)};
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationItemHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
`;

const NotificationItemTitle = styled.h4`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotificationItemTime = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex: none;
`;

const NotificationItemMessage = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.45;
  margin: 0;
`;

const NotificationEmpty = styled.div`
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .empty-icon {
    font-size: 28px;
  }

  .empty-text {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;
