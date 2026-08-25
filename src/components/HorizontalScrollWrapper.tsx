import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactElement;
  scrollAmount?: number;
}

export const HorizontalScrollWrapper: React.FC<Props> = ({ children, scrollAmount }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    
    // 왼쪽 화살표: scrollLeft가 4보다 클 때 표시
    setShowLeft(el.scrollLeft > 4);
    
    // 오른쪽 화살표: scrollLeft + clientWidth가 scrollWidth - 6보다 작을 때 표시
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 초기 마운트 시 체크
    checkScroll();

    const handleScroll = () => {
      checkScroll();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // 내부 아이템 렌더링 지연 대응을 위해 MutationObserver 등록
    const observer = new MutationObserver(handleScroll);
    observer.observe(el, { childList: true, subtree: true });

    // CSS transition 등으로 인해 가로 너비가 나중에 잡힐 때를 대비해 타임아웃 체크 추가
    const timer = setTimeout(checkScroll, 300);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [children]);

  const handleScrollClick = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;

    let amount = scrollAmount;
    if (!amount) {
      const firstChild = el.firstElementChild as HTMLElement;
      if (firstChild) {
        amount = firstChild.offsetWidth + 12; // 카드 너비 + 간격(12px)
      } else {
        amount = el.clientWidth * 0.75;
      }
    }

    const targetScroll = el.scrollLeft + (direction === 'left' ? -amount : amount);
    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const clonedChild = React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      containerRef.current = node;
      const { ref } = children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  });

  return (
    <WrapperContainer>
      {clonedChild}
      
      {showLeft && (
        <ArrowButton 
          className="left" 
          onClick={() => handleScrollClick('left')} 
          aria-label="이전 항목 보기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </ArrowButton>
      )}

      {showRight && (
        <ArrowButton 
          className="right" 
          onClick={() => handleScrollClick('right')} 
          aria-label="다음 항목 보기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </ArrowButton>
      )}
    </WrapperContainer>
  );
};

const WrapperContainer = styled.div`
  position: relative;
  width: 100%;

  /* 자식 가로 스크롤바 완전 숨김 */
  & > * {
    scrollbar-width: none !important;
    &::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 31, 46, 0.95)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  z-index: 10;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.25, 0.8, 0.25, 1);

  &.left {
    left: -8px; /* 가장자리에 세련되게 배치 */
  }
  &.right {
    right: -8px;
  }

  &:hover {
    color: #FFAE00;
    border-color: #FFAE00;
    transform: translateY(-50%) scale(1.15);
    box-shadow: 0 0 12px rgba(255, 174, 0, 0.35);
  }

  &:active {
    transform: translateY(-50%) scale(0.93);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
