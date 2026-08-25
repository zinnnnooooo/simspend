import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { VirtualPurchase } from '@/@types';

export interface ShoppingPaymentState {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  image: string;
  selectedColor?: string;
  selectedOptionsText?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  totalSaved: number;
  originalPrice: number;
}

export const ShoppingPayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addVirtualPurchase } = useLedger();

  const orderData = location.state as ShoppingPaymentState | null;

  // 주문 폼 상태
  const [userName, setUserName] = useState('홍길동');
  const [phone, setPhone] = useState('010-1234-5678');
  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 152');
  const [detailAddress, setDetailAddress] = useState('강남파이낸스센터 12층');
  const [deliveryMemo, setDeliveryMemo] = useState('문 앞에 두고 벨 눌러주세요');
  const [paymentMethod, setPaymentMethod] = useState<'easy' | 'card' | 'transfer'>('easy');
  const [easyPayProvider, setEasyPayProvider] = useState<'toss' | 'kakao' | 'naver'>('toss');
  const [isProcessing, setIsProcessing] = useState(false);

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 데이터가 없을 경우
  if (!orderData) {
    return (
      <SpNotFound>
        <SpNotFoundIcon>⚠️</SpNotFoundIcon>
        <SpNotFoundTitle>주문 정보를 찾을 수 없습니다</SpNotFoundTitle>
        <SpNotFoundDesc>상품 상세 페이지에서 다시 주문을 진행해주세요.</SpNotFoundDesc>
        <BackBtn to="/shopping">가상 쇼핑 홈으로</BackBtn>
      </SpNotFound>
    );
  }

  // 가상 결제 제출 핸들러
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    const purchaseItem: VirtualPurchase = {
      id: `virtual-${Date.now()}`,
      productId: orderData.productId,
      image: orderData.image,
      productName: orderData.quantity > 1 ? `${orderData.productName} (${orderData.quantity}개)` : orderData.productName,
      category: orderData.category,
      brand: orderData.brand,
      color: orderData.selectedColor || '기본',
      price: orderData.totalPrice,
      memo: orderData.selectedOptionsText 
        ? `[옵션: ${orderData.selectedOptionsText}] [받는분: ${userName}] [주소: ${address} ${detailAddress}]` 
        : `[받는분: ${userName}] [주소: ${address} ${detailAddress}]`,
      status: 'payment_pending',
      createdAt: new Date().toISOString()
    };

    addVirtualPurchase(purchaseItem);

    setTimeout(() => {
      setIsProcessing(false);
      navigate('/delivery-status', { state: { price: orderData.totalPrice } }); // 가상 배송 진행 완료 화면으로 이동
    }, 600);
  };

  return (
    <SpContainer onSubmit={handlePaymentSubmit}>
      {/* 1. 상단 헤더 */}
      <SpHeader>
        <HeaderBack type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </HeaderBack>
        <HeaderTitle>가상 주문/결제</HeaderTitle>
        <HeaderClose type="button" onClick={() => navigate('/shopping')} aria-label="쇼핑 홈으로 닫기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </HeaderClose>
      </SpHeader>

      {/* 안심 배너 */}
      <SafeAlert>
        <SafeIcon>🛡️</SafeIcon>
        <SafeText>
          <strong>가상 결제 모드</strong><br />
          실제 금융 결제나 과금은 발생하지 않으니 안심하세요!
        </SafeText>
      </SafeAlert>

      {/* 2. 주문 상품 정보 요약 카드 */}
      <SectionCard>
        <SectionTitle>주문 상품 정보</SectionTitle>
        <ProductSummaryRow>
          <ProductThumb src={orderData.image} alt={orderData.productName} />
          <ProductInfoBox>
            <ProductBrand>{orderData.brand}</ProductBrand>
            <ProductName>{orderData.productName}</ProductName>
            <ProductOptionTags>
              {orderData.selectedColor && <OptionTag>색상: {orderData.selectedColor}</OptionTag>}
              {orderData.selectedOptionsText && <OptionTag>{orderData.selectedOptionsText}</OptionTag>}
              <OptionTag>수량: {orderData.quantity}개</OptionTag>
            </ProductOptionTags>
            <ProductPriceBox>
              <OriginalPrice>{fmtWon(orderData.originalPrice * orderData.quantity)}</OriginalPrice>
              <FinalPrice>{fmtWon(orderData.totalPrice)}</FinalPrice>
            </ProductPriceBox>
          </ProductInfoBox>
        </ProductSummaryRow>
      </SectionCard>

      {/* 3. 주문자 정보 */}
      <SectionCard>
        <SectionTitle>주문자 정보</SectionTitle>
        <FormGroup>
          <FormLabel>이름</FormLabel>
          <FormInput 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="주문자 성함"
            required 
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>연락처</FormLabel>
          <FormInput 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="010-0000-0000"
            required 
          />
        </FormGroup>
      </SectionCard>

      {/* 4. 배송지 정보 */}
      <SectionCard>
        <SectionTitle>배송지 정보</SectionTitle>
        <FormGroup>
          <FormLabel>기본 주소</FormLabel>
          <FormInput 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="도로명 주소 또는 지번 주소"
            required 
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>상세 주소</FormLabel>
          <FormInput 
            type="text" 
            value={detailAddress} 
            onChange={(e) => setDetailAddress(e.target.value)} 
            placeholder="동/호수, 층수 등 상세 주소"
            required 
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>배송 요청사항</FormLabel>
          <FormSelect 
            value={deliveryMemo} 
            onChange={(e) => setDeliveryMemo(e.target.value)}
          >
            <option value="문 앞에 두고 벨 눌러주세요">문 앞에 두고 벨 눌러주세요</option>
            <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
            <option value="배송 전 미리 연락바랍니다">배송 전 미리 연락바랍니다</option>
            <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
            <option value="직접 수령하겠습니다">직접 수령하겠습니다</option>
          </FormSelect>
        </FormGroup>
      </SectionCard>

      {/* 5. 결제 수단 선택 */}
      <SectionCard>
        <SectionTitle>결제 수단</SectionTitle>
        <PaymentMethodGrid>
          <MethodButton 
            type="button" 
            className={paymentMethod === 'easy' ? 'is-active' : ''}
            onClick={() => setPaymentMethod('easy')}
          >
            <span className="icon">⚡</span>
            <span>간편결제</span>
          </MethodButton>
          <MethodButton 
            type="button" 
            className={paymentMethod === 'card' ? 'is-active' : ''}
            onClick={() => setPaymentMethod('card')}
          >
            <span className="icon">💳</span>
            <span>신용/체크카드</span>
          </MethodButton>
          <MethodButton 
            type="button" 
            className={paymentMethod === 'transfer' ? 'is-active' : ''}
            onClick={() => setPaymentMethod('transfer')}
          >
            <span className="icon">🏦</span>
            <span>계좌이체</span>
          </MethodButton>
        </PaymentMethodGrid>

        {paymentMethod === 'easy' && (
          <EasyPaySubGrid>
            <EasyPayItem 
              type="button"
              className={easyPayProvider === 'toss' ? 'is-active' : ''}
              onClick={() => setEasyPayProvider('toss')}
            >
              💙 토스페이
            </EasyPayItem>
            <EasyPayItem 
              type="button"
              className={easyPayProvider === 'kakao' ? 'is-active' : ''}
              onClick={() => setEasyPayProvider('kakao')}
            >
              💛 카카오페이
            </EasyPayItem>
            <EasyPayItem 
              type="button"
              className={easyPayProvider === 'naver' ? 'is-active' : ''}
              onClick={() => setEasyPayProvider('naver')}
            >
              💚 네이버페이
            </EasyPayItem>
          </EasyPaySubGrid>
        )}
      </SectionCard>

      {/* 6. 최종 결제 금액 계산 요약 */}
      <SectionCard>
        <SectionTitle>결제 금액 요약</SectionTitle>
        <ReceiptRow>
          <ReceiptLabel>정가 금액</ReceiptLabel>
          <ReceiptValue>{fmtWon(orderData.originalPrice * orderData.quantity)}</ReceiptValue>
        </ReceiptRow>
        <ReceiptRow>
          <ReceiptLabel>가상 쇼핑 혜택 할인</ReceiptLabel>
          <ReceiptDiscount>- {fmtWon(orderData.totalSaved)}</ReceiptDiscount>
        </ReceiptRow>
        <ReceiptRow>
          <ReceiptLabel>배송비</ReceiptLabel>
          <ReceiptFree>무료배송</ReceiptFree>
        </ReceiptRow>
        <Divider />
        <TotalRow>
          <TotalLabel>최종 결제 금액</TotalLabel>
          <TotalValue>{fmtWon(orderData.totalPrice)}</TotalValue>
        </TotalRow>
        <SavedNotice>
          이번 가상 구매로 <strong>{fmtWon(orderData.totalSaved)}</strong>을 절약했어요! 🎉
        </SavedNotice>
      </SectionCard>

      {/* 7. 하단 고정 결제 CTA */}
      <BottomActionWrap>
        <PaymentSubmitBtn type="submit" disabled={isProcessing}>
          {isProcessing ? '가상 결제 처리 중...' : `${fmtWon(orderData.totalPrice)} 가상 결제하기`}
        </PaymentSubmitBtn>
      </BottomActionWrap>
    </SpContainer>
  );
};

// === styled-components ===

const SpContainer = styled.form`
  padding: 8px 20px 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SpNotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
`;

const SpNotFoundIcon = styled.div`
  font-size: 50px;
  margin-bottom: 16px;
`;

const SpNotFoundTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const SpNotFoundDesc = styled.p`
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

const SpHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;

const HeaderBack = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 50%;
  cursor: pointer;
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

const HeaderClose = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const SafeAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(255, 174, 0, 0.12) 0%, rgba(255, 174, 0, 0.05) 100%);
  border: 1px solid rgba(255, 174, 0, 0.3);
  border-radius: 14px;
  padding: 12px 16px;
`;

const SafeIcon = styled.div`
  font-size: 22px;
  flex: none;
`;

const SafeText = styled.p`
  font-size: 12.5px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textPrimary};

  strong {
    color: #E69500;
    font-weight: 700;
  }
`;

const SectionCard = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 18px;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const ProductSummaryRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const ProductThumb = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
  flex: none;
  background: #F3F4F6;
`;

const ProductInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const ProductBrand = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProductName = styled.p`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductOptionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 2px 0;
`;

const OptionTag = styled.span`
  font-size: 10.5px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductPriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const OriginalPrice = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;

const FinalPrice = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13.5px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13.5px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const MethodButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  .icon {
    font-size: 20px;
  }

  &.is-active {
    border-color: #FFAE00;
    background: rgba(255, 174, 0, 0.08);
    color: #1E1F2E;
    font-weight: 700;
  }
`;

const EasyPaySubGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 4px;
`;

const EasyPayItem = styled.button`
  padding: 8px 6px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;

  &.is-active {
    border-color: #1E1F2E;
    background: #1E1F2E;
    color: #FFAE00;
  }
`;

const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const ReceiptLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReceiptValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReceiptDiscount = styled.span`
  font-weight: 700;
  color: #FF5C5C;
`;

const ReceiptFree = styled.span`
  font-weight: 700;
  color: #2F9E6E;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 4px 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TotalValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #FFAE00;
`;

const SavedNotice = styled.p`
  font-size: 12px;
  text-align: right;
  color: #2F9E6E;
  font-weight: 600;

  strong {
    font-weight: 800;
  }
`;

const BottomActionWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  background: ${({ theme }) => theme.colors.cardBackground};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.bottomSheet};
  z-index: 90;
`;

const PaymentSubmitBtn = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 15px;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
