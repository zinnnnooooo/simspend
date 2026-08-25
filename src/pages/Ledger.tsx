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

const EXPENSE_CATEGORIES = ['식비', '교통', '쇼핑', '구독', '의료', '주거', '여행', '기타'];
const INCOME_CATEGORIES = ['월급', '용돈', '부수입', '이자·배당', '환급', '기타 수입'];
const SAVINGS_CATEGORIES = ['적금', '예금', '투자', '비상금', '기타 저축'];

const CATEGORY_ICON_MAP: Record<string, string> = {
  식비: 'food',
  교통: 'bus',
  쇼핑: 'bag',
  구독: 'music',
  의료: 'bag',
  주거: 'home',
  여행: 'travel',
  기타: 'bag',
  월급: 'bag',
  용돈: 'bag',
  부수입: 'bag',
  '이자·배당': 'bag',
  환급: 'bag',
  '기타 수입': 'bag',
  적금: 'bag',
  예금: 'bag',
  투자: 'bag',
  비상금: 'bag',
  '기타 저축': 'bag'
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

  // 캘린더 상태 (실제 현재 연도/월 기준 자동 초기화)
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // 1~12
  const todayDateStr = `${todayYear}-${pad2(todayMonth)}-${pad2(today.getDate())}`;

  const [currentYear, setCurrentYear] = useState(todayYear);
  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 바텀시트 입력 폼 상태
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [txDate, setTxDate] = useState(todayDateStr);
  const [txType, setTxType] = useState<'expense' | 'income' | 'savings'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('식비');
  const [txMemo, setTxMemo] = useState('');
  const [savedPopupType, setSavedPopupType] = useState<'expense' | 'income' | 'savings' | null>(null);

  const monthKey = `${currentYear}-${pad2(currentMonth)}`;
  const monthlyTotal = getMonthlyTotal(monthKey);
  const dailyTotals = getDailyTotalsByMonth(monthKey);
  const transactions = getTransactionsByMonth(monthKey);

  // 캘린더용 날짜 계산 (일요일=0 시작)
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
    const defaultDate = selectedDate || (monthKey === todayDateStr.slice(0, 7) ? todayDateStr : `${monthKey}-01`);
    setTxDate(defaultDate);
    setIsSheetOpen(true);
  };

  const handleTypeChange = (type: 'expense' | 'income' | 'savings') => {
    setTxType(type);
    if (type === 'expense') {
      setTxCategory('식비');
    } else if (type === 'income') {
      setTxCategory('월급');
    } else {
      setTxCategory('적금');
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    // 폼 초기화
    setTxAmount('');
    setTxMemo('');
    setTxCategory('식비');
    setTxType('expense');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(txAmount, 10);
    if (!txDate || isNaN(amountNum) || amountNum <= 0) return;

    const currentType = txType;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: txDate,
      type: currentType,
      category: txCategory,
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
    setSavedPopupType(currentType);
  };

  // 날짜별 그룹핑 가공 (선택한 날짜가 있으면 그 날짜만, 없으면 전체 리스트)
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const filteredTransactions = selectedDate
    ? safeTransactions.filter((tx) => tx && tx.date === selectedDate)
    : safeTransactions;

  const groupedTxs: { date: string; total: number; items: Transaction[] }[] = [];
  const groupMap: Record<string, typeof groupedTxs[0]> = {};

  filteredTransactions.forEach((tx) => {
    if (!tx || !tx.date) return;
    if (!groupMap[tx.date]) {
      groupMap[tx.date] = { date: tx.date, total: 0, items: [] };
      groupedTxs.push(groupMap[tx.date]);
    }
    groupMap[tx.date].items.push(tx);
    if (tx.type === 'expense') {
      groupMap[tx.date].total += (tx.amount || 0);
    }
  });

  const fmtWon = (n?: number) => '₩' + Math.round(n || 0).toLocaleString('ko-KR');
  const fmtNum = (n?: number) => Math.round(n || 0).toLocaleString('ko-KR');
  
  const formatDateHeader = (dateStr?: string) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const [, m, d] = parts;
    return `${parseInt(m, 10) || 0}월 ${parseInt(d, 10) || 0}일`;
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
            const isToday = dateStr === todayDateStr;
            const expenseSum = dailyTotals[dateStr];
            return (
              <CalendarCell
                key={dayNum}
                className={`${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
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
                  const iconKey = (tx.icon && ICONS[tx.icon]) ? tx.icon : (CATEGORY_ICON_MAP[tx.category] || 'bag');
                  const sign = tx.type === 'income' ? '+' : tx.type === 'savings' ? '' : '-';
                  const typeLabel = tx.type === 'savings' ? '저축' : tx.type === 'income' ? '수입' : '지출';
                  return (
                    <LedgerTx key={tx.id}>
                      <LedgerTxIcon>{ICONS[iconKey] || ICONS['bag']}</LedgerTxIcon>
                      <LedgerTxInfo>
                        <LedgerTxMemo>{tx.memo}</LedgerTxMemo>
                        <p className="ledger-tx__meta">{tx.category} · {typeLabel}</p>
                      </LedgerTxInfo>
                      <LedgerTxAmount className={tx.type === 'income' ? 'is-income' : tx.type === 'savings' ? 'is-savings' : ''}>
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

      {/* 작성하기 FAB 버튼 */}
      <FabWrap>
        <FabBtn type="button" onClick={handleOpenSheet} aria-label="가계부 작성하기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="#FFAE00" strokeWidth="2.8" strokeLinecap="round"/>
          </svg>
        </FabBtn>
      </FabWrap>

      {/* 작성 입력 바텀시트 */}
      <SheetOverlay className={isSheetOpen ? 'is-open' : ''} onClick={handleCloseSheet}>
        <SheetForm onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          <SheetHeader>
            <h3 className="sheet__title">가계부 작성</h3>
            <SheetClose type="button" onClick={handleCloseSheet} aria-label="닫기">✕</SheetClose>
          </SheetHeader>

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
            <label className="field__label">분류 선택</label>
            <Segment>
              <SegmentBtn
                type="button"
                className={txType === 'expense' ? 'is-active' : ''}
                onClick={() => handleTypeChange('expense')}
              >
                지출
              </SegmentBtn>
              <SegmentBtn
                type="button"
                className={txType === 'income' ? 'is-active' : ''}
                onClick={() => handleTypeChange('income')}
              >
                수입
              </SegmentBtn>
              <SegmentBtn
                type="button"
                className={txType === 'savings' ? 'is-active' : ''}
                onClick={() => handleTypeChange('savings')}
              >
                저축
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
              {(txType === 'expense' ? EXPENSE_CATEGORIES : txType === 'income' ? INCOME_CATEGORIES : SAVINGS_CATEGORIES).map((category) => (
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
            <label className="field__label" htmlFor="txMemo">메모</label>
            <input
              className="field__input"
              type="text"
              id="txMemo"
              placeholder={
                txType === 'expense' 
                  ? '예: 스타벅스 신사점' 
                  : txType === 'income' 
                  ? '예: 10월 급여 / 보너스' 
                  : '예: 청년희망적금 / 주식투자'
              }
              value={txMemo}
              onChange={(e) => setTxMemo(e.target.value)}
            />
          </Field>

          <SheetSubmit type="submit">저장하기</SheetSubmit>
        </SheetForm>
      </SheetOverlay>

      {/* 가계부 작성 완료 팝업 */}
      {savedPopupType && (
        <SuccessModalOverlay onClick={() => setSavedPopupType(null)}>
          <SuccessModalContent onClick={(e) => e.stopPropagation()}>
            <SuccessModalIconWrap>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  fill={savedPopupType === 'income' ? '#10B981' : savedPopupType === 'savings' ? '#3B82F6' : '#FFAE00'} 
                />
                <path d="M7.5 12l3 3 6-6" stroke="#1E1F2E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </SuccessModalIconWrap>
            <SuccessModalTitle>
              {savedPopupType === 'income' 
                ? '수입 내역이 저장되었습니다.' 
                : savedPopupType === 'savings' 
                ? '저축 내역이 저장되었습니다.' 
                : '지출 내역이 저장되었습니다.'}
            </SuccessModalTitle>
            <SuccessModalDesc>
              {savedPopupType === 'income' 
                ? '가계부 캘린더와 통계에 수입 내역이 성공적으로 반영되었습니다.' 
                : '가계부 캘린더와 지출 내역에 성공적으로 반영되었습니다.'}
            </SuccessModalDesc>
            <SuccessModalConfirmBtn type="button" onClick={() => setSavedPopupType(null)}>
              확인
            </SuccessModalConfirmBtn>
          </SuccessModalContent>
        </SuccessModalOverlay>
      )}
    </LedgerContainer>
  );
};

// Styled Components
const LedgerContainer = styled.main`
  width: 100%;
  box-sizing: border-box;
  padding: 16px 16px 88px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.background};
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
    path {
      stroke: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LedgerTotal = styled.section`
  text-align: center;
  padding: 24px 0 12px;

  .ledger__total-label {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 6px;
  }

  .ledger__total-value {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &.calendar-card {
    padding: 20px 16px;
  }

  &.ledger-card {
    padding: 20px 18px;
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
  margin-bottom: 18px;

  .calendar__nav-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: background 0.2s, transform 0.15s ease;

    &:active {
      transform: scale(0.93);
    }

    svg {
      width: 16px;
      height: 16px;
      path {
        stroke: ${({ theme }) => theme.colors.textPrimary};
      }
    }
  }

  .calendar__nav-label {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    min-width: 120px;
    text-align: center;
  }
`;

const CalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;

  span {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  span:first-child {
    color: ${({ theme }) => theme.colors.brandNegative};
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
`;

const CalendarCell = styled.div`
  min-height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  border-radius: 12px;
  padding-top: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &.is-selected {
    background: ${({ theme }) => 
      theme.colors.cardBackground === '#FFFFFF' 
        ? 'rgba(255, 170, 0, 0.1)' 
        : 'rgba(255, 170, 0, 0.15)'};
    
    .calendar__date-num {
      color: ${({ theme }) => theme.colors.brandYellow};
      font-weight: 700;
    }
  }

  &.is-today .calendar__date-num {
    background: ${({ theme }) => theme.colors.textPrimary};
    color: ${({ theme }) => theme.colors.cardBackground};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  .calendar__date-num {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
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
  padding-bottom: 4px;

  .ledger-list__title {
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
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
  margin-top: 8px;
`;

const LedgerDayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 4px;

  .ledger-day__date {
    font-size: 12.5px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .ledger-day__total {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const LedgerTx = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const LedgerTxIcon = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFF4DF' : '#332715'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const LedgerTxInfo = styled.div`
  flex: 1;
  min-width: 0;

  .ledger-tx__meta {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 2px;
  }
`;

const LedgerTxMemo = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LedgerTxAmount = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandNegative};
  flex: none;
  text-align: right;

  &.is-income {
    color: ${({ theme }) => theme.colors.brandPositive};
  }

  &.is-savings {
    color: #4299E1;
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
  bottom: 120px;
  width: 100%;
  max-width: 480px;
  height: 0;
  z-index: 99;
  pointer-events: none;
`;

const FabBtn = styled.button`
  position: absolute;
  right: 32px;
  bottom: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandYellow};
  color: #191B2E;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(255, 170, 0, 0.3);
  pointer-events: auto;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(255, 170, 0, 0.4);
  }

  &:active {
    transform: scale(0.93);
  }

  svg {
    width: 24px;
    height: 24px;
    path {
      stroke: #191B2E;
    }
  }
`;

const SheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 16, 26, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
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
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 88vh;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .is-open & {
    transform: translate(-50%, 0);
  }

  .sheet__title {
    font-size: 17px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textPrimary};
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

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;

  .sheet__title {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    text-align: center;
  }
`;

const SheetClose = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const Field = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .field__label {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .field__input {
    width: 100%;
    height: 46px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
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
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m8 10 4 4 4-4' stroke='%238C94A7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 18px;
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
  padding: 9px 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s;

  &.is-active {
    background: ${({ theme }) => theme.colors.textPrimary};
    color: ${({ theme }) => theme.colors.cardBackground};
  }
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.2s;

  &.is-active {
    background: ${({ theme }) => theme.colors.brandYellow};
    color: #191B2E;
  }
`;

const SheetSubmit = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 14px 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.textPrimary};
  color: ${({ theme }) => theme.colors.cardBackground};
  font-size: 14.5px;
  font-weight: 700;
  text-align: center;
  transition: opacity 0.15s, transform 0.15s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

const SuccessModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 16, 26, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.18s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const SuccessModalContent = styled.div`
  width: 100%;
  max-width: 320px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 24px;
  padding: 28px 24px 22px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SuccessModalIconWrap = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: 14px;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const SuccessModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
`;

const SuccessModalDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.45;
  margin-bottom: 20px;
`;

const SuccessModalConfirmBtn = styled.button`
  width: 100%;
  padding: 13px 0;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 14.5px;
  font-weight: 800;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.92;
  }
`;
