import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { BottomNav } from '@/components/BottomNav';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppContainer>
      <ContentArea>
        {/* children이 제공되면 children을 렌더링하고, 없으면 라우터 Outlet을 렌더링 */}
        {children || <Outlet />}
        <BottomNav />
      </ContentArea>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ContentArea = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(64px + env(safe-area-inset-bottom) + 16px);
  overflow-x: hidden;
`;
export default Layout;
