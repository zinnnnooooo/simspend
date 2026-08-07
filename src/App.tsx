import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@/styles/theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { Layout } from '@/components/Layout';
import { LedgerProvider } from '@/context/LedgerContext';
import { ThemeModeProvider, useThemeMode } from '@/context/ThemeContext';

// 페이지 임포트
import { Splash } from '@/pages/Splash';
import { Dashboard } from '@/pages/Dashboard';
import { Ledger } from '@/pages/Ledger';
import { Statistics } from '@/pages/Statistics';
import { Purchase } from '@/pages/Purchase';
import { MyPage } from '@/pages/MyPage';
import { Delivery } from '@/pages/Delivery';
import { Target } from '@/pages/Target';

const NavigationRedirector: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 최초 접속 시 스플래시 인트로 자동 유도
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('simspend_visited');
    if (!hasVisited && location.pathname === '/') {
      sessionStorage.setItem('simspend_visited', 'true');
      navigate('/splash', { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

const AppContent: React.FC = () => {
  return (
    <>
      <NavigationRedirector />
      <Routes>
        {/* Splash 화면: Layout(BottomNav 포함) 바깥 영역의 단독 라우트 */}
        <Route path="/splash" element={<Splash />} />

        {/* 서비스 화면들: Layout을 부모 라우트 Wrapper로 지정하여 항상 BottomNav 유지 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<Ledger />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/pay" element={<Purchase />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/target" element={<Target />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </>
  );
};

const StyledApp: React.FC = () => {
  const { isDarkMode } = useThemeMode();
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <LedgerProvider>
        <Router>
          <AppContent />
        </Router>
      </LedgerProvider>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeModeProvider>
      <StyledApp />
    </ThemeModeProvider>
  );
};

export default App;
