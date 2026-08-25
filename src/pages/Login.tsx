import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, setGuestMode } = useAuth();
  const { showSnackbar } = useUI();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      showSnackbar('Google 로그인이 완료되었습니다.');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Google 로그인 실패:', error);
    }
  };

  const handleGuestLogin = () => {
    setGuestMode(true);
    navigate('/', { replace: true });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <LogoIcon>🪙</LogoIcon>
          <LogoText>SimSpend</LogoText>
          <Subtitle>가상 소비로 참아내는 똑똑한 가계부</Subtitle>
        </LogoSection>

        <ButtonGroup>
          <GoogleButton onClick={handleGoogleLogin}>
            <GoogleIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </GoogleIcon>
            Google로 로그인
          </GoogleButton>

          <GuestButton onClick={handleGuestLogin}>
            로그인 없이 사용하기
          </GuestButton>
        </ButtonGroup>
      </LoginCard>
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.main`
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 360px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 24px;
  padding: clamp(32px, 5vh, 48px) 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: clamp(40px, 6vh, 60px);
  text-align: center;
`;

const LogoIcon = styled.span`
  font-size: 52px;
  margin-bottom: 12px;
  display: inline-block;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GoogleButton = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 14px;
  border: none;
  background-color: ${({ theme }) => theme.colors.brandYellow};
  color: #191B2E;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.2s;
  box-shadow: 0 4px 12px rgba(255, 174, 0, 0.15);

  &:hover {
    background-color: #e59d00;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const GoogleIcon = styled.svg`
  width: 18px;
  height: 18px;
  flex: none;
`;

const GuestButton = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#F9FAFB' : '#232537'};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:active {
    transform: scale(0.98);
  }
`;
