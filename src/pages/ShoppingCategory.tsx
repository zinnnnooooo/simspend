import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mockProducts, getProductsByCategory } from '@/data/mockProducts';
import { ShoppingProduct } from '@/@types';

const CATEGORIES = ['전체', '패션', '전자기기', '명품', '뷰티', '생활용품', '스포츠'];
const SORT_OPTIONS = ['추천순', '할인율순', '낮은가격순', '평점순'];

export const ShoppingCategory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('c') || '전체';
  
  const [activeSort, setActiveSort] = useState('추천순');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 1. 카테고리 필터링
  let filtered = getProductsByCategory(currentCategory);

  // 2. 검색어 필터링 (검색창 열려있을 때)
  if (searchKeyword.trim()) {
    const q = searchKeyword.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // 3. 정렬 로직 적용
  if (activeSort === '할인율순') {
    filtered = [...filtered].sort((a, b) => b.discountRate - a.discountRate);
  } else if (activeSort === '낮은가격순') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (activeSort === '평점순') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else {
    // 추천순 (기본): 평점 * 리뷰수 가중치
    filtered = [...filtered].sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
  }

  return (
    <ScContainer>
      {/* 1. 상단 헤더 */}
      <ScHeader>
        <HeaderBack to="/shopping" aria-label="쇼핑 홈으로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </HeaderBack>
        <HeaderTitle>{currentCategory === '전체' ? '전체 상품' : currentCategory}</HeaderTitle>
        <HeaderActions>
          <button 
            type="button" 
            aria-label="검색 토글"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </HeaderActions>
      </ScHeader>

      {/* 검색 입력바 (토글식) */}
      {isSearchOpen && (
        <SearchBarWrap>
          <SearchInput 
            type="text" 
            placeholder="상품명, 브랜드 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            autoFocus
          />
          {searchKeyword && (
            <ClearButton onClick={() => setSearchKeyword('')}>✕</ClearButton>
          )}
        </SearchBarWrap>
      )}

      {/* 2. 카테고리 가로 스크롤 탭 바 */}
      <CategoryTabs>
        {CATEGORIES.map(cat => {
          const isActive = currentCategory === cat || (cat === '전체' && currentCategory === '전체보기');
          return (
            <CategoryTab
              key={cat}
              to={`/shopping/category?c=${encodeURIComponent(cat)}`}
              className={isActive ? 'is-active' : ''}
            >
              {cat}
            </CategoryTab>
          );
        })}
      </CategoryTabs>

      {/* 3. 정렬 필터 및 상품 개수 바 */}
      <FilterBar>
        <ProductCount>
          총 <strong>{filtered.length}</strong>개
        </ProductCount>
        <SortOptions>
          {SORT_OPTIONS.map(sort => (
            <SortButton 
              key={sort}
              type="button"
              className={activeSort === sort ? 'is-active' : ''}
              onClick={() => setActiveSort(sort)}
            >
              {sort}
            </SortButton>
          ))}
        </SortOptions>
      </FilterBar>

      {/* 4. 상품 목록 (2열 그리드) */}
      {filtered.length > 0 ? (
        <ProductGrid>
          {filtered.map(item => (
            <ProductCard key={item.id} to={`/shopping/product/${item.id}`}>
              <ProductImageWrap>
                <img src={item.image} alt={item.name} loading="lazy" />
                {item.badge && (
                  <CardBadge className={item.badge.toLowerCase()}>
                    {item.badge}
                  </CardBadge>
                )}
              </ProductImageWrap>

              <ProductInfo>
                <ItemBrand>{item.brand}</ItemBrand>
                <ItemName>{item.name}</ItemName>
                
                <RatingRow>
                  <StarIcon>★</StarIcon>
                  <RatingScore>{item.rating}</RatingScore>
                  <ReviewCount>({item.reviewCount})</ReviewCount>
                </RatingRow>

                <PriceContainer>
                  <OriginalPrice>{fmtWon(item.originalPrice)}</OriginalPrice>
                  <PriceRow>
                    <DiscountRate>{item.discountRate}%</DiscountRate>
                    <FinalPrice>{fmtWon(item.price)}</FinalPrice>
                  </PriceRow>
                </PriceContainer>

                <CardBottomRow>
                  <QuickBuyBtn 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate('/shopping/payment', {
                        state: {
                          productId: item.id,
                          productName: item.name,
                          brand: item.brand,
                          category: item.category,
                          image: item.image,
                          selectedColor: item.colors?.[0] || '기본',
                          selectedOptionsText: '',
                          quantity: 1,
                          unitPrice: item.price,
                          totalPrice: item.price,
                          totalSaved: item.savedAmount,
                          originalPrice: item.originalPrice
                        }
                      });
                    }}
                  >
                    가상 구매
                  </QuickBuyBtn>
                </CardBottomRow>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>검색된 상품이 없습니다</EmptyTitle>
          <EmptyDesc>다른 검색어나 카테고리를 선택해보세요.</EmptyDesc>
          <ResetButton to="/shopping/category?c=전체">전체 상품 보기</ResetButton>
        </EmptyState>
      )}
    </ScContainer>
  );
};

// === styled-components ===

const ScContainer = styled.main`
  padding: 8px 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ScHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;

const HeaderBack = styled(Link)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 50%;
  transition: background-color 0.2s;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const HeaderTitle = styled.h1`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;

  button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.border};
    }
  }
`;

const SearchBarWrap = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 38px 12px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  cursor: pointer;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px 4px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryTab = styled(Link)`
  flex: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;

  &.is-active {
    background: #1E1F2E;
    color: #FFAE00;
    border-color: #1E1F2E;
    font-weight: 700;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
`;

const ProductCount = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
`;

const SortOptions = styled.div`
  display: flex;
  gap: 6px;
`;

const SortButton = styled.button`
  border: none;
  background: transparent;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  font-weight: 500;

  &.is-active {
    color: ${({ theme }) => theme.colors.brandYellow};
    font-weight: 700;
    background: rgba(255, 174, 0, 0.1);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
`;

const ProductCard = styled(Link)`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ProductImageWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #F3F4F6;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 6px;
  color: #FFFFFF;

  &.best {
    background: #FFAE00;
  }
  &.hot {
    background: #FF5C5C;
  }
  &.sale {
    background: #8B5CF6;
  }
  &.추천 {
    background: #2F9E6E;
  }
`;


const ProductInfo = styled.div`
  padding: 12px;
`;

const ItemBrand = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2px;
`;

const ItemName = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.35;
  height: 35px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 6px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 6px;
`;

const StarIcon = styled.span`
  color: #FFAE00;
  font-size: 11px;
`;

const RatingScore = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReviewCount = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OriginalPrice = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DiscountRate = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #FF5C5C;
`;

const FinalPrice = styled.span`
  font-size: 14.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardBottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const QuickBuyBtn = styled.button`
  width: 100%;
  padding: 6px 0;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 11.5px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.96);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
`;

const EmptyDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 20px;
`;

const ResetButton = styled(Link)`
  padding: 10px 20px;
  background: #1E1F2E;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
