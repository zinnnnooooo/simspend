import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 1.8초 로딩 대기 후 페이드아웃 시작
    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 1800);

    // 페이드아웃 완료(0.4초) 후 대시보드 리다이렉트
    const redirectTimer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2200);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <SplashContainer className={isLeaving ? 'is-leaving' : ''}>
      <SpacerTop />
      
      <Brand>
        <Logo viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SimSPEND 로고">
          {/* 가방 손잡이 */}
          <path d="M45 37 Q45 15 60 15 Q75 15 75 37" fill="none" stroke="#1E1F2E" strokeWidth="6.5" strokeLinecap="round"/>
          {/* 가방 몸체 */}
          <rect x="21" y="34" width="78" height="62" rx="20" fill="#FFFFFF" stroke="#1E1F2E" strokeWidth="6.5"/>
          {/* 하트 */}
          <path d="M60 74 C 52 67, 40 60, 40 49 C 40 42, 45 37, 52 37 C 56 37, 59 39, 60 43 C 61 39, 64 37, 68 37 C 75 37, 80 42, 80 49 C 80 60, 68 67, 60 74 Z" fill="#FFAE00"/>
          {/* 계산기 */}
          <g transform="translate(70,58)">
            <rect x="0" y="0" width="34" height="44" rx="8" fill="#FFFFFF" stroke="#1E1F2E" strokeWidth="5.5"/>
            <rect x="5.5" y="6.5" width="23" height="9" rx="3" fill="#FFAE00"/>
            <rect x="6" y="21" width="6" height="6" rx="1.6" fill="#1E1F2E"/>
            <rect x="14" y="21" width="6" height="6" rx="1.6" fill="#1E1F2E"/>
            <rect x="22" y="21" width="6" height="6" rx="1.6" fill="#1E1F2E"/>
            <rect x="6" y="30" width="6" height="6" rx="1.6" fill="#1E1F2E"/>
            <rect x="14" y="30" width="6" height="6" rx="1.6" fill="#1E1F2E"/>
            <rect x="22" y="30" width="6" height="6" rx="1.6" fill="#1E1F2E"/>
          </g>
        </Logo>
        
        <Tagline>당신의 소비 습관을 지키는 가장 쉬운 방법</Tagline>
        <Wordmark>SimSPEND</Wordmark>
      </Brand>

      <SpacerGrow />

      <Footer>
        <ProgressTrack role="progressbar" aria-label="로딩 중">
          <ProgressFill />
        </ProgressTrack>
        <Secure>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Securely managed by SimSpend Finance
        </Secure>
      </Footer>
    </SplashContainer>
  );
};

// Keyframes
const splashPop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(6px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const splashLoading = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(140%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

// Styled Components
const SplashContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.cardBackground};
  padding: 0 24px;
  opacity: 1;
  transition: opacity 0.4s ease;

  &.is-leaving {
    opacity: 0;
  }
`;

const SpacerTop = styled.div`
  flex: 0 0 auto;
  height: 34vh;
  min-height: 140px;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Logo = styled.svg`
  width: 108px;
  height: 108px;
  margin-bottom: 20px;
  animation: ${splashPop} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Tagline = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: -0.01em;
  margin-bottom: 8px;
`;

const Wordmark = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
`;

const SpacerGrow = styled.div`
  flex: 1 1 auto;
`;

const Footer = styled.div`
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
`;

const ProgressTrack = styled.div`
  width: 96px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: 40%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.textPrimary};
  animation: ${splashLoading} 1.4s ease-in-out infinite;
`;

const Secure = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 12px;
    height: 12px;
    flex: none;
  }
`;
