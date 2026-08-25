import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HorizontalScrollWrapper } from '@/components/HorizontalScrollWrapper';

interface FaqItem {
  id: string;
  category: 'all' | 'shopping' | 'delivery' | 'ledger' | 'payment';
  categoryLabel: string;
  question: string;
  answer: string;
}

const faqList: FaqItem[] = [
  {
    id: 'faq_1',
    category: 'shopping',
    categoryLabel: '가상 쇼핑',
    question: '가상 쇼핑으로 주문하면 실제 상품이 배송되나요?',
    answer: '아닙니다! SimSpend의 가상 쇼핑은 물건을 사고 싶은 충동을 가상 결제를 통해 건강하게 해소(디톡스)하기 위한 시뮬레이션 서비스입니다. 실제 금융 결제나 실물 택배 배송은 발생하지 않습니다.'
  },
  {
    id: 'faq_2',
    category: 'shopping',
    categoryLabel: '가상 쇼핑',
    question: '가상 쇼핑에서 구매한 내역은 어디서 볼 수 있나요?',
    answer: '홈 화면 상단의 "가상 구매 목록" 아이콘을 클릭하시면 지금까지 가상으로 결제한 모든 상품의 썸네일, 구매 금액, 총 방어(절약) 누적 금액을 실시간으로 확인하실 수 있습니다.'
  },
  {
    id: 'faq_3',
    category: 'delivery',
    categoryLabel: '가상 배달',
    question: '가상 배달 주문 후 배송 상태는 어떻게 진행되나요?',
    answer: '가상 배달 주문이 완료되면 [주문 접수] → [메뉴 준비 중] → [배달 출발] → [배달 완료] 순으로 실감나는 가상 라이더 배송 시뮬레이션이 진행됩니다. "가상 구매 목록"에서 현재 상태를 확인하실 수 있습니다.'
  },
  {
    id: 'faq_4',
    category: 'delivery',
    categoryLabel: '가상 배달',
    question: '가상 배달로 야식 충동을 줄일 수 있나요?',
    answer: '네! 늦은 밤 배달앱을 켜고 주문 직전까지 가는 충동을 SimSpend에서 동일한 메뉴와 옵션을 선택하고 가상 결제하는 과정을 통해 뇌에 만족감을 주어 실제 지출을 방어할 수 있습니다.'
  },
  {
    id: 'faq_5',
    category: 'ledger',
    categoryLabel: '가계부',
    question: '가계부 내역은 어떻게 기록하고 관리하나요?',
    answer: '하단 네비게이션의 "가계부" 탭 또는 홈 화면의 "가계부 작성하기" 버튼을 눌러 날짜별 수입/지출 금액과 카테고리, 결제 수단을 손쉽게 등록할 수 있습니다. 캘린더에서 날짜를 선택하면 해당 일자의 상세 내역이 표시됩니다.'
  },
  {
    id: 'faq_6',
    category: 'ledger',
    categoryLabel: '가계부',
    question: '가계부 데이터는 기기를 변경해도 유지되나요?',
    answer: '현재 SimSpend의 모든 데이터는 고객님의 개인정보 보호를 위해 브라우저의 안전한 로컬 저장소(LocalStorage)에 암호화 보관됩니다. 향후 계정 동기화 및 클라우드 백업 기능이 지원될 예정입니다.'
  },
  {
    id: 'faq_7',
    category: 'payment',
    categoryLabel: '결제·이용',
    question: '가상 결제 시 입력하는 배송지와 결제 수단 정보는 안전한가요?',
    answer: '가상 결제 화면에서 입력하는 주문자명, 주소, 결제 수단 정보는 결제 체험을 위한 가상 데이터로 실제 금융 기관이나 외부 서버로 전혀 전송되지 않으므로 안심하고 이용하셔도 됩니다.'
  },
  {
    id: 'faq_8',
    category: 'payment',
    categoryLabel: '결제·이용',
    question: 'AI 소비 분석 리포트는 어떤 기준으로 작성되나요?',
    answer: '내가 참아낸 가상 소비(쇼핑/배달) 데이터와 실제 가계부 지출 내역을 AI 알고리즘이 분석하여 충동구매 취약 카테고리, 절약 성공률, 맞춤형 절약 솔루션 3가지를 매주/매월 자동으로 도출해 드립니다.'
  }
];

export const Faq: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq_1');

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'shopping', label: '가상 쇼핑' },
    { id: 'delivery', label: '가상 배달' },
    { id: 'ledger', label: '가계부' },
    { id: 'payment', label: '결제·이용' }
  ];

  const filteredFaqs = selectedCategory === 'all'
    ? faqList
    : faqList.filter(f => f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <FaqContainer>
      {/* 1. 상단 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/mypage')} aria-label="더보기로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>자주 묻는 질문</HeaderTitle>
      </PageHeader>

      {/* 2. 카테고리 필터 탭 */}
      <HorizontalScrollWrapper>
        <CategoryFilterBar>
          {categories.map(cat => (
            <CategoryFilterBtn
              key={cat.id}
              type="button"
              className={selectedCategory === cat.id ? 'is-active' : ''}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </CategoryFilterBtn>
          ))}
        </CategoryFilterBar>
      </HorizontalScrollWrapper>

      {/* 3. FAQ 아코디언 리스트 */}
      <FaqListSection>
        {filteredFaqs.map(faq => {
          const isOpen = openFaqId === faq.id;
          return (
            <FaqCard key={faq.id} onClick={() => toggleFaq(faq.id)}>
              <FaqQuestionRow>
                <CategoryBadge>{faq.categoryLabel}</CategoryBadge>
                <QuestionText>{faq.question}</QuestionText>
                <ChevronIcon $isOpen={isOpen} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </ChevronIcon>
              </FaqQuestionRow>
              {isOpen && (
                <FaqAnswerWrap>
                  <AnswerText>{faq.answer}</AnswerText>
                </FaqAnswerWrap>
              )}
            </FaqCard>
          );
        })}
      </FaqListSection>

      {/* 4. 하단 1:1 문의 유도 배너 */}
      <BottomBanner>
        <BannerContent>
          <BannerTitle>원하는 답변을 찾지 못하셨나요?</BannerTitle>
          <BannerDesc>1:1 문의를 남겨주시면 고객센터에서 친절히 안내해 드립니다.</BannerDesc>
        </BannerContent>
        <InquiryBtn type="button" onClick={() => navigate('/support')}>
          1:1 문의하기
        </InquiryBtn>
      </BottomBanner>
    </FaqContainer>
  );
};

// === styled-components ===

const FaqContainer = styled.main`
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
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
  color: #2B2D42;
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
  color: #2B2D42;
`;

const CategoryFilterBar = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryFilterBtn = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &.is-active {
    background: #1E1F2E;
    color: #FFAE00;
    border-color: #1E1F2E;
  }
`;

const FaqListSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FaqCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  padding: 16px 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #FFAE00;
  }
`;

const FaqQuestionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CategoryBadge = styled.span`
  font-size: 10.5px;
  font-weight: 700;
  background: rgba(255, 174, 0, 0.12);
  color: #E69500;
  padding: 3px 8px;
  border-radius: 6px;
  flex: none;
`;

const QuestionText = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
  line-height: 1.4;
`;

const ChevronIcon = styled.svg<{ $isOpen: boolean }>`
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
  flex: none;
`;

const FaqAnswerWrap = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
`;

const AnswerText = styled.p`
  font-size: 13px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BottomBanner = styled.section`
  background: linear-gradient(135deg, #1E1F2E 0%, #2B2D42 100%);
  border-radius: 18px;
  padding: 18px;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-top: 8px;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BannerTitle = styled.h3`
  font-size: 14.5px;
  font-weight: 800;
  color: #FFAE00;
`;

const BannerDesc = styled.p`
  font-size: 12px;
  color: #CBD5E1;
  line-height: 1.4;
`;

const InquiryBtn = styled.button`
  width: 100%;
  padding: 12px 0;
  background: #FFAE00;
  color: #1E1F2E;
  font-size: 13.5px;
  font-weight: 800;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.92;
  }
`;
