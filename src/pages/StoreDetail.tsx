import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { mockStores } from '@/data/mockStores';

export const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const store = mockStores.find((s) => s.id === id);

  // 탭 상태 ('대표메뉴', '메인메뉴', '사이드', '리뷰')
  const [activeTab, setActiveTab] = useState('대표메뉴');

  if (!store) {
    return (
      <SdContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/delivery')} aria-label="뒤로가기">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <HeaderTitle>가게 정보 없음</HeaderTitle>
        </PageHeader>
        <EmptyText>요청하신 가게를 찾을 수 없습니다.</EmptyText>
      </SdContainer>
    );
  }

  // 메뉴 주문 클릭 시 옵션 선택 페이지로 이동
  const handleOrder = (menuName: string) => {
    navigate(`/delivery/option/${store.id}/${encodeURIComponent(menuName)}`);
  };

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 카테고리별 특화된 사이드 & 음료 목록 생성
  const getSidesByCategory = (category: string) => {
    switch (category) {
      case '한식':
        return [
          { name: '우렁 강된장 추가', price: 3000, emoji: '🍲' },
          { name: '계란후라이 추가', price: 1000, emoji: '🍳' },
          { name: '공깃밥 추가', price: 1000, emoji: '🍚' },
          { name: '전통 식혜 350ml', price: 2000, emoji: '🥤' }
        ];
      case '분식':
        return [
          { name: '맛보기 찰순대', price: 4000, emoji: '🍢' },
          { name: '야채튀김 3개', price: 3000, emoji: '🥕' },
          { name: '신전 튀김오뎅 6개', price: 2000, emoji: '🍢' },
          { name: '달콤 쿨피스 930ml', price: 2000, emoji: '🥤' }
        ];
      case '버거':
        return [
          { name: '바삭 어니언링', price: 3500, emoji: '🧅' },
          { name: '케이준 양념감자', price: 3000, emoji: '🍟' },
          { name: '해쉬브라운 2개', price: 2500, emoji: '🥔' },
          { name: '스프라이트 L', price: 2000, emoji: '🥤' }
        ];
      case '치킨':
        return [
          { name: '쫀득 치즈볼 5개', price: 5000, emoji: '🧀' },
          { name: '바삭 감자튀김 M', price: 3500, emoji: '🍟' },
          { name: '새콤 치킨무 추가', price: 500, emoji: '🥒' },
          { name: '코카콜라 제로 355ml', price: 2000, emoji: '🥤' }
        ];
      case '피자':
        return [
          { name: '치즈 오븐 스파게티', price: 6000, emoji: '🍝' },
          { name: '오븐 핫윙 4조각', price: 4000, emoji: '🍗' },
          { name: '오이 피클 추가', price: 500, emoji: '🥒' },
          { name: '코카콜라 1.25L', price: 3000, emoji: '🥤' }
        ];
      case '일식':
        return [
          { name: '미니 사누끼우동', price: 3500, emoji: '🍜' },
          { name: '바삭 새우튀김 2개', price: 4000, emoji: '🍤' },
          { name: '아지타마고 반숙란', price: 1000, emoji: '🥚' },
          { name: '차가운 도쿠리 사케 1병', price: 5000, emoji: '🍶' }
        ];
      case '카페':
        return [
          { name: '초코 브라우니 1조각', price: 4000, emoji: '🍫' },
          { name: '인절미 떡 사리 추가', price: 1500, emoji: '🍡' },
          { name: '바닐라 아이스크림 한 쿱', price: 2000, emoji: '🍨' },
          { name: '에스프레소 샷추가', price: 600, emoji: '☕' }
        ];
      default:
        return [
          { name: '바삭 감자튀김', price: 4000, emoji: '🍟' },
          { name: '코카콜라 355ml', price: 2000, emoji: '🥤' }
        ];
    }
  };

  const sideMenus = getSidesByCategory(store.category);

  // 대표 메뉴 및 메인 메뉴 목록 추출
  const mainMenus = store.menus || [];
  const bestMenus = mainMenus.slice(0, 2); // 상위 2개를 BEST/대표로 매핑

  return (
    <SdContainer>
      {/* 상단 배너 이미지 영역 */}
      <HeroBanner>
        <img 
          src={store.image || '/assets/chicken_thumbnail.png'} 
          alt={store.name} 
          className="hero-img" 
        />
        <div className="hero-overlay" />
        <HeaderOverlayBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </HeaderOverlayBtn>
      </HeroBanner>

      {/* 가게 기본 정보 메타 카드 */}
      <StoreMetaCard>
        <StoreTitleRow>
          <h1 className="store-name">{store.name}</h1>
          <div className="store-rating-badge">
            ★ {store.rating} <span className="reviews">({store.reviewCount})</span>
          </div>
        </StoreTitleRow>
        <StoreDescText>
          바삭한 조리와 신선한 재료로 매일 정성껏 요리하는 프리미엄 {store.category} 전문점입니다.
        </StoreDescText>
        <MetaSpecsTable>
          <div className="spec-item">
            <span className="spec-label">배달시간</span>
            <span className="spec-value">{store.etaLabel}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">최소주문</span>
            <span className="spec-value">{fmtWon(store.minOrder)}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">기본배달팁</span>
            <span className="spec-value is-free">{store.deliveryFee}</span>
          </div>
        </MetaSpecsTable>
      </StoreMetaCard>

      {/* 앵커 탭바 */}
      <AnchorTabsBar>
        {['대표메뉴', `${store.category}`, '사이드', '리뷰'].map((tabName) => {
          const isSelected = activeTab === (tabName.includes('대표') ? '대표메뉴' : tabName);
          return (
            <TabButton 
              key={tabName} 
              $active={isSelected}
              onClick={() => setActiveTab(tabName.includes('대표') ? '대표메뉴' : tabName)}
            >
              {tabName}
            </TabButton>
          );
        })}
      </AnchorTabsBar>

      {/* 1. 🔥 가장 많이 선택하는 메뉴 (BEST) */}
      {(activeTab === '대표메뉴' || activeTab === '메인메뉴') && (
        <MenuSection>
          <MenuSectionTitle>🔥 가장 많이 선택하는 메뉴</MenuSectionTitle>
          <BestMenuScroll>
            {bestMenus.map((menu, idx) => (
              <BestMenuCard key={idx} onClick={() => handleOrder(menu.name)}>
                <div className="card-thumb">
                  <span className="best-badge">BEST</span>
                  <img 
                    src={store.image || '/assets/chicken_thumbnail.png'} 
                    alt={menu.name} 
                    className="thumb-img" 
                  />
                </div>
                <p className="menu-name">{menu.name}</p>
                <p className="menu-price">{fmtWon(menu.price)}</p>
              </BestMenuCard>
            ))}
          </BestMenuScroll>
        </MenuSection>
      )}

      {/* 2. 메인 전체 메뉴 목록 */}
      {(activeTab === '대표메뉴' || activeTab === `${store.category}`) && (
        <MenuSection>
          <MenuSectionTitle>{store.category} 메뉴</MenuSectionTitle>
          <MenuList>
            {mainMenus.map((menu, idx) => (
              <MenuListItemCard key={idx}>
                <div className="menu-left">
                  <p className="name">
                    {menu.name}
                    {idx === 0 && <span className="best-tag">BEST</span>}
                  </p>
                  <p className="desc">{menu.desc}</p>
                  <p className="price">{fmtWon(menu.price)}</p>
                  <MenuCartBtn onClick={() => handleOrder(menu.name)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    메뉴 담기
                  </MenuCartBtn>
                </div>
                <div className="menu-right">
                  <img 
                    src={store.image || '/assets/chicken_thumbnail.png'} 
                    alt={menu.name} 
                    className="menu-thumb" 
                  />
                </div>
              </MenuListItemCard>
            ))}
          </MenuList>
        </MenuSection>
      )}

      {/* 3. 사이드 & 음료 (바둑판형 카드 리스트) */}
      {(activeTab === '대표메뉴' || activeTab === '사이드') && (
        <MenuSection style={{ marginBottom: 40 }}>
          <MenuSectionTitle>사이드 & 음료</MenuSectionTitle>
          <SideMenuGrid>
            {sideMenus.map((side, idx) => (
              <SideCard key={idx} onClick={() => handleOrder(side.name)}>
                <div className="side-thumb">
                  <span className="side-emoji">{side.emoji}</span>
                </div>
                <div className="side-meta">
                  <p className="name">{side.name}</p>
                  <p className="price">{fmtWon(side.price)}</p>
                </div>
              </SideCard>
            ))}
          </SideMenuGrid>
        </MenuSection>
      )}

      {/* 4. 리뷰 탭 플레이스홀더 */}
      {activeTab === '리뷰' && (
        <MenuSection>
          <MenuSectionTitle>가게 리뷰 ({store.reviewCount})</MenuSectionTitle>
          <EmptyText>아직 작성된 가상 리뷰가 없습니다. 첫 챌린지를 완료해 보세요! ✍️</EmptyText>
        </MenuSection>
      )}

      {/* 하단 고정 바로구매/장바구니 버튼 구성 */}
      <BottomStickyBar>
        <CartActionsRow>
          <CartOutlineBtn onClick={() => handleOrder(mainMenus[0]?.name || '')}>
            장바구니
          </CartOutlineBtn>
          <BuyDirectBtn onClick={() => handleOrder(mainMenus[0]?.name || '')}>
            바로 구매
          </BuyDirectBtn>
        </CartActionsRow>
      </BottomStickyBar>
    </SdContainer>
  );
};

// Styled Components
const SdContainer = styled.main`
  padding: 0 0 160px; /* 고정 버튼바 겹치지 않게 여유 공간 부여 */
  display: flex;
  flex-direction: column;
  background-color: #F8F9FA;
  min-height: 100vh;
`;

const PageHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #ECEEF0;
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 800;
  color: #2b2d42;
`;

const BackButton = styled.button`
  position: absolute;
  left: 16px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2b2d42;
  background: transparent;
  border: none;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeroBanner = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;

  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 100%);
  }
`;

const HeaderOverlayBtn = styled.button`
  position: fixed;
  left: calc(50% - 224px);
  top: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(30, 31, 46, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 99; /* 콘텐츠 스크롤 시 위로 뜨도록 설정 */

  @media (max-width: 480px) {
    left: 16px;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }
`;

const StoreMetaCard = styled.div`
  margin: -32px 16px 0;
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 10px 30px rgba(43, 45, 66, 0.05);
  border: 1px solid #ECEEF0;
  z-index: 15;
`;

const StoreTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  gap: 12px;

  .store-name {
    font-size: 20px;
    font-weight: 850;
    color: #1A1C29;
    letter-spacing: -0.3px;
  }

  .store-rating-badge {
    font-size: 13.5px;
    font-weight: 800;
    color: #FF5A5A;
    white-space: nowrap;

    .reviews {
      color: #8C92A0;
      font-weight: 600;
    }
  }
`;

const StoreDescText = styled.p`
  font-size: 12.5px;
  color: #8B8D9B;
  line-height: 1.45;
  margin-bottom: 18px;
  font-weight: 500;
`;

const MetaSpecsTable = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1.5px solid #F1F3F5;
  padding-top: 16px;
  text-align: center;

  .spec-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-right: 1px solid #F1F3F5;

    &:last-child {
      border-right: none;
    }
  }

  .spec-label {
    font-size: 11.5px;
    font-weight: 700;
    color: #8C92A0;
  }

  .spec-value {
    font-size: 13.5px;
    font-weight: 800;
    color: #1A1C29;

    &.is-free {
      color: #00B050;
    }
  }
`;

const AnchorTabsBar = styled.nav`
  display: flex;
  background: #ffffff;
  border-bottom: 1.5px solid #ECEEF0;
  margin-top: 20px;
  padding: 0 8px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 14px;
  font-weight: 800;
  color: ${({ $active }) => ($active ? '#233142' : '#8C92A0')};
  background: transparent;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#233142' : 'transparent')};
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
`;

const MenuSection = styled.section`
  padding: 24px 16px 0;
`;

const MenuSectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 850;
  color: #1A1C29;
  margin-bottom: 16px;
`;

const BestMenuScroll = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BestMenuCard = styled.div`
  flex: 0 0 auto;
  width: 170px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1.5px solid #F1F3F5;
  padding: 12px;
  cursor: pointer;

  .card-thumb {
    position: relative;
    width: 100%;
    height: 100px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .best-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    font-size: 9px;
    font-weight: 800;
    color: #ffffff;
    background: #233142;
    padding: 3px 6px;
    border-radius: 4px;
    z-index: 5;
  }

  .menu-name {
    font-size: 13.5px;
    font-weight: 800;
    color: #1A1C29;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-price {
    font-size: 14px;
    font-weight: 850;
    color: #1A1C29;
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MenuListItemCard = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1.5px solid #F1F3F5;
  gap: 16px;

  .menu-left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .name {
    font-size: 15.5px;
    font-weight: 850;
    color: #1A1C29;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .best-tag {
    font-size: 9px;
    font-weight: 800;
    color: #ffffff;
    background: #FF5A5A;
    padding: 2.5px 6px;
    border-radius: 4px;
  }

  .desc {
    font-size: 12px;
    color: #8C92A0;
    line-height: 1.4;
    margin-bottom: 12px;
  }

  .price {
    font-size: 15px;
    font-weight: 850;
    color: #1A1C29;
    margin-bottom: auto;
  }

  .menu-right {
    width: 88px;
    height: 88px;
    border-radius: 12px;
    overflow: hidden;
    flex: none;
    background: #EAECEF;
  }

  .menu-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MenuCartBtn = styled.button`
  align-self: flex-start;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #233142;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(35, 49, 66, 0.15);
  transition: transform 0.1s;

  &:active {
    transform: scale(0.96);
  }
`;

const SideMenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
`;

const SideCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1.5px solid #F1F3F5;
  overflow: hidden;
  cursor: pointer;

  .side-thumb {
    width: 100%;
    height: 96px;
    background: linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .side-emoji {
    font-size: 32px;
  }

  .side-meta {
    padding: 12px;
  }

  .name {
    font-size: 13px;
    font-weight: 800;
    color: #1A1C29;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price {
    font-size: 13px;
    font-weight: 850;
    color: #FF5A5A;
  }
`;

const BottomStickyBar = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(16px + env(safe-area-inset-bottom)); /* 화면 가장 아래 배치 */
  width: calc(100% - 32px);
  max-width: 448px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 -8px 24px rgba(43, 45, 66, 0.08), 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 14px 16px;
  z-index: 30;
  box-sizing: border-box;
`;

const CartActionsRow = styled.div`
  display: flex;
  gap: 12px;
`;

const CartOutlineBtn = styled.button`
  flex: 1;
  background: #F1F3F5;
  color: #2F384C;
  font-size: 15px;
  font-weight: 800;
  padding: 15px 0;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;

  &:active {
    background-color: #E2E8F0;
  }
`;

const BuyDirectBtn = styled.button`
  flex: 1.3;
  background: #233142;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  padding: 15px 0;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(35, 49, 66, 0.25);
  transition: transform 0.1s;

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyText = styled.p`
  text-align: center;
  color: #8C92A0;
  font-size: 13.5px;
  font-weight: 500;
  padding: 48px 0;
  line-height: 1.5;
`;
