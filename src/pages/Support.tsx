import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type InquiryType = 'general' | 'bug' | 'usage';

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const [inquiryType, setInquiryType] = useState<InquiryType>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('hello@simspend.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('문의 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTitle('');
      setContent('');
      alert('문의가 성공적으로 접수되었습니다. 확인 후 등록하신 이메일로 회신드리겠습니다.');
      navigate('/mypage');
    }, 600);
  };

  return (
    <SupportContainer>
      {/* 1. 상단 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/mypage')} aria-label="더보기로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>고객센터</HeaderTitle>
      </PageHeader>

      {/* 2. 고객센터 안내 배너 */}
      <HeroBanner>
        <BannerIcon>🎧</BannerIcon>
        <BannerContent>
          <BannerTitle>무엇을 도와드릴까요?</BannerTitle>
          <BannerDesc>
            SimSpend 이용 중 문의사항이나 불편한 점을 남겨주시면 신속하게 확인 후 답변해 드립니다.
          </BannerDesc>
          <BannerMeta>운영시간: 평일 09:00 ~ 18:00 (주말/공휴일 제외)</BannerMeta>
        </BannerContent>
      </HeroBanner>

      {/* 3. 문의 작성 폼 */}
      <FormCard onSubmit={handleSubmit}>
        <SectionLabel>문의 유형 선택</SectionLabel>
        <TypeGrid>
          <TypeButton
            type="button"
            className={inquiryType === 'general' ? 'is-active' : ''}
            onClick={() => setInquiryType('general')}
          >
            <span className="type-icon">💬</span>
            <span className="type-name">문의하기</span>
          </TypeButton>

          <TypeButton
            type="button"
            className={inquiryType === 'bug' ? 'is-active' : ''}
            onClick={() => setInquiryType('bug')}
          >
            <span className="type-icon">🚨</span>
            <span className="type-name">오류·불편 신고</span>
          </TypeButton>

          <TypeButton
            type="button"
            className={inquiryType === 'usage' ? 'is-active' : ''}
            onClick={() => setInquiryType('usage')}
          >
            <span className="type-icon">📖</span>
            <span className="type-name">서비스 이용 문의</span>
          </TypeButton>
        </TypeGrid>

        <FormGroup>
          <FormLabel htmlFor="inquiryTitle">제목 (선택)</FormLabel>
          <FormInput
            id="inquiryTitle"
            type="text"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="inquiryContent">
            문의 내용 <RequiredMark>*</RequiredMark>
          </FormLabel>
          <FormTextarea
            id="inquiryContent"
            placeholder="문의하실 내용을 상세히 적어주세요. 오류 신고의 경우 발생 상황을 함께 적어주시면 빠른 확인이 가능합니다."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="inquiryEmail">답변 받으실 이메일</FormLabel>
          <FormInput
            id="inquiryEmail"
            type="email"
            placeholder="example@simspend.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '문의 접수 중...' : '문의하기'}
        </SubmitButton>
      </FormCard>

      {/* 4. 고객 지원 안내 정보 */}
      <HelpInfoCard>
        <HelpInfoTitle>고객센터 운영 안내</HelpInfoTitle>
        <HelpInfoItem>
          <span>대표 이메일</span>
          <strong>support@simspend.com</strong>
        </HelpInfoItem>
        <HelpInfoItem>
          <span>전화 상담</span>
          <strong>1588-0000</strong>
        </HelpInfoItem>
        <HelpInfoDesc>
          * 접수된 문의는 영업일 기준 24시간 이내에 답변드리며, 주말/공휴일 접수 건은 다음 영업일에 순차적으로 처리됩니다.
        </HelpInfoDesc>
      </HelpInfoCard>
    </SupportContainer>
  );
};

// === styled-components ===

const SupportContainer = styled.main`
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

const HeroBanner = styled.section`
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #1E1F2E 0%, #2B2D42 100%);
  border-radius: 20px;
  padding: 20px 18px;
  color: #FFFFFF;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const BannerIcon = styled.div`
  font-size: 32px;
  flex: none;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BannerTitle = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: #FFAE00;
`;

const BannerDesc = styled.p`
  font-size: 12px;
  color: #D1D5DB;
  line-height: 1.45;
`;

const BannerMeta = styled.p`
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
`;

const FormCard = styled.form`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionLabel = styled.p`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const TypeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 6px;
  border-radius: 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: all 0.2s;

  .type-icon {
    font-size: 18px;
  }

  .type-name {
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
    line-height: 1.2;
  }

  &.is-active {
    border-color: #FFAE00;
    background: rgba(255, 174, 0, 0.08);

    .type-name {
      color: #2B2D42;
      font-weight: 800;
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RequiredMark = styled.span`
  color: #EF4444;
`;

const FormInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13.5px;
  outline: none;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;

  &:focus {
    border-color: #FFAE00;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
  resize: none;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;

  &:focus {
    border-color: #FFAE00;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 15px;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HelpInfoCard = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 18px;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HelpInfoTitle = styled.h3`
  font-size: 13.5px;
  font-weight: 800;
  color: #2B2D42;
  margin-bottom: 2px;
`;

const HelpInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  strong {
    color: #2B2D42;
    font-weight: 700;
  }
`;

const HelpInfoDesc = styled.p`
  font-size: 11px;
  color: #94A3B8;
  margin-top: 4px;
  line-height: 1.4;
`;
