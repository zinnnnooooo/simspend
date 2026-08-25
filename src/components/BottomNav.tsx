import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Active check helpers
  const isHome = currentPath === '/';
  const isAdd = currentPath === '/add';
  const isStatistics = currentPath === '/statistics';
  const isMore = currentPath === '/mypage' || currentPath.startsWith('/mypage') || currentPath === '/support' || currentPath === '/edit-profile';
  const isExperience = currentPath === '/experience' || currentPath.startsWith('/shopping') || currentPath.startsWith('/delivery') || currentPath === '/virtual-history' || currentPath === '/ai-report';

  return (
    <NavContainer>
      <NavItemsList>
        <NavItem to="/" className={isHome ? 'active' : ''} aria-label="홈">
          <IconWrapper>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </IconWrapper>
          <NavLabel>홈</NavLabel>
          {isHome && <ActiveDot />}
        </NavItem>

        <NavItem to="/add" className={isAdd ? 'active' : ''} aria-label="가계부">
          <IconWrapper>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </IconWrapper>
          <NavLabel>가계부</NavLabel>
          {isAdd && <ActiveDot />}
        </NavItem>

        <NavItem to="/statistics" className={isStatistics ? 'active' : ''} aria-label="통계">
          <IconWrapper>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </IconWrapper>
          <NavLabel>통계</NavLabel>
          {isStatistics && <ActiveDot />}
        </NavItem>

        <NavItem to="/experience" className={isExperience ? 'active' : ''} aria-label="체험">
          <IconWrapper>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </IconWrapper>
          <NavLabel>가상체험</NavLabel>
          {isExperience && <ActiveDot />}
        </NavItem>

        <NavItem to="/mypage" className={isMore ? 'active' : ''} aria-label="더보기">
          <IconWrapper>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </IconWrapper>
          <NavLabel>더보기</NavLabel>
          {isMore && <ActiveDot />}
        </NavItem>
      </NavItemsList>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: fixed;
  bottom: calc(16px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 440px;
  height: 68px;
  background: ${({ theme }) => 
    theme.colors.cardBackground === '#FFFFFF' 
      ? 'rgba(255, 255, 255, 0.78)' 
      : 'rgba(25, 27, 46, 0.78)'};
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid ${({ theme }) => 
    theme.colors.cardBackground === '#FFFFFF' 
      ? 'rgba(255, 255, 255, 0.4)' 
      : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 24px;
  box-shadow: ${({ theme }) => 
    theme.colors.cardBackground === '#FFFFFF' 
      ? '0 10px 30px rgba(25, 27, 46, 0.06)' 
      : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  z-index: 999;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  /* Hover micro-animation */
  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: ${({ theme }) => 
      theme.colors.cardBackground === '#FFFFFF' 
        ? '0 12px 35px rgba(25, 27, 46, 0.09)' 
        : '0 12px 35px rgba(0, 0, 0, 0.4)'};
  }
`;

const NavItemsList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavItem = styled(NavLink)`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  position: relative;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.15s ease;

  &.active {
    color: ${({ theme }) => theme.colors.brandYellow};
    
    svg {
      color: ${({ theme }) => theme.colors.brandYellow};
      stroke-width: 2.4px;
    }
    span {
      font-weight: 700;
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }

  &:active {
    transform: scale(0.93);
  }
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  svg {
    width: 21px;
    height: 21px;
    color: inherit;
    transition: stroke-width 0.2s ease, color 0.2s ease;
  }
`;

const NavLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1;
  transition: color 0.2s ease, font-weight 0.2s ease;
`;

const ActiveDot = styled.div`
  position: absolute;
  bottom: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.brandYellow};
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
