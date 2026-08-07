import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { VirtualPurchase } from '@/@types';

export const Purchase: React.FC = () => {
  const navigate = useNavigate();
  const { addVirtualPurchase } = useLedger();

  // 폼 입력 상태
  const [productName, setProductName] = useState('애플 에어팟 맥스');
  const [category, setCategory] = useState('electronics');
  const [brand, setBrand] = useState('Apple');
  const [color, setColor] = useState('실버');
  const [price, setPrice] = useState('769,000');
  const [memo, setMemo] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const onlyDigits = (val: string) => val.replace(/[^0-9]/g, '');
  const formatNumber = (val: string) => Number(val || 0).toLocaleString('ko-KR');

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = onlyDigits(e.target.value);
    setPrice(formatNumber(raw));
  };

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number(onlyDigits(price));
    const purchase: VirtualPurchase = {
      id: `virtual-${Date.now()}`,
      productName: productName.trim(),
      category,
      brand: brand.trim(),
      color,
      price: priceNum,
      memo: memo.trim(),
      status: 'payment_pending',
      createdAt: new Date().toISOString()
    };

    addVirtualPurchase(purchase);

    // 토스트 알림 노출
    setIsToastVisible(true);
  };

  // Toast 노출 후 자동 이동
  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        setIsToastVisible(false);
        navigate('/delivery'); // 가상 결제 완료 후 배송 추적 화면으로 자연스러운 이동
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible, navigate]);

  return (
    <PurchasePage>
      {/* 헤더 */}
      <PageHeader>
        <IconButton type="button" aria-label="이전 화면으로 이동" onClick={handleBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>
        </IconButton>
        <h1>상품 정보</h1>
      </PageHeader>

      {/* 진행 단계 */}
      <Stepper aria-label="구매 진행 단계">
        <Step className="is-current">
          <span className="step__circle">1</span>
          <span className="step__label">정보 입력</span>
        </Step>
        <StepLine />
        <Step>
          <span className="step__circle">2</span>
          <span className="step__label">결제 확인</span>
        </Step>
        <StepLine />
        <Step>
          <span className="step__circle">3</span>
          <span className="step__label">준비 중</span>
        </Step>
        <StepLine />
        <Step>
          <span className="step__circle">4</span>
          <span className="step__label">배송 중</span>
        </Step>
        <StepLine />
        <Step>
          <span className="step__circle">5</span>
          <span className="step__label">도착 완료</span>
        </Step>
      </Stepper>

      {/* 상품 이미지 */}
      <ProductVisual>
        <img src="/assets/airpods-max.jpg" alt="실버 색상의 애플 에어팟 맥스" />
      </ProductVisual>

      {/* 폼 */}
      <PurchaseForm id="purchaseForm" onSubmit={handleSubmit}>
        <FormCard className="form-card--single">
          <label htmlFor="productName">상품명</label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </FormCard>

        <FormGrid>
          <FormCard>
            <label htmlFor="category">카테고리</label>
            <SelectWrap>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="electronics">전자제품</option>
                <option value="fashion">패션</option>
                <option value="beauty">뷰티</option>
                <option value="home">생활용품</option>
                <option value="hobby">취미</option>
              </select>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>
            </SelectWrap>
          </FormCard>

          <FormCard>
            <label htmlFor="brand">브랜드</label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </FormCard>
        </FormGrid>

        <ColorCard>
          <legend>컬러 선택</legend>
          <ColorOptions>
            {[
              { name: '스페이스 그레이', class: 'color-chip--space' },
              { name: '실버', class: 'color-chip--silver' },
              { name: '스카이 블루', class: 'color-chip--sky' },
              { name: '핑크', class: 'color-chip--pink' }
            ].map((c) => (
              <ColorOption
                key={c.name}
                className={color === c.name ? 'is-selected' : ''}
                onClick={() => handleColorSelect(c.name)}
              >
                <input
                  type="radio"
                  name="color"
                  value={c.name}
                  checked={color === c.name}
                  onChange={() => {}}
                />
                <span className={`color-chip ${c.class}`} />
                <span>{c.name}</span>
              </ColorOption>
            ))}
          </ColorOptions>
        </ColorCard>

        <FormCard className="price-card">
          <label htmlFor="price">상품 가격</label>
          <PriceInputWrap>
            <span>₩</span>
            <input
              id="price"
              inputMode="numeric"
              value={price}
              onChange={handlePriceChange}
              aria-describedby="priceHelp"
            />
          </PriceInputWrap>
          <p id="priceHelp" className="sr-only">숫자만 입력하면 천 단위 쉼표가 자동으로 표시됩니다.</p>
        </FormCard>

        <FormCard className="memo-card">
          <label htmlFor="memo">구매 이유 및 메모</label>
          <textarea
            id="memo"
            maxLength={120}
            placeholder="나를 위한 생일 선물, 이번 달 저축 목표 달성 기념"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          <span className="memo-count"><span>{memo.length}</span>/120</span>
        </FormCard>
      </PurchaseForm>

      {/* 최종 결제바 */}
      <CheckoutBar>
        <CheckoutSummary>
          <span>최종 결제 예정 금액</span>
          <strong>₩{price || '0'}</strong>
        </CheckoutSummary>
        <CheckoutButton type="submit" form="purchaseForm">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 9.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 1.9-1.4L21 7H7"/><circle cx="10" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/></svg>
          가상 결제하기
        </CheckoutButton>
      </CheckoutBar>

      {/* 토스트 */}
      <Toast className={isToastVisible ? 'is-visible' : ''} role="status" aria-live="polite">
        가상 구매 정보가 저장되었습니다.
      </Toast>
    </PurchasePage>
  );
};

// Styled Components
const PurchasePage = styled.main`
  padding: 18px 20px 156px;
`;

const PageHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  height: 42px;

  h1 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #2b2d42;
  }
`;

const IconButton = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #2b2d42;

  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const Stepper = styled.section`
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto 1fr auto 1fr auto;
  align-items: start;
  margin: 20px 7px 28px;
`;

const Step = styled.div`
  position: relative;
  z-index: 1;
  width: 50px;
  text-align: center;

  .step__circle {
    width: 32px;
    height: 32px;
    margin: 0 auto 7px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #96a6bb;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
  }

  .step__label {
    display: block;
    white-space: nowrap;
    font-size: 11px;
    color: #777f8b;
  }

  &.is-current {
    .step__circle {
      background: #2b2d42;
    }

    .step__label {
      color: ${({ theme }) => theme.colors.brandYellow};
      font-weight: 700;
    }
  }
`;

const StepLine = styled.div`
  height: 2px;
  margin-top: 16px;
  background: #e4e9ef;
`;

const ProductVisual = styled.section`
  width: 100%;
  height: auto;
  margin-bottom: 30px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: inherit;
  }
`;

const PurchaseForm = styled.form`
  display: grid;
  gap: 15px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

const FormCard = styled.section`
  min-height: 74px;
  padding: 17px 17px 14px;
  overflow: hidden;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.card};

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 12px;
    font-weight: 700;
    color: #252d3c;
  }

  input, select, textarea {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #171d27;
    font-size: 19px;
  }

  &.price-card {
    min-height: 101px;
  }

  &.memo-card {
    position: relative;
    min-height: 145px;

    textarea {
      height: 76px;
      resize: none;
      font-size: 16px;
      line-height: 1.55;

      &::placeholder {
        color: #c2c3c6;
      }
    }

    .memo-count {
      position: absolute;
      right: 17px;
      bottom: 13px;
      font-size: 11px;
      color: #b6bac1;
    }
  }
`;

const SelectWrap = styled.div`
  position: relative;

  select {
    appearance: none;
    padding-right: 24px;
    font-size: 17px;
  }

  svg {
    position: absolute;
    top: 50%;
    right: 0;
    width: 17px;
    height: 17px;
    transform: translateY(-50%);
    fill: none;
    stroke: #b4c2b2;
    stroke-width: 2;
    pointer-events: none;
  }
`;

const ColorCard = styled.fieldset`
  position: relative;
  min-width: 0;
  margin: 0;
  padding: 50px 17px 18px;
  overflow: hidden;
  border: 0;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.card};

  legend {
    position: absolute;
    top: 11px;
    left: 17px;
    width: auto;
    margin: 0;
    padding: 0;
    line-height: 1;
    font-size: 12px;
    font-weight: 700;
    color: #252d3c;
  }
`;

const ColorOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
`;

const ColorOption = styled.label`
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  margin: 0 !important;
  padding-bottom: 4px;
  text-align: center;
  font-size: 11px !important;
  font-weight: 500 !important;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .color-chip {
    width: 38px;
    height: 38px;
    flex: none;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #e5e7eb;
  }

  &.is-selected {
    .color-chip {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.brandYellow};
    }

    span:last-child {
      color: ${({ theme }) => theme.colors.brandYellow};
      font-weight: 700;
    }
  }

  .color-chip--space {
    background: #44464a;
  }

  .color-chip--silver {
    background: linear-gradient(145deg, #d7dadd, #f8f8f8);
  }

  .color-chip--sky {
    background: #9db5c8;
  }

  .color-chip--pink {
    background: #e98777;
  }
`;

const PriceInputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  span, input {
    color: #2b2d42;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
  }
`;

const CheckoutBar = styled.footer`
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 99;
  width: min(100%, 480px);
  transform: translateX(-50%);
  padding: 18px 20px calc(19px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid rgba(24, 34, 53, 0.05);
  backdrop-filter: blur(16px);
`;

const CheckoutSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  span {
    font-size: 15px;
    font-weight: 800;
    color: #1a1d24;
  }

  strong {
    color: ${({ theme }) => theme.colors.brandYellow};
    font-size: 28px;
    line-height: 1;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 20px;
  background: #2b2d42;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  box-shadow: 0 5px 10px rgba(24, 34, 53, 0.2);
  cursor: pointer;

  svg {
    width: 23px;
    height: 23px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 150px;
  z-index: 1000;
  transform: translate(-50%, 16px);
  padding: 12px 17px;
  border-radius: 999px;
  background: rgba(32, 43, 64, 0.95);
  color: #fff;
  font-size: 13px;
  opacity: 0;
  pointer-events: none;
  transition: 0.25s ease;
  white-space: nowrap;

  &.is-visible {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;
