import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@/styles/theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { Layout } from '@/components/Layout';
import { LedgerProvider } from '@/context/LedgerContext';
import { ThemeModeProvider, useThemeMode } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { UIProvider } from '@/context/UIContext';

// 페이지 임포트
import { Splash } from '@/pages/Splash';
import { Dashboard } from '@/pages/Dashboard';
import { Ledger } from '@/pages/Ledger';
import { Statistics } from '@/pages/Statistics';
import { Purchase } from '@/pages/Purchase';
import { MyPage } from '@/pages/MyPage';
import { Delivery } from '@/pages/Delivery';
import { DeliveryHome } from '@/pages/DeliveryHome';
import { StoreCategory } from '@/pages/StoreCategory';
import { StoreDetail } from '@/pages/StoreDetail';
import { OrderOption } from '@/pages/OrderOption';
import { Payment } from '@/pages/Payment';
import { Target } from '@/pages/Target';
import { Experience } from '@/pages/Experience';
import { ShoppingHome } from '@/pages/ShoppingHome';
import { ShoppingCategory } from '@/pages/ShoppingCategory';
import { ProductDetail } from '@/pages/ProductDetail';
import { ShoppingPayment } from '@/pages/ShoppingPayment';
import { VirtualHistory } from '@/pages/VirtualHistory';
import { AiReport } from '@/pages/AiReport';
import { Support } from '@/pages/Support';
import { NotificationSettings } from '@/pages/NotificationSettings';
import { Faq } from '@/pages/Faq';
import { EditProfile } from '@/pages/EditProfile';
import { Login } from '@/pages/Login';
import { useAuth } from '@/context/AuthContext';

const NavigationRedirector: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const hasVisited = sessionStorage.getItem('simspend_visited');
    
    // 1. 최초 진입 시 스플래시 유도
    if (!hasVisited && location.pathname === '/') {
      sessionStorage.setItem('simspend_visited', 'true');
      navigate('/splash', { replace: true });
      return;
    }

    // 2. 인증 가드 (비로그인 & 게스트 아닐 시 /login 이동)
    if (!user && !isGuest) {
      if (location.pathname !== '/login' && location.pathname !== '/splash') {
        navigate('/login', { replace: true });
      }
    } else {
      // 로그인 완료 또는 게스트 모드일 때 /login에 접근하면 홈으로 이동
      if (location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, navigate, user, isGuest, loading]);

  return null;
};

const AppContent: React.FC = () => {
  return (
    <>
      <NavigationRedirector />
      <Routes>
        {/* Splash 화면: Layout(BottomNav 포함) 바깥 영역의 단독 라우트 */}
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* 서비스 화면들: Layout을 부모 라우트 Wrapper로 지정하여 항상 BottomNav 유지 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<Ledger />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/pay" element={<Purchase />} />
          <Route path="/delivery-status" element={<Delivery />} />
          <Route path="/delivery" element={<DeliveryHome />} />
          <Route path="/delivery/category" element={<StoreCategory />} />
          <Route path="/delivery/store/:id" element={<StoreDetail />} />
          <Route path="/delivery/option/:storeId/:menuName" element={<OrderOption />} />
          <Route path="/delivery/payment" element={<Payment />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/shopping" element={<ShoppingHome />} />
          <Route path="/shopping/category" element={<ShoppingCategory />} />
          <Route path="/shopping/product/:id" element={<ProductDetail />} />
          <Route path="/shopping/payment" element={<ShoppingPayment />} />
          <Route path="/virtual-history" element={<VirtualHistory />} />
          <Route path="/ai-report" element={<AiReport />} />
          <Route path="/target" element={<Target />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notification-settings" element={<NotificationSettings />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/edit-profile" element={<EditProfile />} />
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
          <UIProvider>
            <AppContent />
          </UIProvider>
        </Router>
      </LedgerProvider>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <StyledApp />
      </AuthProvider>
    </ThemeModeProvider>
  );
};

export default App;
