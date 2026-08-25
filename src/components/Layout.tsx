import React, { useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { BottomNav } from '@/components/BottomNav';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStart = useRef({ x: 0, y: 0 });

  // 주요 탭 페이지의 스와이프 순서 정의
  const PAGE_ORDER = ['/', '/add', '/statistics', '/pay', '/mypage'];

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    const minDistance = 65; // 오동작 방지를 위한 최소 가로 드래그 기준값

    // 수평 드래그 거리가 수직 스크롤 거리보다 크고 임계값을 넘겼을 때만 스와이프 판정
    if (Math.abs(deltaX) > minDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      const currentIndex = PAGE_ORDER.indexOf(location.pathname);
      if (currentIndex !== -1) {
        if (deltaX > 0) {
          // 오른쪽 스와이프 -> 이전 페이지로 이동
          if (currentIndex > 0) {
            navigate(PAGE_ORDER[currentIndex - 1]);
          }
        } else {
          // 왼쪽 스와이프 -> 다음 페이지로 이동
          if (currentIndex < PAGE_ORDER.length - 1) {
            navigate(PAGE_ORDER[currentIndex + 1]);
          }
        }
      }
    }
  };

  const isDelivery = 
    location.pathname === '/delivery' || 
    location.pathname.startsWith('/delivery/') || 
    location.pathname === '/delivery-status';

  const isShopping = 
    location.pathname === '/shopping' || 
    location.pathname.startsWith('/shopping/');

  const isVirtualHistory = location.pathname === '/virtual-history';
  const isAiReport = location.pathname === '/ai-report';
  const isSupport = location.pathname === '/support';
  const isNotificationSettings = location.pathname === '/notification-settings';
  const isFaq = location.pathname === '/faq';
  const isEditProfile = location.pathname === '/edit-profile';

  const hideBottomNav = isDelivery || isShopping || isVirtualHistory || isAiReport || isSupport || isNotificationSettings || isFaq || isEditProfile;

  const isLedger = location.pathname === '/add';

  return (
    <AppContainer>
      <ContentArea 
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
        $hideBottomNav={hideBottomNav}
      >
        {/* key가 변경될 때마다 리렌더링 및 전환 애니메이션을 발동시킵니다 */}
        <PageWrapper key={location.pathname} $noAnim={isLedger}>
          {children || <Outlet />}
        </PageWrapper>
        {!hideBottomNav && <BottomNav />}
      </ContentArea>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#E9EBF1' : '#08090E'};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: background-color 0.3s ease;
`;

const ContentArea = styled.div<{ $hideBottomNav?: boolean }>`
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '0 0 40px rgba(25, 27, 46, 0.08)' : '0 0 40px rgba(0, 0, 0, 0.6)'};
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: ${({ $hideBottomNav }) => 
    $hideBottomNav ? '16px' : 'calc(76px + env(safe-area-inset-bottom) + 16px)'};
  overflow-x: hidden;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const slideFadeIn = keyframes`
  from {
    opacity: 0.88;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div<{ $noAnim?: boolean }>`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: ${({ $noAnim }) => ($noAnim ? 'none' : slideFadeIn)} 0.22s cubic-bezier(0.16, 1, 0.3, 1);
`;

export default Layout;
