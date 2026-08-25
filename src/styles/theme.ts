import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#F5F6F9', // Seated Cool Gray Background
    cardBackground: '#FFFFFF',
    textPrimary: '#191B2E', // Premium Deep Navy
    textSecondary: '#8C94A7', // Enhanced contrast secondary text
    brandYellow: '#FFAA00', // Refined SimSpend Orange
    brandNegative: '#FF5B62', // Soft Coral Red
    brandPositive: '#42B883', // Soft Green
    border: '#EBECEF',
    inputBg: '#F1F3F6',
  },
  shadows: {
    card: '0 8px 30px rgba(25, 27, 46, 0.04)', // Very soft ambient shadow
    bottomSheet: '0 -10px 40px rgba(25, 27, 46, 0.08)',
  }
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#0F101A', // Deeper modern dark background
    cardBackground: '#191B2E', // Deep Navy surface for dark mode
    textPrimary: '#F5F6F9',
    textSecondary: '#8C94A7',
    brandYellow: '#FFAA00',
    brandNegative: '#FF5B62',
    brandPositive: '#42B883',
    border: '#25283D',
    inputBg: '#202336',
  },
  shadows: {
    card: '0 8px 30px rgba(0, 0, 0, 0.25)',
    bottomSheet: '0 -10px 40px rgba(0, 0, 0, 0.35)',
  }
};
