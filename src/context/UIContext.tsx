import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

interface UIContextType {
  showSnackbar: (message: string) => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarActive, setSnackbarActive] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  // Auto-dismiss logic for Snackbar
  useEffect(() => {
    if (snackbarMessage) {
      setSnackbarActive(true);
      const timer = setTimeout(() => {
        setSnackbarActive(false);
      }, 3000); // 3 seconds display
      return () => clearTimeout(timer);
    }
  }, [snackbarMessage]);

  // Transition end helper for snackbar cleanup
  useEffect(() => {
    if (!snackbarActive && snackbarMessage) {
      const timer = setTimeout(() => {
        setSnackbarMessage(null);
      }, 300); // Wait for fade-out animation
      return () => clearTimeout(timer);
    }
  }, [snackbarActive, snackbarMessage]);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarActive(true);
  }, []);

  const showConfirm = useCallback((message: string, onConfirm: () => void) => {
    setConfirmMessage(message);
    setOnConfirmCallback(() => onConfirm);
    setConfirmOpen(true);
  }, []);

  const handleConfirmClose = useCallback(() => {
    setConfirmOpen(false);
    setOnConfirmCallback(null);
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    handleConfirmClose();
  }, [onConfirmCallback, handleConfirmClose]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmOpen) {
        handleConfirmClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmOpen, handleConfirmClose]);

  return (
    <UIContext.Provider value={{ showSnackbar, showConfirm }}>
      {children}

      {/* Snackbar Alert */}
      {snackbarMessage && (
        <SnackbarContainer>
          <SnackbarCard className={snackbarActive ? '' : 'fade-out'}>
            <CheckIconWrapper>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#FFAA00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </CheckIconWrapper>
            <SnackbarText>{snackbarMessage}</SnackbarText>
          </SnackbarCard>
        </SnackbarContainer>
      )}

      {/* Confirm Modal */}
      {confirmOpen && (
        <ModalOverlay onClick={handleConfirmClose}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <WarningIconWrapper>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="#FFAA00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </WarningIconWrapper>
            <ModalMessage>{confirmMessage}</ModalMessage>
            <ButtonContainer>
              <CancelButton type="button" onClick={handleConfirmClose}>
                취소
              </CancelButton>
              <ConfirmButton type="button" onClick={handleConfirmAction}>
                로그아웃
              </ConfirmButton>
            </ButtonContainer>
          </ModalCard>
        </ModalOverlay>
      )}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

// Styled Components
const SnackbarContainer = styled.div`
  position: fixed;
  top: calc(24px + env(safe-area-inset-top));
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  width: calc(100% - 32px);
  max-width: 400px;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const slideDownFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUpFadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const SnackbarCard = styled.div`
  pointer-events: auto;
  background: #1C1E30; /* Premium Charcoal/Deep Navy */
  color: #FFFFFF;
  padding: 12px 18px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 170, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 10px;
  
  animation: ${slideDownFadeIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  
  &.fade-out {
    animation: ${slideUpFadeOut} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const CheckIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 170, 0, 0.12);
  border-radius: 50%;
  flex: none;
`;

const SnackbarText = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.3px;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 16, 26, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 2010;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out forwards;
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 320px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${zoomIn} 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

const WarningIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#FFFDF5' : '#232014'};
  border-radius: 50%;
  margin-bottom: 16px;
  
  svg {
    stroke: ${({ theme }) => theme.colors.brandYellow};
  }
`;

const ModalMessage = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 24px 0;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.cardBackground === '#FFFFFF' ? '#F9FAFB' : '#202336'};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.brandYellow};
  color: #191B2E;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 170, 0, 0.15);
  transition: all 0.2s;
  
  &:hover {
    background: #e59d00;
  }
`;
