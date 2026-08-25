import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface NotificationConfig {
  all: boolean;
  ledgerReminder: boolean;
  budgetAlert: boolean;
  savingsGoal: boolean;
  virtualDelivery: boolean;
  aiReport: boolean;
}

const STORAGE_KEY = 'simspend_notification_settings';

const defaultConfig: NotificationConfig = {
  all: true,
  ledgerReminder: true,
  budgetAlert: true,
  savingsGoal: true,
  virtualDelivery: true,
  aiReport: true
};

export const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<NotificationConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage error fallback
    }
  }, [settings]);

  const handleToggle = (key: keyof NotificationConfig) => {
    if (key === 'all') {
      const nextAll = !settings.all;
      setSettings({
        all: nextAll,
        ledgerReminder: nextAll,
        budgetAlert: nextAll,
        savingsGoal: nextAll,
        virtualDelivery: nextAll,
        aiReport: nextAll
      });
    } else {
      setSettings(prev => {
        const nextState = { ...prev, [key]: !prev[key] };
        // 개별 알림 중 하나라도 켜지면 all은 true, 전부 꺼지면 all은 false
        const anyActive = 
          nextState.ledgerReminder || 
          nextState.budgetAlert || 
          nextState.savingsGoal || 
          nextState.virtualDelivery || 
          nextState.aiReport;
        return {
          ...nextState,
          all: anyActive
        };
      });
    }
  };

  return (
    <NotiContainer>
      {/* 1. 상단 헤더 */}
      <PageHeader>
        <BackButton onClick={() => navigate('/mypage')} aria-label="더보기로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5 8 12l7 7" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackButton>
        <HeaderTitle>알림 설정</HeaderTitle>
      </PageHeader>

      {/* 2. 전체 알림 마스터 카드 */}
      <MasterCard>
        <MasterInfo>
          <MasterTitle>전체 알림 허용</MasterTitle>
          <MasterDesc>SimSpend의 모든 필수 소비 알림을 수신합니다.</MasterDesc>
        </MasterInfo>
        <ToggleButton
          type="button"
          className={settings.all ? 'is-on' : ''}
          onClick={() => handleToggle('all')}
          role="switch"
          aria-checked={settings.all}
          aria-label="전체 알림 설정"
        >
          <span className="toggle__knob" />
        </ToggleButton>
      </MasterCard>

      {/* 3. 개별 알림 섹션 */}
      <SectionTitle>맞춤 알림 설정</SectionTitle>

      <SettingsListCard>
        {/* 가계부 작성 알림 */}
        <SettingRow>
          <RowIcon>✍️</RowIcon>
          <RowTextWrap>
            <RowTitle>가계부 작성 알림</RowTitle>
            <RowDesc>매일 저녁 9시 오늘 사용한 지출 기록 알림</RowDesc>
          </RowTextWrap>
          <ToggleButton
            type="button"
            className={settings.ledgerReminder ? 'is-on' : ''}
            onClick={() => handleToggle('ledgerReminder')}
            role="switch"
            aria-checked={settings.ledgerReminder}
            aria-label="가계부 작성 알림"
          >
            <span className="toggle__knob" />
          </ToggleButton>
        </SettingRow>

        {/* 예산 초과 알림 */}
        <SettingRow>
          <RowIcon>⚠️</RowIcon>
          <RowTextWrap>
            <RowTitle>예산 초과 알림</RowTitle>
            <RowDesc>설정한 이번 달 예산의 80%, 100% 초과 시 알림</RowDesc>
          </RowTextWrap>
          <ToggleButton
            type="button"
            className={settings.budgetAlert ? 'is-on' : ''}
            onClick={() => handleToggle('budgetAlert')}
            role="switch"
            aria-checked={settings.budgetAlert}
            aria-label="예산 초과 알림"
          >
            <span className="toggle__knob" />
          </ToggleButton>
        </SettingRow>

        {/* 목표 저축 진행 알림 */}
        <SettingRow>
          <RowIcon>🎯</RowIcon>
          <RowTextWrap>
            <RowTitle>목표 저축 진행 알림</RowTitle>
            <RowDesc>저축 목표 달성 현황 및 D-day 임박 알림</RowDesc>
          </RowTextWrap>
          <ToggleButton
            type="button"
            className={settings.savingsGoal ? 'is-on' : ''}
            onClick={() => handleToggle('savingsGoal')}
            role="switch"
            aria-checked={settings.savingsGoal}
            aria-label="목표 저축 진행 알림"
          >
            <span className="toggle__knob" />
          </ToggleButton>
        </SettingRow>

        {/* 가상 구매/배송 상태 알림 */}
        <SettingRow>
          <RowIcon>📦</RowIcon>
          <RowTextWrap>
            <RowTitle>가상 구매/배송 상태 알림</RowTitle>
            <RowDesc>가상 주문 완료 및 배송 준비·도착 상태 알림</RowDesc>
          </RowTextWrap>
          <ToggleButton
            type="button"
            className={settings.virtualDelivery ? 'is-on' : ''}
            onClick={() => handleToggle('virtualDelivery')}
            role="switch"
            aria-checked={settings.virtualDelivery}
            aria-label="가상 구매/배송 상태 알림"
          >
            <span className="toggle__knob" />
          </ToggleButton>
        </SettingRow>

        {/* AI 소비 리포트 알림 */}
        <SettingRow>
          <RowIcon>🤖</RowIcon>
          <RowTextWrap>
            <RowTitle>AI 소비 리포트 알림</RowTitle>
            <RowDesc>주간/월간 소비 패턴 분석 및 지출 방어 리포트 도착</RowDesc>
          </RowTextWrap>
          <ToggleButton
            type="button"
            className={settings.aiReport ? 'is-on' : ''}
            onClick={() => handleToggle('aiReport')}
            role="switch"
            aria-checked={settings.aiReport}
            aria-label="AI 소비 리포트 알림"
          >
            <span className="toggle__knob" />
          </ToggleButton>
        </SettingRow>
      </SettingsListCard>

      {/* 4. 안내 문구 */}
      <FooterNote>
        * 기기 자체의 알림 권한이 꺼져있는 경우 푸시 알림이 정상 수신되지 않을 수 있습니다.
      </FooterNote>
    </NotiContainer>
  );
};

// === styled-components ===

const NotiContainer = styled.main`
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

const MasterCard = styled.section`
  background: linear-gradient(135deg, #1E1F2E 0%, #2B2D42 100%);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.card};
  color: #FFFFFF;
`;

const MasterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MasterTitle = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: #FFFFFF;
`;

const MasterDesc = styled.p`
  font-size: 12px;
  color: #CBD5E1;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 800;
  color: #2B2D42;
  margin-top: 6px;
`;

const SettingsListCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const RowIcon = styled.div`
  font-size: 22px;
  flex: none;
`;

const RowTextWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const RowTitle = styled.h4`
  font-size: 14.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RowDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.35;
`;

const ToggleButton = styled.button`
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: #CBD5E1;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: background-color 0.2s ease;
  flex: none;

  .toggle__knob {
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease;
  }

  &.is-on {
    background: #FFAE00;

    .toggle__knob {
      transform: translateX(20px);
    }
  }
`;

const FooterNote = styled.p`
  font-size: 11.5px;
  color: #94A3B8;
  line-height: 1.5;
  padding: 0 4px;
`;
