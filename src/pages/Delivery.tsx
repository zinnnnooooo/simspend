import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { useGraphAnimation } from '@/hooks/useGraphAnimation';

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
  const location = useLocation();

  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHero(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const fmtWon = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

  const steps = [
    { key: 'prepare', label: '준비 중', icon: 'box', state: 'done' },
    { key: 'shipping', label: '배송 중', icon: 'truck', state: 'active' },
    { key: 'arrived', label: '도착 완료', icon: 'pin', state: 'pending' }
  ];

  const targetPrice = (location.state as { price?: number })?.price || weekly.total;

  return (
    <DeliveryContainer>
      {showHero ? (
        <HeroMotion />
      ) : (
        <DeliveryResult 
          targetPrice={targetPrice} 
          steps={steps} 
          fmtWon={fmtWon} 
        />
      )}
    </DeliveryContainer>
  );
};

// --- Hero Motion Component ---
const HeroMotion: React.FC = () => {
  return (
    <HeroContainer>
      <RippleCircle $delay={0} />
      <RippleCircle $delay={0.4} />
      <RippleCircle $delay={0.8} />
      <HeroCenter>
        <div className="glow-icon">🪙</div>
        <p className="simulating-text">SIMULATING...</p>
        <p className="desc-text">진짜 지출은 ₩0, 가상 지출로 지출 방어 중!</p>
      </HeroCenter>
    </HeroContainer>
  );
};

// --- Delivery Result Component ---
interface DeliveryResultProps {
  targetPrice: number;
  steps: any[];
  fmtWon: (n: number) => string;
}

const DeliveryResult: React.FC<DeliveryResultProps> = ({ targetPrice, steps, fmtWon }) => {
  const progress = useGraphAnimation(1000);
  const displayPrice = targetPrice * progress;

  return (
    <ResultWrapper>
      <DeliveryTitle>축하합니다!</DeliveryTitle>
      <DeliverySubtitle>심스펜드에 성공하셨습니다. 🎉</DeliverySubtitle>

      <Card className="delivery__card">
        <ComparisonContainer>
          <ComparisonRow>
            <ComparisonLabel>REAL SPEND</ComparisonLabel>
            <ComparisonValueReal>₩0</ComparisonValueReal>
          </ComparisonRow>
          <ComparisonDivider />
          <ComparisonRow>
            <ComparisonLabel>SIMULATED</ComparisonLabel>
            <ComparisonValueSimulated>
              {fmtWon(displayPrice)}
            </ComparisonValueSimulated>
          </ComparisonRow>
        </ComparisonContainer>

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
    </ResultWrapper>
  );
};

// --- Styled Components ---
const DeliveryContainer = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 48px 24px 32px;
  box-sizing: border-box;
`;

const HeroContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 60vh;
  overflow: hidden;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  15% {
    opacity: 0.8;
  }
  100% {
    transform: scale(2.0);
    opacity: 0;
  }
`;

const RippleCircle = styled.div<{ $delay: number }>`
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.brandYellow};
  background: rgba(255, 170, 0, 0.03);
  box-shadow: 0 0 24px rgba(255, 170, 0, 0.1) inset, 0 0 24px rgba(255, 170, 0, 0.1);
  animation: ${ripple} 1.6s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  pointer-events: none;
`;

const HeroCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  text-align: center;

  .glow-icon {
    font-size: 64px;
    margin-bottom: 20px;
    filter: drop-shadow(0 0 20px rgba(255, 170, 0, 0.5));
    animation: pulse 1.5s ease-in-out infinite;

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
  }

  .simulating-text {
    font-size: 18px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.brandYellow};
    letter-spacing: 2px;
    margin-bottom: 8px;
    text-shadow: 0 0 10px rgba(255, 170, 0, 0.4);
  }

  .desc-text {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 500;
  }
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  animation: ${fadeInScale} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#F8F9FA' : '#1F2236'};
  border-radius: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ComparisonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ComparisonLabel = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 1px;
`;

const ComparisonValueReal = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
  opacity: 0.6;
`;

const ComparisonValueSimulated = styled.span`
  font-size: 24px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.brandYellow};
  text-shadow: 0 0 12px rgba(255, 170, 0, 0.15);
`;

const ComparisonDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  width: 100%;
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
  padding: 0 8px;
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
  text-decoration: none;
  transition: background-color 0.2s, transform 0.15s;

  &:hover {
    background: #1a1b2a;
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;
