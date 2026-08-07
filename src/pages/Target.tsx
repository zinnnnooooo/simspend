import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { SavingsGoal } from '@/@types';

const ICONS: Record<string, React.ReactNode> = {
  travel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 15.5 3 13l1.6-1.6 4.7 1 3.3-3.3-7-4L7 3.5l9 3 3-3a2 2 0 0 1 2.8 2.8l-3 3 3 9-1.6 1.6-4-7-3.3 3.3 1 4.7L13.5 21l-2.5-7.5Z" />
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="10.5" rx="1.4" />
      <path d="M2.5 19h19" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
};

export const Target: React.FC = () => {
  const navigate = useNavigate();
  const { savingsGoals, getTotalSaved } = useLedger();

  const totalSaved = getTotalSaved();
  const fmtWon = (n: number) => n.toLocaleString('ko-KR') + '원';

  const renderActionArea = (goal: SavingsGoal) => {
    if (goal.actionType === 'edit-fill') {
      return (
        <GoalItemActions>
          <button type="button" className="goal-item__btn goal-item__btn--ghost">금액 수정</button>
          <button type="button" className="goal-item__btn goal-item__btn--solid">채우기</button>
        </GoalItemActions>
      );
    }
    if (goal.actionType === 'tip') {
      return (
        <GoalItemTip>
          <span className="goal-item__tip-icon" aria-hidden="true">i</span>
          <p className="goal-item__tip-text">{goal.tip}</p>
        </GoalItemTip>
      );
    }
    if (goal.actionType === 'celebrate') {
      const remaining = goal.target - goal.saved;
      return (
        <GoalItemCelebrate>
          🎉 거의 다 왔어요! {remaining.toLocaleString('ko-KR')}원 남음
        </GoalItemCelebrate>
      );
    }
    return null;
  };

  return (
    <TargetContainer>
      {/* 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/')} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>저축 목표 관리</HeaderTitle>
      </PageHeader>

      {/* 총 모은 금액 */}
      <TotalSavedCard>
        <p className="total-saved-card__label">총 모은 금액</p>
        <p className="total-saved-card__value">₩{totalSaved.toLocaleString('ko-KR')}</p>
      </TotalSavedCard>

      {/* 목표 카드 리스트 */}
      <GoalList>
        {savingsGoals.map((goal) => {
          const percent = Math.round((goal.saved / goal.target) * 100);
          const meta = goal.daysLeft !== null
            ? `D-${goal.daysLeft} · ${goal.targetDate} 목표`
            : goal.statusLabel;

          return (
            <Card key={goal.id} className="goal-item">
              <GoalItemTop>
                <span className="goal-item__icon">{ICONS[goal.icon] || ICONS.travel}</span>
                <GoalItemTitleWrap>
                  <p className="goal-item__title">{goal.title}</p>
                  <p className="goal-item__meta">{meta}</p>
                </GoalItemTitleWrap>
                <span className="goal-item__percent">{percent}%</span>
              </GoalItemTop>
              
              <GoalItemAmountRow>
                <span>{fmtWon(goal.saved)}</span>
                <span>목표 {fmtWon(goal.target)}</span>
              </GoalItemAmountRow>
              
              <GoalItemBar>
                <GoalItemBarFill style={{ width: `${percent}%` }} />
              </GoalItemBar>

              {renderActionArea(goal)}
            </Card>
          );
        })}
      </GoalList>

      {/* 새 목표 추가 */}
      <AddGoalCard href="#" onClick={(e) => e.preventDefault()}>
        <span className="add-goal-card__icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        <p className="add-goal-card__title">Base에 새로운 목표 추가</p>
        <p className="add-goal-card__subtitle">꿈꾸던 것을 현실로 만드는 가장 빠른 방법</p>
      </AddGoalCard>

      {/* 새 목표 추가 FAB */}
      <FabWrap>
        <FabBtn href="#" onClick={(e) => e.preventDefault()} aria-label="새 목표 추가">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </FabBtn>
      </FabWrap>
    </TargetContainer>
  );
};

// Styled Components
const TargetContainer = styled.main`
  padding: 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
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

const TotalSavedCard = styled.section`
  background: #2b2d42;
  border-radius: 20px;
  padding: 20px 20px 24px;

  .total-saved-card__label {
    font-size: 13px;
    color: #b7b9cc;
    margin-bottom: 8px;
  }

  .total-saved-card__value {
    font-size: 30px;
    font-weight: 800;
    color: #ffffff;
  }
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};

  &.goal-item {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
`;

const GoalItemTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const GoalItemIcon = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #eeeff3;
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

const GoalItemTitleWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const GoalItemTitle = styled.p`
  font-size: 15.5px;
  font-weight: 800;
  color: #2b2d42;
  margin-bottom: 2px;
`;

const GoalItemMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GoalItemPercent = styled.span`
  font-size: 19px;
  font-weight: 800;
  color: #2b2d42;
  flex: none;
`;

const GoalItemAmountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  font-weight: 700;
  color: #2b2d42;
  margin-bottom: 8px;

  span:last-child {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
  }
`;

const GoalItemBar = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-bottom: 16px;
`;

const GoalItemBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: #2b2d42;
`;

const GoalItemActions = styled.div`
  display: flex;
  gap: 12px;

  .goal-item__btn {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    border-radius: 14px;
    font-size: 13.5px;
    font-weight: 700;
  }

  .goal-item__btn--ghost {
    background: ${({ theme }) => theme.colors.background};
    color: #2b2d42;
  }

  .goal-item__btn--solid {
    background: #2b2d42;
    color: #ffffff;
  }
`;

const GoalItemTip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fff3d9;
  border-radius: 14px;
  padding: 16px;
`;

const GoalItemTipIcon = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandYellow};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  font-size: 11px;
  font-weight: 800;
  margin-top: 1px;
`;

const GoalItemTipText = styled.p`
  font-size: 12.5px;
  line-height: 1.5;
  color: #2b2d42;
`;

const GoalItemCelebrate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2b2d42;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  padding: 16px 0;
  border-radius: 14px;
`;

const AddGoalCard = styled.a`
  border: 1.5px dashed #c9cbd6;
  border-radius: 20px;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;

  .add-goal-card__icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textSecondary};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-goal-card__title {
    font-size: 14.5px;
    font-weight: 800;
    color: #2b2d42;
  }

  .add-goal-card__subtitle {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FabWrap = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100px;
  width: 100%;
  max-width: 480px;
  height: 0;
  z-index: 15;
  pointer-events: none;
`;

const FabBtn = styled.a`
  position: absolute;
  right: 14px;
  bottom: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #2b2d42;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(43, 45, 66, 0.35);
  pointer-events: auto;
`;
