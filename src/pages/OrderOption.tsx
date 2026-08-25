import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { mockStores, OptionGroup } from '@/data/mockStores';

export const OrderOption: React.FC = () => {
  const { storeId, menuName } = useParams<{ storeId: string; menuName: string }>();
  const navigate = useNavigate();
  const { addTransaction } = useLedger();

  const store = mockStores.find((s) => s.id === storeId);
  const menu = store?.menus?.find((m) => m.name === menuName);

  // 기본 공통 음료 선택 그룹 (모든 메뉴 공통 제공)
  const drinkGroup: OptionGroup = {
    name: '음료 추가 (선택)',
    required: false,
    options: [
      { name: '콜라', price: 2000 },
      { name: '제일제당 사이다', price: 2000 },
      { name: '제로콜라', price: 2500 }
    ]
  };

  // 모든 옵션 그룹 결합 (카페 카테고리가 아닐 때만 공통 음료/주류 추가)
  const isCafe = store?.category === '카페';
  const customGroups = menu?.optionGroups || [];
  const allOptionGroups = isCafe
    ? customGroups
    : [...customGroups, drinkGroup];

  // 상태 관리
  const [selectedRequired, setSelectedRequired] = useState<Record<string, string>>({}); // 필수 옵션
  const [checkedOptionals, setCheckedOptionals] = useState<string[]>([]); // 선택 옵션 (포맷: "groupName::optionName")
  const [quantity, setQuantity] = useState(1); // 수량
  const [comment, setComment] = useState(''); // 요청 사항

  // 필수 옵션 그룹 기본값 초기화
  useEffect(() => {
    if (menu) {
      const initial: Record<string, string> = {};
      allOptionGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          initial[group.name] = group.options[0].name; // 첫 번째 옵션을 기본 선택으로 설정
        }
      });
      setSelectedRequired(initial);
      setCheckedOptionals([]);
      setQuantity(1);
      setComment('');
    }
  }, [menuName, storeId]);

  if (!store || !menu) {
    return (
      <OoContainer style={{ padding: '16px' }}>
        <PageHeader>
          <BackButton onClick={() => navigate('/delivery')} aria-label="뒤로가기">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <HeaderTitle>메뉴 정보 없음</HeaderTitle>
        </PageHeader>
        <EmptyText>해당 메뉴 정보를 찾을 수 없습니다.</EmptyText>
      </OoContainer>
    );
  }

  // 가격 계산
  let requiredAddon = 0;
  allOptionGroups.forEach((group) => {
    if (group.required) {
      const selectedName = selectedRequired[group.name];
      if (selectedName) {
        const opt = group.options.find((o) => o.name === selectedName);
        if (opt) requiredAddon += opt.price;
      }
    }
  });

  let optionalAddon = 0;
  checkedOptionals.forEach((key) => {
    const [groupName, optionName] = key.split('::');
    const group = allOptionGroups.find((g) => g.name === groupName);
    if (group) {
      const opt = group.options.find((o) => o.name === optionName);
      if (opt) optionalAddon += opt.price;
    }
  });

  const baseProductPrice = menu.price * quantity;
  const totalOptionsPrice = (requiredAddon + optionalAddon) * quantity;
  const totalPrice = baseProductPrice + totalOptionsPrice;

  // 선택 옵션 체크박스 핸들러
  const handleOptionalChange = (groupName: string, optionName: string) => {
    const key = `${groupName}::${optionName}`;
    if (checkedOptionals.includes(key)) {
      setCheckedOptionals(checkedOptionals.filter((item) => item !== key));
    } else {
      setCheckedOptionals([...checkedOptionals, key]);
    }
  };

  // 주문 전송 핸들러 (결제 페이지로 최종 주문 데이터 바인딩 이동)
  const handleOrderSubmit = () => {
    // 옵션 세부 정보 직렬화
    const selectedDetails: string[] = [];
    allOptionGroups.forEach((group) => {
      if (group.required) {
        const selectedName = selectedRequired[group.name];
        if (selectedName) selectedDetails.push(selectedName);
      }
    });
    checkedOptionals.forEach((key) => {
      const [_, optionName] = key.split('::');
      selectedDetails.push(optionName);
    });

    navigate('/delivery/payment', {
      state: {
        storeId: store.id,
        storeName: store.name,
        menuName: menu.name,
        quantity,
        totalPrice,
        selectedDetails,
        comment
      }
    });
  };

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  return (
    <OoContainer>
      {/* 상단 히어로 배너 이미지 영역 */}
      <HeroBanner>
        <img 
          src={store.image || '/assets/chicken_thumbnail.png'} 
          alt={menu.name} 
          className="hero-img" 
        />
        <div className="hero-overlay" />
        <HeaderOverlayBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </HeaderOverlayBtn>
      </HeroBanner>

      {/* 메뉴 헤더 요약 정보 카드 */}
      <MenuInfoCard>
        <span className="badge-best">Best</span>
        <span className="store-name-sub">{store.name}</span>
        <h1 className="menu-name">{menu.name}</h1>
        <p className="menu-desc">{menu.desc}</p>
        <div className="menu-rating-row">
          <span className="star">★ {store.rating}</span>
          <span className="divider">·</span>
          <span className="reviews">리뷰 {store.reviewCount}개</span>
          <span className="price-bold">{fmtWon(menu.price)}</span>
        </div>
      </MenuInfoCard>

      {/* 동적 옵션 그룹 리스트 렌더링 */}
      {allOptionGroups.map((group) => {
        if (group.required) {
          // 필수 옵션 그룹 (라디오 버튼)
          return (
            <OptionCardSection key={group.name}>
              <SectionTitleRow>
                <span className="title">{group.name} (필수)</span>
              </SectionTitleRow>
              <OptionList>
                {group.options.map((opt) => (
                  <OptionRow 
                    key={opt.name} 
                    onClick={() => setSelectedRequired({ ...selectedRequired, [group.name]: opt.name })}
                  >
                    <div className="option-label">
                      <div className={`radio-outer ${selectedRequired[group.name] === opt.name ? 'is-selected' : ''}`}>
                        <div className="radio-inner" />
                      </div>
                      <span className="name">{opt.name}</span>
                    </div>
                    <span className="price">
                      {opt.price > 0 ? `+${fmtWon(opt.price)}` : ''}
                    </span>
                  </OptionRow>
                ))}
              </OptionList>
            </OptionCardSection>
          );
        } else {
          // 선택 옵션 그룹 (체크박스)
          return (
            <OptionCardSection key={group.name}>
              <SectionTitleRow>
                <span className="title">{group.name} (선택)</span>
              </SectionTitleRow>
              <OptionList>
                {group.options.map((opt) => {
                  const key = `${group.name}::${opt.name}`;
                  const isChecked = checkedOptionals.includes(key);
                  return (
                    <OptionRow 
                      key={opt.name} 
                      onClick={() => handleOptionalChange(group.name, opt.name)}
                    >
                      <div className="option-label">
                        <div className={`checkbox-box ${isChecked ? 'is-checked' : ''}`}>
                          {isChecked && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <span className="name">{opt.name}</span>
                      </div>
                      <span className="price">+{fmtWon(opt.price)}</span>
                    </OptionRow>
                  );
                })}
              </OptionList>
            </OptionCardSection>
          );
        }
      })}

      {/* 사장님께 요청사항 입력 카드 */}
      <CommentCardSection>
        <span className="title">가게 사장님께</span>
        <textarea 
          placeholder="요청사항이 있다면 입력해주세요." 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </CommentCardSection>

      {/* 수량 선택 카드 */}
      <QuantityCardSection>
        <span className="quantity-label">수량</span>
        <QuantitySelector>
          <button 
            type="button" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="quantity-val">{quantity}</span>
          <button 
            type="button" 
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </QuantitySelector>
      </QuantityCardSection>

      {/* 하단 고정 금액 요약 및 구매/장바구니 2버튼 액션 바 */}
      <BottomStickyBar>
        {/* 요약 명세서 */}
        <PricingSummaryTable>
          <div className="summary-row">
            <span className="label">상품 금액</span>
            <span className="value">{fmtWon(baseProductPrice)}</span>
          </div>
          <div className="summary-row">
            <span className="label">옵션 금액</span>
            <span className="value">+{fmtWon(totalOptionsPrice)}</span>
          </div>
          <div className="summary-row is-total">
            <span className="label">총 금액</span>
            <span className="value">{fmtWon(totalPrice)}</span>
          </div>
        </PricingSummaryTable>

        {/* 2버튼 액션 단추 */}
        <CartActionsRow>
          <CartOutlineBtn onClick={handleOrderSubmit}>
            장바구니
          </CartOutlineBtn>
          <BuyDirectBtn onClick={handleOrderSubmit}>
            바로 구매
          </BuyDirectBtn>
        </CartActionsRow>
      </BottomStickyBar>
    </OoContainer>
  );
};

// Styled Components
const OoContainer = styled.main`
  padding: 0 0 240px; /* 명세서 포함 고정바가 크므로 하단 패딩 여유 있게 부여 */
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
  padding: 12px 0;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
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

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 800;
  color: #2b2d42;
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
    background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 100%);
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

const MenuInfoCard = styled.div`
  margin: -32px 16px 0;
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 10px 30px rgba(43, 45, 66, 0.04);
  border: 1px solid #ECEEF0;
  z-index: 15;
  display: flex;
  flex-direction: column;

  .badge-best {
    align-self: flex-start;
    font-size: 9px;
    font-weight: 800;
    color: #ffffff;
    background: #233142;
    padding: 3px 7px;
    border-radius: 4px;
    margin-bottom: 6px;
  }

  .store-name-sub {
    font-size: 11px;
    color: #8C92A0;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .menu-name {
    font-size: 20px;
    font-weight: 850;
    color: #1A1C29;
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  .menu-desc {
    font-size: 12.5px;
    color: #8B8D9B;
    line-height: 1.45;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .menu-rating-row {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 700;

    .star {
      color: #FF5A5A;
    }

    .divider {
      color: #E2E8F0;
      margin: 0 6px;
    }

    .reviews {
      color: #8C92A0;
    }

    .price-bold {
      margin-left: auto;
      font-size: 17px;
      font-weight: 900;
      color: #1A1C29;
    }
  }
`;

const OptionCardSection = styled.section`
  margin: 16px 16px 0;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #ECEEF0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitleRow = styled.div`
  .title {
    font-size: 14.5px;
    font-weight: 850;
    color: #1A1C29;
  }
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const OptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 2px 0;

  .option-label {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* 커스텀 라디오 */
  .radio-outer {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #CBD5E1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    &.is-selected {
      border-color: #233142;
      background: #233142;

      .radio-inner {
        background: #ffffff;
      }
    }
  }

  .radio-inner {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: transparent;
  }

  /* 커스텀 체크박스 */
  .checkbox-box {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    border: 2px solid #CBD5E1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    &.is-checked {
      border-color: #233142;
      background: #233142;
    }
  }

  .name {
    font-size: 14px;
    color: #2B2D42;
    font-weight: 700;
  }

  .price {
    font-size: 13px;
    color: #8C92A0;
    font-weight: 700;
  }
`;

const CommentCardSection = styled.section`
  margin: 16px 16px 0;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #ECEEF0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    font-size: 14.5px;
    font-weight: 850;
    color: #1A1C29;
  }

  textarea {
    width: 100%;
    height: 80px;
    border-radius: 12px;
    border: 1.5px solid #EAECEF;
    background: #F8F9FA;
    padding: 12px;
    font-size: 13px;
    font-weight: 600;
    color: #1A1C29;
    resize: none;
    outline: none;
    box-sizing: border-box;
    font-family: inherit;

    &::placeholder {
      color: #A0A5B1;
    }

    &:focus {
      border-color: #233142;
      background: #ffffff;
    }
  }
`;

const QuantityCardSection = styled.div`
  margin: 16px 16px 0;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #ECEEF0;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .quantity-label {
    font-size: 14.5px;
    font-weight: 850;
    color: #1A1C29;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #F1F3F5;
  padding: 6px 14px;
  border-radius: 12px;

  button {
    font-size: 18px;
    font-weight: 800;
    color: #2B2D42;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      color: #CBD5E1;
      cursor: not-allowed;
    }
  }

  .quantity-val {
    font-size: 14.5px;
    font-weight: 850;
    color: #2B2D42;
    min-width: 16px;
    text-align: center;
  }
`;

const BottomStickyBar = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(16px + env(safe-area-inset-bottom));
  width: calc(100% - 32px);
  max-width: 448px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 -10px 30px rgba(43, 45, 66, 0.09), 0 4px 15px rgba(0, 0, 0, 0.04);
  padding: 16px 20px;
  z-index: 30;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PricingSummaryTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1.5px solid #F1F3F5;
  padding-bottom: 14px;

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 700;
    color: #8C92A0;

    &.is-total {
      margin-top: 4px;
      font-size: 15.5px;
      font-weight: 900;
      color: #1A1C29;

      .value {
        color: #FF5A5A;
      }
    }
  }
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
  color: #8b8d9b;
  font-size: 14px;
  padding: 40px 0;
`;
