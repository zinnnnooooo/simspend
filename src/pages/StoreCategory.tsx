import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { mockStores } from '@/data/mockStores';

export const StoreCategory: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('c') || '치킨';
  
  const [activeSort, setActiveSort] = useState('추천순');

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 카테고리 필터링
  let filtered = mockStores.filter((store) => store.category === currentCategory);

  // 정렬 필터 적용
  if (activeSort === '평점순') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else if (activeSort === '최소주문순') {
    filtered = [...filtered].sort((a, b) => a.minOrder - b.minOrder);
  } else if (activeSort === '배달빠른순' || activeSort === '가까운순') {
    const getMinutes = (label: string) => {
      const match = label.match(/\d+/);
      return match ? parseInt(match[0], 10) : 999;
    };
    filtered = [...filtered].sort((a, b) => getMinutes(a.etaLabel) - getMinutes(b.etaLabel));
  }

  return (
    <ScContainer>
      {/* 헤더 */}
      <ScHeader>
        <HeaderBack to="/delivery">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </HeaderBack>
        <HeaderTitle>{currentCategory}</HeaderTitle>
        <HeaderActions>
          <button type="button" aria-label="검색">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2"/>
              <path d="m20 20-3.8-3.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </HeaderActions>
      </ScHeader>

      {/* 둥근 캡슐 알약 형태의 카테고리 탭 */}
      <ScTabs>
        {['한식', '분식', '버거', '치킨', '피자', '일식', '카페'].map((c) => (
          <ScTab 
            key={c} 
            to={`/delivery/category?c=${c}`} 
            className={c === currentCategory ? 'is-active' : ''}
          >
            {c}
          </ScTab>
        ))}
      </ScTabs>

      {/* 필터 칩 */}
      <ScFilters>
        {['추천순', '평점순', '가까운순', '배달빠른순', '최소주문순'].map((f) => (
          <FilterChip 
            key={f} 
            className={f === activeSort ? 'is-active' : ''}
            onClick={() => setActiveSort(f)}
          >
            {f} {f === activeSort && <span className="arrow-icon">▼</span>}
          </FilterChip>
        ))}
      </ScFilters>

      {/* 맛집 가게 카드 목록 */}
      <StoreList>
        {filtered.length > 0 ? (
          filtered.map((store, idx) => {
            const cardContent = (
              <StoreCard key={store.id} to={`/delivery/store/${store.id}`}>
                <StoreCardTop>
                  {/* 대표 음식 이미지 썸네일 */}
                  <StoreCardThumb>
                    {store.badge && <StoreCardBadge>{store.badge}</StoreCardBadge>}
                    {store.image ? (
                      <img src={store.image} alt={store.name} className="store-img" />
                    ) : (
                      <span className="store-emoji">{store.emoji}</span>
                    )}
                  </StoreCardThumb>
                  <StoreCardInfo>
                    <StoreCardName>{store.name}</StoreCardName>
                    <StoreCardRating>
                      ★ {store.rating} <span className="reviews">({store.reviewCount})</span>
                    </StoreCardRating>
                    <StoreCardTags>{store.menuTags.join(' · ')}</StoreCardTags>
                    <StoreCardMetaRow>
                      <span className="meta-eta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, marginRight: 2, verticalAlign: 'middle' }}>
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        {store.etaLabel}
                      </span>
                      <span className="meta-fee">
                        배달비 <b>{store.deliveryFee}</b>
                      </span>
                    </StoreCardMetaRow>
                  </StoreCardInfo>
                </StoreCardTop>
                <StoreCardMinOrder>
                  최소주문 {fmtWon(store.minOrder)}
                </StoreCardMinOrder>
              </StoreCard>
            );

            // 첫 번째 카드 하단에 2번 시안처럼 카테고리별 추천 챌린지 배너 주입
            if (idx === 0) {
              return (
                <React.Fragment key={store.id}>
                  {cardContent}
                  <ScRecommendBanner>
                    <div className="banner-left">
                      <p className="banner-title">오늘 가장 인기 있는 {currentCategory} 맛집</p>
                      <p className="banner-sub">가장 많은 사용자가 둘러본 음식점</p>
                    </div>
                    <div className="banner-right">
                      <span className="banner-illust">🐥</span>
                      <span className="banner-tag">{currentCategory}</span>
                    </div>
                  </ScRecommendBanner>
                </React.Fragment>
              );
            }

            return cardContent;
          })
        ) : (
          <EmptyCard>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.93 4.93a10 10 0 1 1 14.14 14.14A10 10 0 0 1 4.93 4.93Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <EmptyCardText>이 카테고리에는 등록된 가상 상점이 없습니다.</EmptyCardText>
          </EmptyCard>
        )}

        {/* 새로운 가게 준비 중 알림 슬롯 */}
        <StorePreparingCard>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="prep-icon">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span className="prep-text">새로운 가게 준비 중</span>
        </StorePreparingCard>
      </StoreList>
    </ScContainer>
  );
};

// Styled Components
const ScContainer = styled.main`
  padding: 8px 16px 120px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background-color: #F8F9FA;
  min-height: 100vh;
`;

const ScHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
`;

const HeaderBack = styled(Link)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A1C29;
  flex: none;
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 850;
  color: #1A1C29;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  button {
    width: 22px;
    height: 22px;
    color: #1A1C29;
    display: flex;
    background: transparent;
    border: none;
    cursor: pointer;
  }
`;

const ScTabs = styled.nav`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ScTab = styled(Link)`
  flex: none;
  font-size: 13.5px;
  font-weight: 800;
  color: #8C92A0;
  background: #ffffff;
  border: 1.5px solid #EAECEF;
  padding: 8px 16px;
  border-radius: 999px;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.15s;

  &.is-active {
    color: #ffffff;
    background: #233142;
    border-color: #233142;
  }
`;

const ScFilters = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #ffffff;
  border: 1.5px solid #F1F3F5;
  color: #8C92A0;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &.is-active {
    background: #ffffff;
    border-color: #ECEEF0;
    color: #1A1C29;
  }

  .arrow-icon {
    font-size: 8px;
    margin-left: 2px;
    color: #A0A5B1;
  }
`;

const ScRecommendBanner = styled.div`
  background: #F4F6FA;
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px dashed rgba(35, 49, 66, 0.08);
  margin: 4px 0;

  .banner-left {
    flex: 1;
    min-width: 0;
  }

  .banner-title {
    font-size: 14.5px;
    font-weight: 850;
    color: #1A1C29;
    margin-bottom: 4px;
    letter-spacing: -0.3px;
  }

  .banner-sub {
    font-size: 11.5px;
    color: #8C92A0;
    font-weight: 600;
  }

  .banner-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: #ffffff;
    padding: 8px 12px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.01);
    flex: none;
  }

  .banner-illust {
    font-size: 26px;
  }

  .banner-tag {
    font-size: 9px;
    font-weight: 800;
    color: #233142;
    background: #F1F3F5;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const StoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StoreCard = styled(Link)`
  width: 100%;
  padding: 18px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1.5px solid #F1F3F5;
  display: block;
  text-decoration: none;
`;

const StoreCardTop = styled.div`
  display: flex;
  gap: 16px;
`;

const StoreCardThumb = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background: #EAECEF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;

  .store-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
  }

  .store-emoji {
    font-size: 40px;
  }
`;

const StoreCardBadge = styled.span`
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(35, 49, 66, 0.9);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 6px;
  z-index: 5;
`;

const StoreCardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StoreCardName = styled.p`
  font-size: 16px;
  font-weight: 850;
  color: #1A1C29;
  margin-bottom: 4px;
`;

const StoreCardRating = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 800;
  color: #FF5A5A;
  margin-bottom: 4px;

  .reviews {
    color: #8C92A0;
    font-weight: 600;
  }
`;

const StoreCardTags = styled.p`
  font-size: 12px;
  color: #8C92A0;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
`;

const StoreCardMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #8C92A0;
  font-weight: 600;

  .meta-eta {
    display: flex;
    align-items: center;
    color: #2F384C;
    font-weight: 700;
  }

  .meta-fee b {
    color: #00B050;
  }
`;

const StoreCardMinOrder = styled.p`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1.5px solid #F1F3F5;
  font-size: 12.5px;
  color: #8C92A0;
  font-weight: 600;
`;

const StorePreparingCard = styled.div`
  border: 1.5px dashed #CCD3DC;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8C92A0;

  .prep-icon {
    width: 24px;
    height: 24px;
    color: #A0A5B1;
  }

  .prep-text {
    font-size: 13px;
    font-weight: 700;
  }
`;

const EmptyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: #A8B4C8;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const EmptyCardText = styled.p`
  font-size: 13.5px;
  font-weight: 700;
  color: #8B8D9B;
`;
