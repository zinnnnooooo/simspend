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
        <Wordmark>Sim<span>SPEND</span></Wordmark>
        <Tagline>당신의 소비 습관을 지키는 가장 쉬운 방법</Tagline>
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
  flex: 1;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${splashPop} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Wordmark = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin-bottom: 12px;

  span {
    color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const Tagline = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: -0.01em;
`;

const SpacerGrow = styled.div`
  flex: 1;
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

