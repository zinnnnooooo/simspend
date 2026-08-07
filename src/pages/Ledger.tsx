import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLedger } from '@/context/LedgerContext';
import { Transaction } from '@/@types';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const ICONS: Record<string, React.ReactNode> = {
  cafe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M16 9.5h1.5a2 2 0 0 1 0 4H16" />
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M4 12h16" />
      <circle cx="8" cy="19" r="1.4" />
      <circle cx="16" cy="19" r="1.4" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 4 8 6v11" />
      <circle cx="6" cy="18" r="2.3" />
      <circle cx="15" cy="16" r="2.3" />
    </svg>
  ),
  food: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3v7M5 3v7M9 3v7M5 10c0 2 .8 3 2 3v8M15 3c-2 0-3 2-3 5s1 5 3 5v8" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  travel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 15.5 3 13l1.6-1.6 4.7 1 3.3-3.3-7-4L7 3.5l9 3 3-3a2 2 0 0 1 2.8 2.8l-3 3 3 9-1.6 1.6-4-7-3.3 3.3 1 4.7L13.5 21l-2.5-7.5Z" />
    </svg>
  )
};

const CATEGORY_ICON_MAP: Record<string, string> = {
  식비: 'food',
  교통: 'bus',
  쇼핑: 'bag',
  구독: 'music',
  의료: 'bag',
  주거: 'home',
  여행: 'travel',
  기타: 'bag'
};

const pad2 = (n: number) => (String(n).length < 2 ? '0' + n : String(n));

export const Ledger: React.FC = () => {
  const navigate = useNavigate();
  const {
    getMonthlyTotal,
    getTransactionsByMonth,
    getDailyTotalsByMonth,
    addTransaction
  } = useLedger();

  // 캘린더 상태
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(10); // 1~12
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 바텀시트 입력 폼 상태
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [txDate, setTxDate] = useState('');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('식비');
  const [txPayment, setTxPayment] = useState('카드');
  const [txMemo, setTxMemo] = useState('');

  const monthKey = `${currentYear}-${pad2(currentMonth)}`;
  const monthlyTotal = getMonthlyTotal(monthKey);
  const dailyTotals = getDailyTotalsByMonth(monthKey);
  const transactions = getTransactionsByMonth(monthKey);

  // 캘린더용 날짜 계산
  const firstWeekday = new Date(currentYear, currentMonth - 1, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
    setSelectedDate(null);
  };

  // 날짜 선택 시 해당 날짜의 내역만 필터링하거나 기본 로직 수행
  const handleCellClick = (dateStr: string) => {
    setSelectedDate(dateStr === selectedDate ? null : dateStr);
  };

  // FAB 클릭 시 시트 열기
  const handleOpenSheet = () => {
    // 오늘 또는 선택된 날짜 기본값 세팅
    const today = new Date();
    const defaultDate = selectedDate || `${monthKey}-${pad2(today.getDate())}`;
    setTxDate(defaultDate);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    // 폼 초기화
    setTxAmount('');
    setTxMemo('');
    setTxCategory('식비');
    setTxType('expense');
    setTxPayment('카드');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(txAmount, 10);
    if (!txDate || isNaN(amountNum) || amountNum <= 0) return;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: txDate,
      type: txType,
      category: txCategory,
      paymentMethod: txPayment,
      amount: amountNum,
      memo: txMemo.trim() || txCategory,
      icon: CATEGORY_ICON_MAP[txCategory] || 'bag',
      createdAt: new Date().toISOString()
    };

    addTransaction(newTx);

    // 새 내역이 등록된 달로 화면 포커스 이동
    const [yearPart, monthPart] = txDate.split('-');
    setCurrentYear(parseInt(yearPart, 10));
    setCurrentMonth(parseInt(monthPart, 10));
    setSelectedDate(txDate);

    handleCloseSheet();
  };

  // 날짜별 그룹핑 가공 (선택한 날짜가 있으면 그 날짜만, 없으면 전체 리스트)
  const filteredTransactions = selectedDate
    ? transactions.filter((tx) => tx.date === selectedDate)
    : transactions;

  const groupedTxs: { date: string; total: number; items: Transaction[] }[] = [];
  const groupMap: Record<string, typeof groupedTxs[0]> = {};

  filteredTransactions.forEach((tx) => {
    if (!groupMap[tx.date]) {
      groupMap[tx.date] = { date: tx.date, total: 0, items: [] };
      groupedTxs.push(groupMap[tx.date]);
    }
    groupMap[tx.date].items.push(tx);
    if (tx.type === 'expense') {
      groupMap[tx.date].total += tx.amount;
    }
  });

  const fmtWon = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');
  const fmtNum = (n: number) => Math.round(n).toLocaleString('ko-KR');
  
  const formatDateHeader = (dateStr: string) => {
    const [, m, d] = dateStr.split('-');
    return `${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
  };

  return (
    <LedgerContainer>
      {/* 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/')} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>가계부</HeaderTitle>
      </PageHeader>

      {/* 이번 달 총 사용 금액 */}
      <LedgerTotal>
        <p className="ledger__total-label">이번 달 총 사용 금액</p>
        <p className="ledger__total-value">{fmtWon(monthlyTotal)}원</p>
      </LedgerTotal>

      {/* 캘린더 */}
      <Card className="calendar-card">
        <CalendarNav>
          <button type="button" className="calendar__nav-btn" onClick={handlePrevMonth} aria-label="이전 달">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="calendar__nav-label">{currentYear}년 {currentMonth}월</span>
          <button type="button" className="calendar__nav-btn" onClick={handleNextMonth} aria-label="다음 달">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </CalendarNav>

        <CalendarWeekdays>
          {WEEKDAY_LABELS.map((w, idx) => (
            <span key={idx}>{w}</span>
          ))}
        </CalendarWeekdays>

        <CalendarGrid>
          {/* 시작 요일 맞추기 위한 빈 칸 */}
          {Array.from({ length: firstWeekday }).map((_, idx) => (
            <div key={`empty-${idx}`} className="calendar__cell" />
          ))}
          {/* 실제 날짜 렌더링 */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${monthKey}-${pad2(dayNum)}`;
            const isSelected = dateStr === selectedDate;
            const expenseSum = dailyTotals[dateStr];
            return (
              <CalendarCell
                key={dayNum}
                className={isSelected ? 'is-selected' : ''}
                onClick={() => handleCellClick(dateStr)}
              >
                <span className="calendar__date-num">{dayNum}</span>
                {expenseSum ? (
                  <span className="calendar__amount">-{fmtNum(expenseSum)}</span>
                ) : null}
              </CalendarCell>
            );
          })}
        </CalendarGrid>
      </Card>

      {/* 내역 리스트 */}
      <section>
        <LedgerListHeader>
          <p className="ledger-list__title">
            내역 리스트 {selectedDate ? `(${formatDateHeader(selectedDate)})` : ''}
          </p>
          <span className="ledger-list__sort">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 5v14M4 8l3-3 3 3M17 19V5M14 16l3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            최신순
          </span>
        </LedgerListHeader>

        {groupedTxs.length === 0 ? (
          <EmptyText>이번 달 등록된 내역이 없어요.</EmptyText>
        ) : (
          groupedTxs.map((group) => (
            <LedgerDay key={group.date}>
              <LedgerDayHeader>
                <span className="ledger-day__date">{formatDateHeader(group.date)}</span>
                <span className="ledger-day__total">지출 {fmtNum(group.total)}원</span>
              </LedgerDayHeader>
              <Card className="ledger-card">
                {group.items.map((tx) => {
                  const iconKey = ICONS[tx.icon] ? tx.icon : (CATEGORY_ICON_MAP[tx.category] || 'bag');
                  const sign = tx.type === 'income' ? '+' : '-';
                  return (
                    <LedgerTx key={tx.id}>
                      <LedgerTxIcon>{ICONS[iconKey]}</LedgerTxIcon>
                      <LedgerTxInfo>
                        <LedgerTxMemo>{tx.memo}</LedgerTxMemo>
                        <p className="ledger-tx__meta">{tx.category} · {tx.paymentMethod}</p>
                      </LedgerTxInfo>
                      <LedgerTxAmount className={tx.type === 'income' ? 'is-income' : ''}>
                        {sign}
                        {fmtNum(tx.amount)}원
                      </LedgerTxAmount>
                    </LedgerTx>
                  );
                })}
              </Card>
            </LedgerDay>
          ))
        )}
      </section>

      {/* 작성하기 FAB */}
      <FabWrap>
        <FabBtn type="button" onClick={handleOpenSheet} aria-label="가계부 작성하기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="#2B2D42" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </FabBtn>
      </FabWrap>

      {/* 작성 입력 바텀시트 */}
      <SheetOverlay className={isSheetOpen ? 'is-open' : ''} onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseSheet();
      }}>
        <SheetForm onSubmit={handleSubmit}>
          <SheetHandle />
          <p className="sheet__title">가계부 작성</p>

          <Field>
            <label className="field__label" htmlFor="txDate">날짜</label>
            <input
              className="field__input"
              type="date"
              id="txDate"
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              required
            />
          </Field>

          <Field>
            <label className="field__label">수입 / 지출</label>
            <Segment>
              <SegmentBtn
                type="button"
                className={txType === 'expense' ? 'is-active' : ''}
                onClick={() => setTxType('expense')}
              >
                지출
              </SegmentBtn>
              <SegmentBtn
                type="button"
                className={txType === 'income' ? 'is-active' : ''}
                onClick={() => setTxType('income')}
              >
                수입
              </SegmentBtn>
            </Segment>
          </Field>

          <Field>
            <label className="field__label" htmlFor="txAmount">금액</label>
            <input
              className="field__input"
              type="number"
              id="txAmount"
              placeholder="0"
              min="0"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              required
            />
          </Field>

          <Field>
            <label className="field__label">카테고리</label>
            <ChipGroup>
              {['식비', '교통', '쇼핑', '구독', '의료', '주거', '여행', '기타'].map((category) => (
                <Chip
                  key={category}
                  type="button"
                  className={txCategory === category ? 'is-active' : ''}
                  onClick={() => setTxCategory(category)}
                >
                  {category}
                </Chip>
              ))}
            </ChipGroup>
          </Field>

          <Field>
            <label className="field__label" htmlFor="txPayment">결제 수단</label>
            <select
              className="field__input"
              id="txPayment"
              value={txPayment}
              onChange={(e) => setTxPayment(e.target.value)}
            >
              <option value="카드">카드</option>
              <option value="현금">현금</option>
              <option value="계좌이체">계좌이체</option>
              <option value="정기지출">정기지출</option>
            </select>
          </Field>

          <Field>
            <label className="field__label" htmlFor="txMemo">메모</label>
            <input
              className="field__input"
              type="text"
              id="txMemo"
              placeholder="예: 스타벅스 신사점"
              value={txMemo}
              onChange={(e) => setTxMemo(e.target.value)}
            />
          </Field>

          <SheetSubmit type="submit">저장하기</SheetSubmit>
        </SheetForm>
      </SheetOverlay>
    </LedgerContainer>
  );
};

// Styled Components
const LedgerContainer = styled.main`
  padding: 8px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PageHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0 12px;
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

const LedgerTotal = styled.section`
  text-align: center;
  padding: 16px 0 8px;

  .ledger__total-label {
    font-size: 14px;
    font-weight: 700;
    color: #2b2d42;
    margin-bottom: 8px;
  }

  .ledger__total-value {
    font-size: 30px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};

  &.calendar-card {
    padding: 20px 16px;
  }

  &.ledger-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;

  .calendar__nav-btn {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2b2d42;
  }

  .calendar__nav-label {
    font-size: 15px;
    font-weight: 800;
    color: #2b2d42;
    min-width: 108px;
    text-align: center;
  }
`;

const CalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;

  span {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  span:first-child {
    color: ${({ theme }) => theme.colors.brandNegative};
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 6px;
`;

const CalendarCell = styled.div`
  min-height: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  border-radius: 10px;
  padding-top: 4px;
  cursor: pointer;
  transition: background 0.15s;

  &.is-selected {
    background: ${({ theme }) => theme.colors.background};
  }

  .calendar__date-num {
    font-size: 13px;
    font-weight: 600;
    color: #2b2d42;
  }

  .calendar__amount {
    font-size: 9.5px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.brandNegative};
  }
`;

const LedgerListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .ledger-list__title {
    font-size: 15px;
    font-weight: 800;
    color: #2b2d42;
  }

  .ledger-list__sort {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12.5px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const LedgerDay = styled.div`
  margin-top: 16px;
`;

const LedgerDayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  margin-bottom: 8px;

  .ledger-day__date {
    font-size: 13px;
    font-weight: 700;
    color: #2b2d42;
  }

  .ledger-day__total {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const LedgerTx = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  & + & {
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const LedgerTxIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff3d9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  svg {
    width: 18px;
    height: 18px;
    color: #c97b00;
  }
`;

const LedgerTxInfo = styled.div`
  flex: 1;
  min-width: 0;

  .ledger-tx__meta {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 2px;
  }
`;

const LedgerTxMemo = styled.p`
  font-size: 14.5px;
  font-weight: 700;
  color: #2b2d42;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LedgerTxAmount = styled.span`
  font-size: 14.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.brandNegative};
  flex: none;

  &.is-income {
    color: ${({ theme }) => theme.colors.brandPositive};
  }
`;

const EmptyText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  padding: 24px 0;
`;

const FabWrap = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100px;
  width: 100%;
  max-width: 480px;
  height: 0;
  z-index: 15;
  pointer-events: none;
`;

const FabBtn = styled.button`
  position: absolute;
  right: 14px;
  bottom: 0;
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.brandYellow};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(255, 174, 0, 0.35);
  pointer-events: auto;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 26px;
    height: 26px;
  }
`;

const SheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(30, 31, 46, 0.45);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;

  &.is-open {
    opacity: 1;
    pointer-events: auto;
  }
`;

const SheetForm = styled.form`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 100%);
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px 20px calc(24px + env(safe-area-inset-bottom));
  z-index: 1000;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  max-height: 88vh;
  overflow-y: auto;

  .is-open & {
    transform: translate(-50%, 0);
  }

  .sheet__title {
    font-size: 17px;
    font-weight: 800;
    color: #2b2d42;
    text-align: center;
    margin-bottom: 20px;
  }
`;

const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 auto 20px;
`;

const Field = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .field__label {
    font-size: 13.5px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .field__input {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14.5px;
    font-weight: 600;
    box-sizing: border-box;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.brandYellow};
    }
  }

  select.field__input {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m8 10 4 4 4-4' stroke='%238B8D9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 20px;
    padding-right: 40px;
  }
`;

const Segment = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  padding: 4px;
  gap: 4px;
`;

const SegmentBtn = styled.button`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: background 0.15s, color 0.15s;

  &.is-active {
    background: #2b2d42;
    color: #ffffff;
  }
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  padding: 9px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 700;
  transition: background 0.15s, color 0.15s;

  &.is-active {
    background: ${({ theme }) => theme.colors.brandYellow};
    color: #2b2d42;
  }
`;

const SheetSubmit = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 16px 0;
  border-radius: 999px;
  background: #2b2d42;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  text-align: center;
  transition: opacity 0.15s;

  &:active {
    opacity: 0.9;
  }
`;
