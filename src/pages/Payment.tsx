import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';

interface PaymentState {
  storeId: string;
  storeName: string;
  menuName: string;
  quantity: number;
  totalPrice: number;
  selectedDetails: string[];
  comment?: string;
}

export const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addTransaction } = useLedger();

  // 이전 페이지에서 넘어온 데이터 바인딩
  const orderData = location.state as PaymentState | null;

  // 폼 상태
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('010-0000-0000');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');

  if (!orderData) {
    return (
      <PayContainer style={{ padding: '16px' }}>
        <PageHeader>
          <BackButton onClick={() => navigate('/delivery')} aria-label="뒤로가기">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <HeaderTitle>주문 정보 유실</HeaderTitle>
        </PageHeader>
        <EmptyText>비정상적인 접근입니다. 다시 주문을 시도해 주세요.</EmptyText>
      </PayContainer>
    );
  }

  // 결제 완료 처리
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // 옵션 세부 정보 직렬화
    const optionsText = orderData.selectedDetails.join(', ');
    let memoText = optionsText 
      ? `${orderData.storeName} - ${orderData.menuName} x${orderData.quantity} (${optionsText})` 
      : `${orderData.storeName} - ${orderData.menuName} x${orderData.quantity}`;
      
    if (orderData.comment?.trim()) {
      memoText += ` [요청: ${orderData.comment}]`;
    }
    
    // 가계부 기록 작성
    addTransaction({
      id: `tx_delivery_${Date.now()}`,
      date: dateStr,
      type: 'expense',
      category: '식비',
      paymentMethod: paymentMethod === 'card' ? '카드' : '현금',
      amount: orderData.totalPrice,
      memo: memoText,
      icon: 'food',
      createdAt: today.toISOString()
    });

    // 가상 배송 확인 화면으로 라우팅
    navigate('/delivery-status', { state: { price: orderData.totalPrice } });
  };

  const fmtWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  return (
    <PayContainer onSubmit={handlePaymentSubmit}>
      {/* 헤더 */}
      <PageHeader>
        <BackButton type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>결제하기</HeaderTitle>
        <ExitButton type="button" onClick={() => navigate('/')} aria-label="닫기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6 6 18M6 6l12 12" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ExitButton>
      </PageHeader>

      {/* 1. 주문자 정보 */}
      <FormSectionCard>
        <SectionTitle>주문자 정보</SectionTitle>
        <FormGroup>
          <label>성함</label>
          <input 
            type="text" 
            placeholder="이름을 입력하세요" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
          />
        </FormGroup>
        <FormGroup>
          <label>전화번호</label>
          <input 
            type="tel" 
            placeholder="010-0000-0000" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </FormGroup>
      </FormSectionCard>

      {/* 2. 배달 주소 */}
      <FormSectionCard>
        <SectionTitle>배달 주소</SectionTitle>
        <FormGroup>
          <label>주소</label>
          <input 
            type="text" 
            placeholder="주소를 입력하세요" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
          />
        </FormGroup>
        <FormGroup>
          <label>상세 주소</label>
          <input 
            type="text" 
            placeholder="상세 주소를 입력하세요 (동, 호수 등)" 
            value={detailAddress} 
            onChange={(e) => setDetailAddress(e.target.value)} 
          />
        </FormGroup>
      </FormSectionCard>

      {/* 3. 주문 내역 */}
      <FormSectionCard>
        <SectionTitle>주문 내역</SectionTitle>
        <OrderDetailBox>
          <div className="order-main-row">
            <span className="menu-name-qty">
              {orderData.menuName} (x{orderData.quantity})
            </span>
            <span className="price-bold">{fmtWon(orderData.totalPrice)}</span>
          </div>
          {orderData.selectedDetails.length > 0 && (
            <ul className="options-list">
              {orderData.selectedDetails.map((opt, i) => (
                <li key={i}>- {opt}</li>
              ))}
            </ul>
          )}
        </OrderDetailBox>
      </FormSectionCard>

      {/* 4. 결제 수단 */}
      <FormSectionCard>
        <SectionTitle>결제 수단</SectionTitle>
        <PaymentMethodList>
          {/* 신용/체크카드 */}
          <MethodRow 
            $selected={paymentMethod === 'card'} 
            onClick={() => setPaymentMethod('card')}
          >
            <div className="method-label">
              <div className={`radio-outer ${paymentMethod === 'card' ? 'is-selected' : ''}`}>
                <div className="radio-inner" />
              </div>
              {/* 신용카드 아이콘 */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="method-icon">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
              <span className="name">신용/체크카드</span>
            </div>
          </MethodRow>

          {/* 계좌이체/현금 */}
          <MethodRow 
            $selected={paymentMethod === 'transfer'} 
            onClick={() => setPaymentMethod('transfer')}
          >
            <div className="method-label">
              <div className={`radio-outer ${paymentMethod === 'transfer' ? 'is-selected' : ''}`}>
                <div className="radio-inner" />
              </div>
              {/* 은행 빌딩 아이콘 */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="method-icon">
                <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M2 11h20M12 2 2 7h20Z"/>
              </svg>
              <span className="name">계좌이체/현금</span>
            </div>
          </MethodRow>
        </PaymentMethodList>
      </FormSectionCard>

      {/* 5. 총 결제 금액 */}
      <FormSectionCard>
        <TotalAmountRow>
          <span className="label">총 결제 금액</span>
          <span className="value">{fmtWon(orderData.totalPrice)}</span>
        </TotalAmountRow>
      </FormSectionCard>

      {/* 하단 고정 가상 결제하기 버튼 바 */}
      <BottomStickyBar>
        <SubmitPaymentBtn type="submit">
          {fmtWon(orderData.totalPrice)} 가상 결제하기
        </SubmitPaymentBtn>
      </BottomStickyBar>
    </PayContainer>
  );
};

// Styled Components
const PayContainer = styled.form`
  padding: 8px 16px 140px; /* 결제 버튼바를 감안한 여유 하단 패딩 */
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: #1A1C29;
  background: transparent;
  border: none;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ExitButton = styled.button`
  position: absolute;
  right: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A1C29;
  background: transparent;
  border: none;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 17px;
  font-weight: 850;
  color: #1A1C29;
`;

const FormSectionCard = styled.section`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #ECEEF0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 14.5px;
  font-weight: 850;
  color: #1A1C29;
  border-bottom: 1.5px solid #F1F3F5;
  padding-bottom: 10px;
  margin-bottom: 2px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 11px;
    font-weight: 700;
    color: #8C92A0;
  }

  input {
    width: 100%;
    border-radius: 12px;
    border: 1.5px solid #EAECEF;
    background: #ffffff;
    padding: 14px 16px;
    font-size: 13.5px;
    font-weight: 600;
    color: #1A1C29;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;

    &::placeholder {
      color: #A0A5B1;
    }

    &:focus {
      border-color: #233142;
    }
  }
`;

const OrderDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .order-main-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .menu-name-qty {
    font-size: 14.5px;
    font-weight: 800;
    color: #1A1C29;
  }

  .price-bold {
    font-size: 15px;
    font-weight: 850;
    color: #1A1C29;
  }

  .options-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;

    li {
      font-size: 12px;
      color: #8C92A0;
      font-weight: 600;
    }
  }
`;

const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MethodRow = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid ${({ $selected }) => ($selected ? '#FFE8B8' : '#EAECEF')};
  background: ${({ $selected }) => ($selected ? '#FFF7E6' : '#ffffff')};
  cursor: pointer;
  transition: all 0.15s;

  .method-label {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .radio-outer {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid ${({ $selected }) => ($selected ? '#233142' : '#CBD5E1')};
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    &.is-selected {
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

  .method-icon {
    width: 18px;
    height: 18px;
    color: #2F384C;
  }

  .name {
    font-size: 13.5px;
    font-weight: 700;
    color: #1A1C29;
  }
`;

const TotalAmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 14px;
    font-weight: 800;
    color: #1A1C29;
  }

  .value {
    font-size: 20px;
    font-weight: 900;
    color: #FF5A5A;
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
  border-radius: 20px;
  box-shadow: 0 -8px 24px rgba(43, 45, 66, 0.08), 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 14px 16px;
  z-index: 30;
  box-sizing: border-box;
`;

const SubmitPaymentBtn = styled.button`
  width: 100%;
  background: #233142;
  color: #ffffff;
  font-size: 15.5px;
  font-weight: 850;
  padding: 16px 0;
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
