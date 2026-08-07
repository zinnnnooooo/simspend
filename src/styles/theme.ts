import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#F8F9FC',
    cardBackground: '#FFFFFF',
    textPrimary: '#1E1F2E',
    textSecondary: '#8B8D9B',
    brandYellow: '#FFAE00',
    brandNegative: '#FF5C5C',
    brandPositive: '#2F9E6E',
    border: '#ECEDF1',
    inputBg: '#ECEDF1',
  },
  shadows: {
    card: '0 8px 24px rgba(0, 0, 0, 0.04)',
    bottomSheet: '0 -10px 30px rgba(0, 0, 0, 0.08)',
  }
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#121218',
    cardBackground: '#1E1F2E',
    textPrimary: '#FFFFFF',
    textSecondary: '#8B8D9B',
    brandYellow: '#FFAE00',
    brandNegative: '#FF7D7D',
    brandPositive: '#43C68A',
    border: '#2D2E3C',
    inputBg: '#2D2E3C',
  },
  shadows: {
    card: '0 8px 24px rgba(0, 0, 0, 0.2)',
    bottomSheet: '0 -10px 30px rgba(0, 0, 0, 0.3)',
  }
};
