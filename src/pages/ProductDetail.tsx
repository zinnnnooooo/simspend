import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getProductById } from '@/data/mockProducts';
import { useLedger } from '@/context/LedgerContext';
import { VirtualPurchase } from '@/@types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addVirtualPurchase } = useLedger();

  const product = getProductById(id || '');

  // 상태 관리
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { name: string; priceDelta: number }>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'review'>('desc');
  const [isLiked, setIsLiked] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 상품이 없을 때
  if (!product) {
    return (
      <PdNotFoundContainer>
        <NotFoundIcon>📦</NotFoundIcon>
        <NotFoundTitle>상품을 찾을 수 없습니다</NotFoundTitle>
        <NotFoundDesc>요청하신 상품 정보가 존재하지 않거나 삭제되었습니다.</NotFoundDesc>
        <BackBtn to="/shopping">쇼핑 홈으로 돌아가기</BackBtn>
      </PdNotFoundContainer>
    );
  }

  // 옵션 추가금 합산
  const optionsExtraPrice = Object.values(selectedOptions).reduce(
    (sum, opt) => sum + (opt.priceDelta || 0), 
    0
  );

  // 단가 및 총 결제금액, 총 절약금액
  const unitPrice = product.price + optionsExtraPrice;
  const totalPrice = unitPrice * quantity;
  const totalSaved = product.savedAmount * quantity;

  // 옵션 선택 핸들러
  const handleOptionChange = (groupName: string, optionName: string, priceDelta = 0) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupName]: { name: optionName, priceDelta }
    }));
  };

  // 수량 증감
  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
  };

  // 가상 구매하기 버튼 클릭 -> 결제 페이지로 이동
  const handlePurchase = () => {
    const selectedOptionSummary = Object.entries(selectedOptions)
      .map(([grp, opt]) => `${grp}: ${opt.name}`)
      .join(', ');

    navigate('/shopping/payment', {
      state: {
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        category: product.category,
        image: product.image,
        selectedColor: selectedColor || '기본',
        selectedOptionsText: selectedOptionSummary,
        quantity,
        unitPrice,
        totalPrice,
        totalSaved,
        originalPrice: product.originalPrice
      }
    });
  };

  return (
    <PdContainer>
      {/* 1. 상단 네비게이션 헤더 */}
      <PdHeader>
        <HeaderBack onClick={() => navigate(-1)} aria-label="이전 화면">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </HeaderBack>
        <HeaderTitle>상품 상세</HeaderTitle>
        <HeaderActions>
          <button 
            type="button" 
            aria-label="찜하기"
            onClick={() => setIsLiked(!isLiked)}
            style={{ color: isLiked ? '#FF5C5C' : 'inherit' }}
          >
            <svg viewBox="0 0 24 24" fill={isLiked ? '#FF5C5C' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </HeaderActions>
      </PdHeader>

      {/* 2. 상품 대표 이미지 및 뱃지 */}
      <PdImageWrap>
        <img src={product.image} alt={product.name} />
        <DiscountBadge>{product.discountRate}% OFF</DiscountBadge>
        {product.badge && (
          <CardBadge className={product.badge.toLowerCase()}>
            {product.badge}
          </CardBadge>
        )}
      </PdImageWrap>

      {/* 3. 상품 기본 정보 */}
      <PdInfoSection>
        <BrandRow>
          <BrandName>{product.brand}</BrandName>
          <CategoryBadge>{product.category}</CategoryBadge>
        </BrandRow>
        <ProductName>{product.name}</ProductName>

        <RatingRow>
          <StarIcon>★</StarIcon>
          <RatingScore>{product.rating}</RatingScore>
          <ReviewCount>({product.reviewCount}개 리뷰)</ReviewCount>
        </RatingRow>

        <PriceSection>
          <OriginalPriceWrap>
            <OriginalPrice>{fmtWon(product.originalPrice)}</OriginalPrice>
            <DiscountRate>{product.discountRate}%</DiscountRate>
          </OriginalPriceWrap>
          <FinalPriceRow>
            <FinalPrice>{fmtWon(product.price)}</FinalPrice>
          </FinalPriceRow>
        </PriceSection>
      </PdInfoSection>

      {/* 4. 옵션 선택 영역 */}
      <PdOptionSection>
        {/* 색상 선택 */}
        {product.colors && product.colors.length > 0 && (
          <OptionGroupWrap>
            <OptionGroupTitle>색상 선택</OptionGroupTitle>
            <ColorList>
              {product.colors.map(color => (
                <ColorButton 
                  key={color}
                  type="button"
                  colorHex={color}
                  className={selectedColor === color ? 'is-selected' : ''}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`색상 ${color}`}
                >
                  {selectedColor === color && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </ColorButton>
              ))}
            </ColorList>
          </OptionGroupWrap>
        )}

        {/* 추가 옵션 그룹 */}
        {product.options && product.options.map(group => (
          <OptionGroupWrap key={group.name}>
            <OptionGroupTitle>
              {group.name} {group.required && <RequiredTag>필수</RequiredTag>}
            </OptionGroupTitle>
            <OptionSelectList>
              {group.options.map(opt => {
                const isSelected = selectedOptions[group.name]?.name === opt.name;
                return (
                  <OptionSelectBtn
                    key={opt.name}
                    type="button"
                    className={isSelected ? 'is-selected' : ''}
                    onClick={() => handleOptionChange(group.name, opt.name, opt.priceDelta)}
                  >
                    <span>{opt.name}</span>
                    {opt.priceDelta ? (
                      <span className="price">+{fmtWon(opt.priceDelta)}</span>
                    ) : (
                      <span className="price">기본</span>
                    )}
                  </OptionSelectBtn>
                );
              })}
            </OptionSelectList>
          </OptionGroupWrap>
        ))}

        {/* 수량 선택기 */}
        <QuantityRow>
          <QuantityLabel>수량 선택</QuantityLabel>
          <QuantityControls>
            <QtyBtn 
              type="button" 
              onClick={() => handleQuantityChange(-1)} 
              disabled={quantity <= 1}
            >
              -
            </QtyBtn>
            <QtyDisplay>{quantity}</QtyDisplay>
            <QtyBtn 
              type="button" 
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 99}
            >
              +
            </QtyBtn>
          </QuantityControls>
        </QuantityRow>
      </PdOptionSection>

      {/* 5. 탭 메뉴 (설명 / 스펙 / 리뷰) */}
      <PdTabs>
        <TabButton 
          type="button" 
          className={activeTab === 'desc' ? 'is-active' : ''}
          onClick={() => setActiveTab('desc')}
        >
          상품설명
        </TabButton>
        <TabButton 
          type="button" 
          className={activeTab === 'spec' ? 'is-active' : ''}
          onClick={() => setActiveTab('spec')}
        >
          스펙
        </TabButton>
        <TabButton 
          type="button" 
          className={activeTab === 'review' ? 'is-active' : ''}
          onClick={() => setActiveTab('review')}
        >
          리뷰({product.reviews?.length || product.reviewCount})
        </TabButton>
      </PdTabs>

      {/* 탭 컨텐츠 */}
      <TabContentWrap>
        {activeTab === 'desc' && (
          <DescContent>
            <p>{product.description}</p>
            <FeatureCard>
              <h4>✨ 가상 쇼핑 체크 포인트</h4>
              <ul>
                <li>실제 결제가 발생하지 않아 안심하고 체험할 수 있어요.</li>
                <li>구매 완료 시 가상 배송 추적 화면에서 진행 상황을 확인해보세요.</li>
                <li>절약한 금액은 대시보드의 저축 목표에 기여할 수 있습니다.</li>
              </ul>
            </FeatureCard>
          </DescContent>
        )}

        {activeTab === 'spec' && (
          <SpecContent>
            {product.specs && product.specs.length > 0 ? (
              <SpecTable>
                <tbody>
                  {product.specs.map(spec => (
                    <tr key={spec.label}>
                      <th>{spec.label}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </SpecTable>
            ) : (
              <p className="empty-spec">상세 스펙 정보가 준비 중입니다.</p>
            )}
          </SpecContent>
        )}

        {activeTab === 'review' && (
          <ReviewContent>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map(rev => (
                <ReviewCard key={rev.id}>
                  <ReviewHeader>
                    <strong>{rev.author}</strong>
                    <ReviewRating>★ {rev.rating}</ReviewRating>
                    <ReviewDate>{rev.date}</ReviewDate>
                  </ReviewHeader>
                  <ReviewBody>{rev.content}</ReviewBody>
                </ReviewCard>
              ))
            ) : (
              <ReviewCard>
                <ReviewHeader>
                  <strong>쇼퍼holic</strong>
                  <ReviewRating>★ 5.0</ReviewRating>
                  <ReviewDate>최근 리뷰</ReviewDate>
                </ReviewHeader>
                <ReviewBody>
                  가상 쇼핑으로 사고 싶었던 물건을 마음껏 담아보니 충동구매가 확실히 줄어들었어요! 강추합니다.
                </ReviewBody>
              </ReviewCard>
            )}
          </ReviewContent>
        )}
      </TabContentWrap>

      {/* 6. 하단 고정 CTA 구매 바 */}
      <BottomCtaBar>
        <CtaPriceSummary>
          <CtaSavedLabel>총 {fmtWon(totalSaved)} 절약</CtaSavedLabel>
          <CtaTotalPrice>{fmtWon(totalPrice)}</CtaTotalPrice>
        </CtaPriceSummary>
        <BuyButton type="button" onClick={handlePurchase}>
          가상 구매하기
        </BuyButton>
      </BottomCtaBar>
    </PdContainer>
  );
};

// === styled-components ===

const PdContainer = styled.main`
  padding: 8px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PdNotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
`;

const NotFoundIcon = styled.div`
  font-size: 50px;
  margin-bottom: 16px;
`;

const NotFoundTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const NotFoundDesc = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const BackBtn = styled(Link)`
  padding: 12px 24px;
  background: #1E1F2E;
  color: #FFFFFF;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
`;

const PdHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  min-height: 44px;
`;

const HeaderBack = styled.button`
  position: fixed;
  left: calc(50% - 200px);
  top: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(30, 31, 46, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  z-index: 99;
  transition: background-color 0.2s, transform 0.15s;

  @media (max-width: 480px) {
    left: 16px;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }

  &:hover {
    background: rgba(30, 31, 46, 0.65);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HeaderActions = styled.div`
  position: absolute;
  right: 0;
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
    transition: all 0.2s;

    svg {
      width: 22px;
      height: 22px;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.border};
    }
  }
`;

const PdImageWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 80%;
  border-radius: 20px;
  overflow: hidden;
  background: #F3F4F6;
  box-shadow: ${({ theme }) => theme.shadows.card};

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  background: #FF5C5C;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 8px;
`;

const CardBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 8px;
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

const PdInfoSection = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const BrandName = styled.span`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CategoryBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brandYellow};
  background: rgba(255, 174, 0, 0.1);
  padding: 2px 8px;
  border-radius: 999px;
`;

const ProductName = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  margin-bottom: 8px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const StarIcon = styled.span`
  color: #FFAE00;
  font-size: 13px;
`;

const RatingScore = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReviewCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PriceSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OriginalPriceWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OriginalPrice = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;

const DiscountRate = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: #FF5C5C;
`;

const FinalPriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FinalPrice = styled.span`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;


const PdOptionSection = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OptionGroupWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionGroupTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RequiredTag = styled.span`
  font-size: 10.5px;
  color: #FF5C5C;
  font-weight: 600;
`;

const ColorList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ColorButton = styled.button<{ colorHex: string }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: ${({ colorHex }) => colorHex};
  border: 2px solid #ECEDF1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, border-color 0.15s;

  svg {
    width: 14px;
    height: 14px;
  }

  &.is-selected {
    transform: scale(1.15);
    border-color: #FFAE00;
    box-shadow: 0 0 0 2px rgba(255, 174, 0, 0.3);
  }
`;

const OptionSelectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const OptionSelectBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 12.5px;
  cursor: pointer;
  transition: all 0.2s;

  .price {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &.is-selected {
    border-color: #FFAE00;
    background: rgba(255, 174, 0, 0.08);
    font-weight: 700;

    .price {
      color: #FFAE00;
    }
  }
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const QuantityLabel = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const QtyBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QtyDisplay = styled.span`
  width: 36px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PdTabs = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &.is-active {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 800;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #FFAE00;
    }
  }
`;

const TabContentWrap = styled.div`
  padding: 4px 0;
`;

const DescContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 14px;
  padding: 14px 16px;
  border: 1px dashed ${({ theme }) => theme.colors.border};

  h4 {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #FFAE00;
  }

  ul {
    padding-left: 18px;
    font-size: 12.5px;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.5;
  }
`;

const SpecContent = styled.div`
  .empty-spec {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
    padding: 20px 0;
  }
`;

const SpecTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 10px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    width: 35%;
    text-align: left;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
    background: rgba(0, 0, 0, 0.02);
  }

  td {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReviewCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  strong {
    font-size: 12.5px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ReviewRating = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #FFAE00;
`;

const ReviewDate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: auto;
`;

const ReviewBody = styled.p`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BottomCtaBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  background: ${({ theme }) => theme.colors.cardBackground};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.bottomSheet};
  z-index: 90;
`;

const CtaPriceSummary = styled.div`
  display: flex;
  flex-direction: column;
`;

const CtaSavedLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #2F9E6E;
`;

const CtaTotalPrice = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BuyButton = styled.button`
  padding: 12px 24px;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 14.5px;
  font-weight: 800;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 320px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const ModalDesc = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 20px;

  strong {
    color: #2F9E6E;
  }
`;

const ModalConfirmBtn = styled.button`
  width: 100%;
  padding: 12px 0;
  background: #1E1F2E;
  color: #FFAE00;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
