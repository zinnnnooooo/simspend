import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const BottomNav: React.FC = () => {
  return (
    <NavContainer>
      <NavImage src="/assets/nav_bar.svg" alt="하단 네비게이션 바" />
      <ClickOverlay>
        <LeftButtons>
          <ClickArea to="/" end aria-label="홈" />
          <ClickArea to="/add" aria-label="가계부" />
          <ClickArea to="/statistics" aria-label="통계" />
          <ClickArea to="/pay" aria-label="가상쇼핑" />
        </LeftButtons>
        <RightButton to="/mypage" aria-label="마이페이지" />
      </ClickOverlay>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: fixed;
  bottom: calc(16px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 330px;
  aspect-ratio: 350 / 58;
  background-color: transparent;
  z-index: 99;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const NavImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  flex-shrink: 0;
`;

const ClickOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 100;
`;

const LeftButtons = styled.div`
  width: 81.14%; /* 284 / 350 */
  height: 100%;
  display: flex;
`;

const RightButton = styled(NavLink)`
  width: 18.86%; /* 66 / 350 */
  height: 100%;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  outline: none;
`;

const ClickArea = styled(NavLink)`
  flex: 1;
  height: 100%;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  outline: none;
`;
