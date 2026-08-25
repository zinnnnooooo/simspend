import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HorizontalScrollWrapper } from '@/components/HorizontalScrollWrapper';
import { mockStores } from '@/data/mockStores';

// 2번 시안 맞춤 정밀 벡터 라인 아이콘 딕셔너리
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  한식: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  분식: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2Z"/>
      <path d="M12 6v12M6 12h12"/>
    </svg>
  ),
  버거: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11h18M3 15h18M5 11c0-3.3 2.7-6 6-6s6 2.7 6 6M4 18h16a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z"/>
    </svg>
  ),
  치킨: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11h-5.5a3.5 3.5 0 0 0-3.5 3.5v5a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-8.5Z"/>
      <path d="M8.5 14.5A5.5 5.5 0 0 1 3 9V5a2 2 0 0 1 2-2h3.5A5.5 5.5 0 0 1 14 8.5v3"/>
    </svg>
  ),
  피자: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3 3 15v6h6L21 9ZM6 18h.01M9 15h.01M12 12h.01"/>
    </svg>
  ),
  일식: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M4.5 12a7.5 7.5 0 0 0 15 0"/>
      <path d="M9 3v9M15 3v9"/>
    </svg>
  ),
  카페: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/>
      <path d="M6 2v2M10 2v2M14 2v2"/>
    </svg>
  ),
  전체보기: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="5" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
    </svg>
  )
};

const CATEGORIES = [
  { name: '한식', key: '한식' },
  { name: '분식', key: '분식' },
  { name: '버거', key: '버거' },
  { name: '치킨', key: '치킨' },
  { name: '피자', key: '피자' },
  { name: '일식', key: '일식' },
  { name: '카페', key: '카페' },
  { name: '전체보기', key: '전체보기' }
];

export const DeliveryHome: React.FC = () => {
  const navigate = useNavigate();
  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  const [randomStores, setRandomStores] = useState<typeof mockStores>([]);
  const [randomMenus, setRandomMenus] = useState<any[]>([]);

  // Fisher-Yates 셔플 헬퍼 함수
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    // 1. 가상 맛집 랜덤 셔플
    const shuffledStores = shuffleArray(mockStores);
    setRandomStores(shuffledStores.slice(0, 8));

    // 2. 추천 메뉴 랜덤 셔플
    const allMenus = mockStores.flatMap(store => 
      (store.menus || []).map(menu => ({
        storeId: store.id,
        storeName: store.name,
        storeImage: store.image,
        storeEmoji: store.emoji,
        name: menu.name,
        price: menu.price,
        desc: menu.desc
      }))
    );
    const shuffledMenus = shuffleArray(allMenus);
    setRandomMenus(shuffledMenus.slice(0, 8));
  }, []);

  return (
    <DhContainer>
      {/* 탑바 */}
      <DhTopbar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BackButton onClick={() => navigate('/')} aria-label="뒤로가기">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <TopbarLocation>
            서울시 강남구 역삼동
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TopbarLocation>
        </div>
        <TopbarActions>
          {/* 알림 아이콘 */}
          <span className="icon-btn" style={{ position: 'relative' }}>
            <span className="icon-btn__dot" />
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
          {/* 쇼핑백 장바구니 아이콘 추가 */}
          <span className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </span>
        </TopbarActions>
      </DhTopbar>

      {/* 검색창 */}
      <DhSearch>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/>
          <path d="m20 20-3.8-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input type="text" placeholder="먹고 싶은 음식을 검색해보세요" readOnly />
      </DhSearch>

      {/* 챌린지 카드 배너 */}
      <DhBanner>
        <BannerTitle>
          배달 참기 챌린지!<br />오늘 아낀 돈을 저축해보세요
        </BannerTitle>
        <BannerSubtitle>가상 주문 한 번으로 불필요한 소비를 막아보세요!</BannerSubtitle>
      </DhBanner>

      {/* 사각형 카드 디자인의 카테고리 그리드 (2행 4열) */}
      <DhCategories>
        {CATEGORIES.map((cat) => {
          const path = cat.key === '전체보기' ? '/delivery/category?c=치킨' : `/delivery/category?c=${cat.name}`;
          return (
            <DhCategory key={cat.key} to={path}>
              <CategoryIconCard>
                {CATEGORY_ICONS[cat.key]}
              </CategoryIconCard>
              <CategoryLabel>{cat.name}</CategoryLabel>
            </DhCategory>
          );
        })}
      </DhCategories>

      {/* 배달비 절약 알림 카드 */}
      <DhSavingCard to="/add">
        <SavingCardIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </SavingCardIcon>
        <SavingCardText>
          <SavingCardTitle>현재 배달비 <span>3,500</span>원 절약 중</SavingCardTitle>
          <SavingCardSubtitle>자산을 완벽하게 방어하고 있어요</SavingCardSubtitle>
        </SavingCardText>
        <svg className="arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, color: '#8B8D9B', marginLeft: 'auto' }}>
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </DhSavingCard>

      {/* 인기 가상 맛집 가로 스크롤 섹션 */}
      <section>
        <SectionHeader>
          <SectionTitle>인기 가상 맛집</SectionTitle>
          <SectionMore to="/delivery/category?c=치킨">전체보기</SectionMore>
        </SectionHeader>
        
        <HorizontalScrollWrapper>
          <StoreScroll>
            {randomStores.map((store) => (
              <StoreCard key={store.id} to={`/delivery/store/${store.id}`}>
                <StoreCardThumb>
                  {store.badge && <StoreCardBadge>{store.badge}</StoreCardBadge>}
                  {store.image ? (
                    <img src={store.image} alt={store.name} className="store-img" />
                  ) : (
                    <span className="store-emoji">{store.emoji}</span>
                  )}
                  <StoreCardRating>
                    ★ {store.rating}
                  </StoreCardRating>
                </StoreCardThumb>
                <StoreCardName>{store.name}</StoreCardName>
                <StoreCardEta>가상 배달 {store.etaLabel}</StoreCardEta>
                <StoreCardPriceRow>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <StoreCardPrice>{fmtWon(store.price)}</StoreCardPrice>
                  </div>
                  {/* 지출 절약 지갑 챌린지 버튼 */}
                  <SavingTriggerBtn type="button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 7h-8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
                      <path d="M5 11H3a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2"/>
                    </svg>
                  </SavingTriggerBtn>
                </StoreCardPriceRow>
              </StoreCard>
            ))}
          </StoreScroll>
        </HorizontalScrollWrapper>
      </section>

      {/* 오늘의 추천 메뉴 섹션 */}
      <section style={{ marginTop: 8 }}>
        <SectionHeader>
          <SectionTitle>오늘의 추천 메뉴</SectionTitle>
        </SectionHeader>
        
        <HorizontalScrollWrapper>
          <StoreScroll>
            {randomMenus.map((menu, idx) => (
              <RecommendMenuCard key={idx} to={`/delivery/store/${menu.storeId}`}>
                <MenuCardThumb>
                  {menu.storeImage ? (
                    <img src={menu.storeImage} alt={menu.name} className="menu-img" />
                  ) : (
                    <span className="menu-emoji">{menu.storeEmoji}</span>
                  )}
                  <MenuCardRating>
                    ⭐ 추천
                  </MenuCardRating>
                </MenuCardThumb>
                <MenuCardName>{menu.name}</MenuCardName>
                <MenuCardStoreSub>{menu.storeName}</MenuCardStoreSub>
                <MenuCardPrice>{fmtWon(menu.price)}</MenuCardPrice>
              </RecommendMenuCard>
            ))}
          </StoreScroll>
        </HorizontalScrollWrapper>
      </section>
    </DhContainer>
  );
};

// Styled Components
const DhContainer = styled.main`
  padding: 16px 16px 88px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  transition: background-color 0.3s ease;
`;

const DhTopbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
`;

const TopbarLocation = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  svg {
    width: 16px;
    height: 16px;
    color: inherit;
  }

  &:active {
    opacity: 0.7;
  }
`;

const TopbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.cardBackground};
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    position: relative;
    transition: background 0.2s, transform 0.15s ease;

    &:active {
      transform: scale(0.93);
    }
  }

  .icon-btn__dot {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.brandNegative};
    border: 1px solid ${({ theme }) => theme.colors.cardBackground};
  }

  svg {
    display: block;
    width: 18px;
    height: 18px;
  }
`;

const DhSearch = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1.5px solid ${({ theme }) => theme.colors.border};

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.textSecondary};
    flex: none;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: transparent;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
`;

const DhBanner = styled.section`
  background: ${({ theme }) => 
    theme.colors.cardBackground === '#FFFFFF' 
      ? 'linear-gradient(135deg, #191B2E 0%, #20243E 100%)' 
      : 'linear-gradient(135deg, #131422 0%, #191B2E 100%)'};
  border-radius: 24px;
  padding: 22px 20px;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 12px 30px rgba(25, 27, 46, 0.12);
`;

const BannerTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.4;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
`;

const BannerSubtitle = styled.p`
  font-size: 11.5px;
  color: #E2E8F0;
  font-weight: 500;
`;

const DhCategories = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 20px;
  column-gap: 12px;
  margin-top: 4px;
`;

const DhCategory = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.95);
  }
`;

const CategoryIconCard = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.2s ease;

  svg {
    width: 22px;
    height: 22px;
  }

  ${DhCategory}:hover & {
    border-color: ${({ theme }) => theme.colors.brandYellow};
    color: ${({ theme }) => theme.colors.brandYellow};
    transform: translateY(-2px);
  }
`;

const CategoryLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DhSavingCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SavingCardIcon = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFF4DF' : '#332715'};
  color: ${({ theme }) => theme.colors.brandYellow};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  svg {
    width: 18px;
    height: 18px;
    stroke: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const SavingCardText = styled.span`
  flex: 1;
`;

const SavingCardTitle = styled.p`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};

  span {
    color: ${({ theme }) => theme.colors.brandNegative};
  }
`;

const SavingCardSubtitle = styled.p`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
  font-weight: 500;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

const SectionTitle = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionMore = styled(Link)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const StoreScroll = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  margin: 0 -16px;
  padding: 0 16px 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoreCard = styled(Link)`
  flex: 0 0 auto;
  width: 200px;
  text-decoration: none;
  display: block;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StoreCardThumb = styled.div`
  position: relative;
  width: 100%;
  height: 110px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .store-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 18px;
  }

  .store-emoji {
    font-size: 40px;
  }
`;

const StoreCardBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(25, 27, 46, 0.85);
  color: #ffffff;
  font-size: 9.5px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 6px;
  z-index: 5;
`;

const StoreCardRating = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(25, 27, 46, 0.75);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 3px;
  z-index: 5;
`;

const StoreCardName = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StoreCardEta = styled.p`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
  font-weight: 500;
`;

const StoreCardPriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StoreCardPrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SavingTriggerBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandYellow};
  color: #191B2E;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  flex: none;
  box-shadow: 0 4px 12px rgba(255, 170, 0, 0.25);
  transition: transform 0.1s;

  svg {
    width: 15px;
    height: 15px;
    path {
      stroke: #191B2E;
    }
  }

  &:active {
    transform: scale(0.9);
  }
`;

const BackButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: background 0.2s, transform 0.15s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:active {
    transform: scale(0.93);
  }
`;

const RecommendMenuCard = styled(Link)`
  flex: 0 0 auto;
  width: 140px;
  text-decoration: none;
  display: block;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 18px;
  padding: 10px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const MenuCardThumb = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .menu-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .menu-emoji {
    font-size: 32px;
  }
`;

const MenuCardRating = styled.span`
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(25, 27, 46, 0.85);
  color: #ffffff;
  font-size: 8.5px;
  font-weight: 700;
  padding: 2.5px 5px;
  border-radius: 4px;
  z-index: 5;
`;

const MenuCardName = styled.p`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuCardStoreSub = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuCardPrice = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandNegative};
`;
