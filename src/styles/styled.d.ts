import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      cardBackground: string;
      textPrimary: string;
      textSecondary: string;
      brandYellow: string;
      brandNegative: string;
      brandPositive: string;
      border: string;
      inputBg: string;
    };
    shadows: {
      card: string;
      bottomSheet: string;
    };
  }
}
