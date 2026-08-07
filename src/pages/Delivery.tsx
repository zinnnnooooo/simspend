import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';

const ICONS: Record<string, React.ReactNode> = {
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.2 12 4l8.5 4.2v7.6L12 20l-8.5-4.2Z"/>
      <path d="M3.5 8.2 12 12l8.5-3.8"/>
      <path d="M12 12v8"/>
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="7" width="11.5" height="9" rx="1.2"/>
      <path d="M14 10h4l3 3v3h-7z"/>
      <circle cx="7" cy="18" r="1.6"/>
      <circle cx="17.5" cy="18" r="1.6"/>
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/>
      <circle cx="12" cy="9.5" r="2.2"/>
    </svg>
  )
};

export const Delivery: React.FC = () => {
  const { getWeeklySummary } = useLedger();
  const weekly = getWeeklySummary();

  const fmtWon = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

  const steps = [
    { key: 'prepare', label: '준비 중', icon: 'box', state: 'done' },
    { key: 'shipping', label: '배송 중', icon: 'truck', state: 'active' },
    { key: 'arrived', label: '도착 완료', icon: 'pin', state: 'pending' }
  ];

  return (
    <DeliveryContainer>
      <DeliveryTitle>축하합니다!</DeliveryTitle>
      <DeliverySubtitle>심스펜드에 성공하셨습니다. 🎉</DeliverySubtitle>

      <Card className="delivery__card">
        <AmountBox>
          <p className="delivery__amount-label">오늘 심스펜드에서 구매한 총 금액</p>
          <p className="delivery__amount-value">{fmtWon(weekly.total)}</p>
        </AmountBox>

        <div>
          <ProcessLabel>배송 프로세스</ProcessLabel>
          <StepperContainer>
            {steps.map((step, idx) => {
              const isActive = step.state === 'active';
              const isDone = step.state === 'done';
              const stateClass = isActive ? 'is-active' : isDone ? 'is-done' : '';
              
              return (
                <React.Fragment key={step.key}>
                  <StepWrapper className={stateClass}>
                    <span className="delivery__step-icon">{ICONS[step.icon]}</span>
                    <span className="delivery__step-label">{step.label}</span>
                  </StepWrapper>
                  
                  {idx < steps.length - 1 && (
                    <Connector className={isDone ? 'is-filled' : ''} />
                  )}
                </React.Fragment>
              );
            })}
          </StepperContainer>
        </div>

        <Banner>
          <span className="delivery__banner-icon" aria-hidden="true">i</span>
          <p className="delivery__banner-text">
            절약된 금액이 가상 자산 금고로 안전하게 이동되었습니다. 내일도 습관을 이어가 보세요!
          </p>
        </Banner>
      </Card>

      <CtaLink to="/">
        대시보드로 돌아가기
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </CtaLink>
    </DeliveryContainer>
  );
};

// Styled Components
const DeliveryContainer = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 64px 24px 32px;
`;

const DeliveryTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #2b2d42;
  text-align: center;
  margin-bottom: 8px;
`;

const DeliverySubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 24px;
`;

const Card = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
`;

const AmountBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  padding: 20px;
  text-align: center;

  .delivery__amount-label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 6px;
  }

  .delivery__amount-value {
    font-size: 26px;
    font-weight: 800;
    color: #2b2d42;
  }
`;

const ProcessLabel = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: #2b2d42;
  text-align: center;
  margin-bottom: 12px;
`;

const StepperContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const StepWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .delivery__step-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textSecondary};
    flex: none;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .delivery__step-label {
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &.is-active,
  &.is-done {
    .delivery__step-icon {
      color: #ffffff;
      background: ${({ theme }) => theme.colors.brandYellow};
    }

    .delivery__step-label {
      color: #2b2d42;
      font-weight: 800;
    }
  }
`;

const Connector = styled.span`
  flex: none;
  width: 46px;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};
  margin-top: 22px;

  &.is-filled {
    background: #2b2d42;
  }
`;

const Banner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fff3d9;
  border-radius: 14px;
  padding: 16px;

  .delivery__banner-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.brandYellow};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    font-size: 12px;
    font-weight: 800;
    margin-top: 1px;
  }

  .delivery__banner-text {
    font-size: 13px;
    line-height: 1.5;
    color: #2b2d42;
  }
`;

const CtaLink = styled(Link)`
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2b2d42;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  padding: 16px 0;
  border-radius: 999px;

  svg {
    width: 18px;
    height: 18px;
  }
`;
