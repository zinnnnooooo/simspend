import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Experience: React.FC = () => {
  return (
    <ExperienceContainer>
      <ExperienceHeader>
        <HeaderBack to="/">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </HeaderBack>
        <HeaderLabel>S05 Virtual Experience</HeaderLabel>
      </ExperienceHeader>

      <div>
        <IntroTitle>오늘은 어떤 경험을<br />해볼까요?</IntroTitle>
        <IntroSubtitle>원하는 가상 서비스를 선택하고 실제 앱처럼<br />새로운 경험을 시작해보세요.</IntroSubtitle>
      </div>

      <ExperienceCard>
        <CardIcon>🛍️</CardIcon>
        <CardTitle>가상 쇼핑</CardTitle>
        <CardDesc>실제 쇼핑앱처럼 상품을 둘러보고 장바구니에 담아 가상 구매 과정을 체험합니다.</CardDesc>
        <CardTags>
          <CardTag>#패션</CardTag>
          <CardTag>#전자기기</CardTag>
          <CardTag>#생활용품</CardTag>
          <CardTag>#뷰티</CardTag>
          <CardTag>#취미</CardTag>
        </CardTags>
        <CardCta to="/shopping">
          가상 쇼핑 시작하기
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="20" r="1.4" fill="currentColor"/>
            <circle cx="18" cy="20" r="1.4" fill="currentColor"/>
            <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20.5 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CardCta>
      </ExperienceCard>

      <ExperienceCard>
        <CardIcon>🍗</CardIcon>
        <CardTitle>가상 배달</CardTitle>
        <CardDesc>실제 배달앱처럼 음식점을 둘러보고 메뉴를 선택한 뒤 가상 주문과 가상 배달을 체험합니다.</CardDesc>
        <CardTags>
          <CardTag>#치킨</CardTag>
          <CardTag>#피자</CardTag>
          <CardTag>#햄버거</CardTag>
          <CardTag>#카페</CardTag>
          <CardTag>#디저트</CardTag>
        </CardTags>
        <CardCta to="/delivery">
          가상 배달 시작하기
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CardCta>
      </ExperienceCard>

      <ExperienceBanner>
        <BannerIcon>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.45.9 1.15.9 1.9V16h5.2v-.2c0-.75.3-1.45.9-1.9A6 6 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </BannerIcon>
        <BannerText>실제 결제는 진행되지 않습니다. 원하는 서비스를 자유롭게 체험해보세요.</BannerText>
      </ExperienceBanner>
    </ExperienceContainer>
  );
};

const ExperienceContainer = styled.main`
  padding: 16px 16px 88px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const ExperienceHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0 4px;
`;

const HeaderBack = styled(Link)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: none;
  transition: background 0.2s, transform 0.15s ease;

  &:active {
    transform: scale(0.93);
  }

  svg {
    width: 18px;
    height: 18px;
    stroke: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const HeaderLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.01em;
`;

const IntroTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const IntroSubtitle = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.55;
  margin-top: 6px;
`;

const ExperienceCard = styled.section`
  width: 100%;
  padding: 22px 18px 18px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFF4DF' : '#332715'};
  color: ${({ theme }) => theme.colors.brandYellow};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 14px;
`;

const CardTitle = styled.p`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
`;

const CardDesc = styled.p`
  font-size: 13px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 14px;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
`;

const CardTag = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.background};
  padding: 5px 10px;
  border-radius: 999px;
`;

const CardCta = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.textPrimary};
  color: ${({ theme }) => theme.colors.cardBackground};
  font-size: 14px;
  font-weight: 700;
  padding: 13px 0;
  border-radius: 12px;
  transition: opacity 0.2s, transform 0.15s ease;
  text-decoration: none;

  &:active {
    transform: scale(0.98);
    opacity: 0.95;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ExperienceBanner = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px 18px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const BannerIcon = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFF4DF' : '#332715'};
  color: ${({ theme }) => theme.colors.brandYellow};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  margin-top: 1px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const BannerText = styled.p`
  font-size: 12.5px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
