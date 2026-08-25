import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export interface UserProfile {
  name: string;
  email: string;
  avatarType: 'default' | 'emoji' | 'image';
  avatarValue: string;
  bgColor: string;
}

export const PROFILE_STORAGE_KEY = 'simspend_user_profile';

export const defaultProfile: UserProfile = {
  name: '심스펜드',
  email: 'hello@simspend.com',
  avatarType: 'default',
  avatarValue: 'default',
  bgColor: '#FFE8B8'
};

const emojiPresets = [
  { label: '기본', emoji: 'default', type: 'default' as const },
  { label: '스마일', emoji: '✨', type: 'emoji' as const },
  { label: '사자', emoji: '🦁', type: 'emoji' as const },
  { label: '곰돌이', emoji: '🐻', type: 'emoji' as const },
  { label: '토끼', emoji: '🐰', type: 'emoji' as const },
  { label: '고양이', emoji: '🐱', type: 'emoji' as const },
  { label: '강아지', emoji: '🐶', type: 'emoji' as const },
  { label: '부자', emoji: '💰', type: 'emoji' as const }
];

const colorPresets = ['#FFE8B8', '#FED7AA', '#E9D5FF', '#BAE6FD', '#BBF7D0', '#FECDD3'];

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatarType, setAvatarType] = useState<'default' | 'emoji' | 'image'>(profile.avatarType);
  const [avatarValue, setAvatarValue] = useState(profile.avatarValue);
  const [bgColor, setBgColor] = useState(profile.bgColor);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarType('image');
          setAvatarValue(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const updated: UserProfile = {
      name: name.trim(),
      email: email.trim() || 'hello@simspend.com',
      avatarType,
      avatarValue,
      bgColor
    };

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('simspend_profile_updated'));
    } catch {
      // storage fallback
    }

    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/mypage');
  };

  return (
    <EditContainer>
      {/* 1. 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/mypage')} aria-label="더보기로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>프로필 수정</HeaderTitle>
      </PageHeader>

      <EditForm onSubmit={handleSave}>
        {/* 2. 아바타 미리보기 및 변경 영역 */}
        <AvatarSection>
          <AvatarPreview style={{ backgroundColor: bgColor }}>
            {avatarType === 'image' && avatarValue ? (
              <img src={avatarValue} alt="프로필" className="avatar-img" />
            ) : avatarType === 'emoji' ? (
              <span className="avatar-emoji">{avatarValue}</span>
            ) : (
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="avatar-svg">
                <circle cx="28" cy="23" r="10" fill="#2B2D42"/>
                <path d="M6 56c0-12 9-19 22-19s22 7 22 19" fill="#2B2D42"/>
              </svg>
            )}
          </AvatarPreview>

          <UploadBtnLabel htmlFor="avatarUpload">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            사진 변경
          </UploadBtnLabel>
          <HiddenFileInput
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </AvatarSection>

        {/* 3. 아바타 프리셋 선택 */}
        <CardSection>
          <SectionLabel>아바타 아이콘 선택</SectionLabel>
          <PresetGrid>
            {emojiPresets.map(preset => {
              const isSelected = 
                avatarType === preset.type && 
                (preset.type === 'default' ? true : avatarValue === preset.emoji);
              return (
                <PresetBtn
                  key={preset.label}
                  type="button"
                  className={isSelected ? 'is-selected' : ''}
                  onClick={() => {
                    setAvatarType(preset.type);
                    setAvatarValue(preset.emoji);
                  }}
                >
                  {preset.type === 'default' ? '👤' : preset.emoji}
                </PresetBtn>
              );
            })}
          </PresetGrid>

          <SectionLabel style={{ marginTop: '16px' }}>배경 색상 선택</SectionLabel>
          <ColorGrid>
            {colorPresets.map(color => (
              <ColorBtn
                key={color}
                type="button"
                style={{ backgroundColor: color }}
                className={bgColor === color ? 'is-selected' : ''}
                onClick={() => setBgColor(color)}
              />
            ))}
          </ColorGrid>
        </CardSection>

        {/* 4. 정보 입력 필드 */}
        <CardSection>
          <FormGroup>
            <FormLabel htmlFor="editName">이름 / 닉네임</FormLabel>
            <FormInput
              id="editName"
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup style={{ marginTop: '16px' }}>
            <FormLabel htmlFor="editEmail">이메일 주소</FormLabel>
            <FormInput
              id="editEmail"
              type="email"
              placeholder="example@simspend.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </FormGroup>
        </CardSection>

        {/* 5. 저장 버튼 */}
        <SaveButton type="submit">저장하기</SaveButton>
      </EditForm>

      {/* 저장 완료 확인 팝업 */}
      {showSuccessModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalIconWrap>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#FFAE00" />
                <path d="M7.5 12l3 3 6-6" stroke="#1E1F2E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ModalIconWrap>
            <ModalTitle>프로필이 저장되었습니다.</ModalTitle>
            <ModalDesc>변경된 프로필 정보가 성공적으로 반영되었습니다.</ModalDesc>
            <ModalConfirmBtn type="button" onClick={handleCloseModal}>
              확인
            </ModalConfirmBtn>
          </ModalContent>
        </ModalOverlay>
      )}
    </EditContainer>
  );
};

// === styled-components ===

const EditContainer = styled.main`
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

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 0 8px;
`;

const AvatarPreview = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 3px solid #FFFFFF;

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-emoji {
    font-size: 40px;
  }

  .avatar-svg {
    width: 100%;
    height: 100%;
  }
`;

const UploadBtnLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #2B2D42;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.2s;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    border-color: #FFAE00;
    color: #E69500;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CardSection = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  padding: 20px 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
`;

const SectionLabel = styled.h3`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const PresetBtn = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #FFAE00;
  }

  &.is-selected {
    border-color: #FFAE00;
    background: rgba(255, 174, 0, 0.12);
    transform: scale(1.04);
  }
`;

const ColorGrid = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
`;

const ColorBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s;

  &.is-selected {
    border-color: #2B2D42;
    transform: scale(1.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

const FormInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;

  &:focus {
    border-color: #FFAE00;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 15px 0;
  background: #1E1F2E;
  color: #FFAE00;
  font-size: 15px;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.92;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
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

const ModalIconWrap = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: 14px;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 800;
  color: #2B2D42;
  margin-bottom: 6px;
`;

const ModalDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.45;
  margin-bottom: 20px;
`;

const ModalConfirmBtn = styled.button`
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
