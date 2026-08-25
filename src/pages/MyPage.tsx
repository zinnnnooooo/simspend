import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useThemeMode } from '@/context/ThemeContext';
import { UserProfile, PROFILE_STORAGE_KEY, defaultProfile } from '@/pages/EditProfile';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const { user, loginWithGoogle, logout } = useAuth();
  const { showSnackbar, showConfirm } = useUI();

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (saved) {
          setProfile(JSON.parse(saved));
        }
      } catch {
        // fallback
      }
    };

    window.addEventListener('simspend_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('simspend_profile_updated', handleProfileUpdate);
  }, []);

  return (
    <MyPageContainer>
      {/* 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/')} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>더보기</HeaderTitle>
      </PageHeader>

      {/* 프로필 카드 */}
      <Card 
        className="profile-card" 
        onClick={async () => {
          if (!user) {
            try {
              await loginWithGoogle();
              showSnackbar('Google 로그인이 완료되었습니다.');
            } catch (error) {
              console.error('로그인 에러:', error);
            }
          } else {
            navigate('/edit-profile');
          }
        }} 
        style={{ cursor: 'pointer' }}
      >
        <ProfileAvatar id="profileAvatar" style={{ backgroundColor: profile.bgColor }}>
          {profile.avatarType === 'image' && profile.avatarValue ? (
            <img src={profile.avatarValue} alt="프로필" className="avatar-img" />
          ) : profile.avatarType === 'emoji' ? (
            <span className="avatar-emoji">{profile.avatarValue}</span>
          ) : (
            <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
              <rect width="56" height="56" fill={profile.bgColor || '#FFE8B8'}/>
              <circle cx="28" cy="23" r="10" fill="#2B2D42"/>
              <path d="M6 56c0-12 9-19 22-19s22 7 22 19" fill="#2B2D42"/>
            </svg>
          )}
        </ProfileAvatar>
        <ProfileInfo>
          <p className="profile-card__name">{user ? `${profile.name} 님` : '게스트 님'}</p>
          <p className="profile-card__email">{user ? profile.email : '여기를 눌러 Google 계정 연동하기'}</p>
        </ProfileInfo>
        <button type="button" className="profile-card__edit" aria-label="프로필 수정">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
        </button>
      </Card>

      {/* 일반 설정 */}
      <SettingsSection>
        <p className="settings-section__title">일반 설정</p>
        <Card className="settings-list">
          <SettingsRowAsLink href="#notification" onClick={(e) => { e.preventDefault(); navigate('/notification-settings'); }}>
            <span className="settings-row__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="settings-row__label">알림 설정</span>
            <svg className="settings-row__chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SettingsRowAsLink>
          
          <SettingsRow>
            <span className="settings-row__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="settings-row__label">다크모드 설정</span>
            <ToggleButton
              type="button"
              className={isDarkMode ? 'is-on' : ''}
              onClick={toggleDarkMode}
              role="switch"
              aria-checked={isDarkMode}
              aria-label="다크모드 설정"
            >
              <span className="toggle__knob" />
            </ToggleButton>
          </SettingsRow>
        </Card>
      </SettingsSection>

      {/* 고객 지원 */}
      <SettingsSection>
        <p className="settings-section__title">고객 지원</p>
        <Card className="settings-list">
          <SettingsRowAsLink href="#support" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>
            <span className="settings-row__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M9.6 9.3a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1 .8-1 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="16.6" r="0.9" fill="currentColor"/>
              </svg>
            </span>
            <span className="settings-row__label">고객센터</span>
            <svg className="settings-row__chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SettingsRowAsLink>
          
          <SettingsRowAsLink href="#faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>
            <span className="settings-row__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M10.6 11.3a1.4 1.4 0 1 1 2 1.3c-.5.25-.6.5-.6 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="0.8" fill="currentColor"/>
              </svg>
            </span>
            <span className="settings-row__label">자주 묻는 질문</span>
            <svg className="settings-row__chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SettingsRowAsLink>
        </Card>
      </SettingsSection>

      {/* 계정 관리 */}
      <SettingsSection>
        <p className="settings-section__title">계정 관리</p>
        <Card className="settings-list">
          <SettingsRowAsLink href="#" onClick={(e) => {
            e.preventDefault();
            showConfirm('로그아웃 하시겠습니까?', async () => {
              try {
                await logout();
                showSnackbar('로그아웃되었습니다.');
                navigate('/login', { replace: true });
              } catch (error) {
                console.error('로그아웃 에러:', error);
              }
            });
          }}>
            <span className="settings-row__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 8l4 4-4 4M8 12h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="settings-row__label">로그아웃</span>
          </SettingsRowAsLink>
          
          <SettingsRowAsLink href="#" className="is-danger" onClick={(e) => e.preventDefault()}>
            <span className="settings-row__icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9.5" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M3.5 19.5c1.2-3.3 3.5-5 6-5s4.8 1.7 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16 11h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="settings-row__label">회원탈퇴</span>
          </SettingsRowAsLink>
        </Card>
      </SettingsSection>

      <p className="app-version">앱 버전 1.4.2</p>
    </MyPageContainer>
  );
};

// Styled Components
const MyPageContainer = styled.main`
  padding: 16px 16px 88px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;

  .app-version {
    text-align: center;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 12px 0 20px;
  }
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
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

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

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.25s ease;

  &.profile-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    cursor: pointer;

    &:hover {
      transform: translateY(-3px) scale(1.015);
      box-shadow: ${({ theme }) => 
        theme.colors.cardBackground === '#FFFFFF' 
          ? '0 12px 30px rgba(25, 27, 46, 0.12)' 
          : '0 12px 30px rgba(0, 0, 0, 0.4)'};
    }

    .profile-card__edit {
      background: transparent;
      border: none;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.colors.textSecondary};
      cursor: pointer;
      padding: 0;
      flex: none;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  &.settings-list {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

const ProfileAvatar = styled.span`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.card};

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-emoji {
    font-size: 28px;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;

  .profile-card__name {
    font-size: 16px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 4px;
  }

  .profile-card__email {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SettingsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .settings-section__title {
    font-size: 13px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 0 4px;
  }
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  .settings-row__icon {
    width: 22px;
    height: 22px;
    color: ${({ theme }) => theme.colors.textPrimary};
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-row__label {
    flex: 1;
    font-size: 14.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .settings-row__chevron {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
    flex: none;
  }
`;

const SettingsRowAsLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  text-decoration: none;
  transition: background-color 0.25s, transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#F9FAFB' : '#232537'};
    transform: translateX(4px);
  }

  .settings-row__icon {
    width: 22px;
    height: 22px;
    color: ${({ theme }) => theme.colors.textPrimary};
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-row__label {
    flex: 1;
    font-size: 14.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .settings-row__chevron {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
    flex: none;
  }

  &.is-danger {
    .settings-row__icon,
    .settings-row__label {
      color: ${({ theme }) => theme.colors.brandNegative};
    }
  }
`;

const ToggleButton = styled.button`
  width: 44px;
  height: 26px;
  border-radius: 999px;
  background: #d9dbe3;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  flex: none;
  transition: background 0.2s ease;

  .toggle__knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(43, 45, 66, 0.25);
    transition: transform 0.2s ease;
  }

  &.is-on {
    background: #2b2d42;

    .toggle__knob {
      transform: translateX(18px);
    }
  }
`;
