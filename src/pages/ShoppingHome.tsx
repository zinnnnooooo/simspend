import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGraphAnimation } from '@/hooks/useGraphAnimation';
import { 
  mockProducts, 
  getFeaturedProducts, 
  getHotDeals, 
  shuffleProducts 
} from '@/data/mockProducts';
import { ShoppingProduct } from '@/@types';

// 정밀 벡터 라인 아이콘 딕셔너리
const SHOPPING_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  패션: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"/>
    </svg>
  ),
  전자기기: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2"/>
      <line x1="8" x2="16" y1="21" y2="21"/>
      <line x1="12" x2="12" y1="17" y2="21"/>
    </svg>
  ),
  뷰티: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v4H9zM10 7v3a2 2 0 0 0 4 0V7M7 10h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"/>
    </svg>
  ),
  생활용품: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  명품: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
      <path d="M11 3 8 9l4 12 4-12-3-6"/>
      <path d="M2 9h20"/>
    </svg>
  ),
  스포츠: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/>
    </svg>
  ),
  전체보기: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="14" rx="1"/>
      <rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  )
};

const CATEGORIES = [
  { name: '패션', key: '패션' },
  { name: '전자기기', key: '전자기기' },
  { name: '명품', key: '명품' },
  { name: '뷰티', key: '뷰티' },
  { name: '생활용품', key: '생활용품' },
  { name: '스포츠', key: '스포츠' },
  { name: '전체보기', key: '전체' }
];

export const ShoppingHome: React.FC = () => {
  const navigate = useNavigate();
  const progress = useGraphAnimation(1000);
  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  const [hotDeals, setHotDeals] = useState<ShoppingProduct[]>([]);
  const [popularProducts, setPopularProducts] = useState<ShoppingProduct[]>([]);
  const [totalSaved, setTotalSaved] = useState(348900); // 이번 달 가상 쇼핑으로 절약한 금액 (기본값)

  useEffect(() => {
    setHotDeals(getHotDeals(5));
    setPopularProducts(shuffleProducts(mockProducts).slice(0, 8));
  }, []);

  return (
    <ShContainer>
      {/* 1. 상단 헤더 */}
      <ShHeader>
        <HeaderBack to="/experience" aria-label="이전 화면으로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </HeaderBack>
        <HeaderTitle>가상 쇼핑몰</HeaderTitle>
        <HeaderActions>
          <button 
            type="button" 
            aria-label="상품 검색"
            onClick={() => navigate('/shopping/category?c=전체')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </HeaderActions>
      </ShHeader>

      {/* 2. 챌린지 및 절약 금액 배너 */}
      <SavingBanner>
        <BannerBadge>
          <span>🔥</span> 무지출 쇼핑 챌린지
        </BannerBadge>
        <BannerTitle>
          사고 싶은 건 가상으로!<br />
          지갑을 안전하게 지켰어요
        </BannerTitle>
        <BannerAmountCard>
          <AmountLabel>이번 달 절약한 가상 금액</AmountLabel>
          <AmountValue>{fmtWon(totalSaved * progress)}</AmountValue>
          <AmountProgressWrap>
            <ProgressBar width={`${72 * progress}%`} />
          </AmountProgressWrap>
          <AmountTip>목표 저축액의 {Math.round(72 * progress)}%를 지출 없이 달성 중이에요 ✨</AmountTip>
        </BannerAmountCard>
      </SavingBanner>

      {/* 3. 카테고리 퀵 메뉴 */}
      <SectionTitle>카테고리</SectionTitle>
      <CategoryGrid>
        {CATEGORIES.map(cat => (
          <CategoryItem 
            key={cat.name}
            to={`/shopping/category?c=${encodeURIComponent(cat.key)}`}
          >
            <CategoryIconBox>
              {SHOPPING_CATEGORY_ICONS[cat.name] || SHOPPING_CATEGORY_ICONS['전체보기']}
            </CategoryIconBox>
            <CategoryLabel>{cat.name}</CategoryLabel>
          </CategoryItem>
        ))}
      </CategoryGrid>

      {/* 4. 오늘의 핫딜 (가로 스크롤) */}
      <SectionHeader>
        <SectionTitle>⚡ 오늘의 타임 특가</SectionTitle>
        <ViewAllLink to="/shopping/category?c=전체">더보기 &gt;</ViewAllLink>
      </SectionHeader>
      
      <HotDealScrollList>
        {hotDeals.map(item => (
          <HotDealCard key={item.id} to={`/shopping/product/${item.id}`}>
            <HotDealImageWrap>
              <img src={item.image} alt={item.name} loading="lazy" />
              <DiscountBadge>{item.discountRate}% OFF</DiscountBadge>
            </HotDealImageWrap>
            <HotDealContent>
              <ItemBrand>{item.brand}</ItemBrand>
              <ItemName>{item.name}</ItemName>
              <PriceRow>
                <FinalPrice>{fmtWon(item.price)}</FinalPrice>
                <OriginalPrice>{fmtWon(item.originalPrice)}</OriginalPrice>
              </PriceRow>
              <CardBottomActionRow>
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
                        highlightOption: item.badge || '',
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
              </CardBottomActionRow>
            </HotDealContent>
          </HotDealCard>
        ))}
      </HotDealScrollList>

      {/* 5. 실시간 인기 가상 아이템 (2열 그리드) */}
      <SectionHeader>
        <SectionTitle>🏆 실시간 인기 아이템</SectionTitle>
        <ViewAllLink to="/shopping/category?c=전체">전체보기 &gt;</ViewAllLink>
      </SectionHeader>

      <ProductGrid>
        {popularProducts.map(item => (
          <ProductCard key={item.id} to={`/shopping/product/${item.id}`}>
            <ProductImageWrap>
              <img src={item.image} alt={item.name} loading="lazy" />
              {item.badge && <CardBadge className={item.badge.toLowerCase()}>{item.badge}</CardBadge>}
            </ProductImageWrap>
            <ProductInfo>
              <ItemBrand>{item.brand}</ItemBrand>
              <ItemName>{item.name}</ItemName>
              <RatingRow>
                <StarIcon>★</StarIcon>
                <RatingScore>{item.rating}</RatingScore>
                <ReviewCount>({item.reviewCount})</ReviewCount>
              </RatingRow>
              <ProductPriceRow>
                <DiscountRate>{item.discountRate}%</DiscountRate>
                <FinalPrice>{fmtWon(item.price)}</FinalPrice>
              </ProductPriceRow>
              <CardBottomActionRow style={{ marginTop: '8px' }}>
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
              </CardBottomActionRow>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      {/* 6. 안심 안내 배너 */}
      <NoticeBanner>
        <NoticeIcon>🛍️</NoticeIcon>
        <NoticeText>
          <strong>안심하고 마음껏 담아보세요!</strong><br />
          실제 결제는 발생하지 않으며, 구매 욕구를 가상으로 해소하고 절약하는 공간입니다.
        </NoticeText>
      </NoticeBanner>
    </ShContainer>
  );
};

// === styled-components ===

const ShContainer = styled.main`
  padding: 16px 16px 88px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const ShHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  transition: background 0.2s, transform 0.15s ease;

  &:active {
    transform: scale(0.93);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    width: 32px;
    height: 32px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.cardBackground};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s;

    svg {
      width: 16px;
      height: 16px;
    }

    &:active {
      transform: scale(0.93);
    }
  }
`;

const SavingBanner = styled.section`
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

const BannerBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.12);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandYellow};
  margin-bottom: 12px;
`;

const BannerTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  margin-bottom: 16px;
`;

const BannerAmountCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 14px 16px;
`;

const AmountLabel = styled.p`
  font-size: 11.5px;
  color: #A0A3B5;
  margin-bottom: 4px;
`;

const AmountValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandYellow};
  margin-bottom: 10px;
`;

const AmountProgressWrap = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  height: 100%;
  background: ${({ theme }) => theme.colors.brandYellow};
  border-radius: 999px;
  transition: width 0.4s ease-in-out;
`;

const AmountTip = styled.p`
  font-size: 11.5px;
  color: #E2E8F0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ViewAllLink = styled(Link)`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 8px;
`;

const CategoryItem = styled(Link)`
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

const CategoryIconBox = styled.div`
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

  ${CategoryItem}:hover & {
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

const HotDealScrollList = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HotDealCard = styled(Link)`
  flex: 0 0 160px;
  scroll-snap-align: start;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const HotDealImageWrap = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  background: ${({ theme }) => theme.colors.background};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${({ theme }) => theme.colors.brandNegative};
  color: #FFFFFF;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 6px;
`;

const HotDealContent = styled.div`
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
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.35;
  height: 35px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 6px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
`;

const FinalPrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const OriginalPrice = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;


const CardBottomActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const QuickBuyBtn = styled.button`
  padding: 5px 10px;
  background: ${({ theme }) => theme.colors.brandYellow};
  color: #191B2E;
  font-size: 10.5px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.15s, opacity 0.2s;

  &:active {
    transform: scale(0.95);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
`;

const ProductCard = styled(Link)`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ProductImageWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: ${({ theme }) => theme.colors.background};

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
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 6px;
  color: #FFFFFF;

  &.best {
    background: ${({ theme }) => theme.colors.brandYellow};
    color: #191B2E;
  }
  &.hot {
    background: ${({ theme }) => theme.colors.brandNegative};
  }
  &.sale {
    background: #8B5CF6;
  }
  &.추천 {
    background: ${({ theme }) => theme.colors.brandPositive};
  }
`;

const ProductInfo = styled.div`
  padding: 12px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 4px;
`;

const StarIcon = styled.span`
  color: ${({ theme }) => theme.colors.brandYellow};
  font-size: 11px;
`;

const RatingScore = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReviewCount = styled.span`
  font-size: 10.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProductPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DiscountRate = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandNegative};
`;

const NoticeBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 14px 16px;
  margin-top: 8px;
`;

const NoticeIcon = styled.div`
  font-size: 20px;
  flex: none;
`;

const NoticeText = styled.p`
  font-size: 12px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
`;

