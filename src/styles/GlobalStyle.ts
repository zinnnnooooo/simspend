import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  body {
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
      "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
  }

  img, svg {
    display: block;
    max-width: 100%;
  }

  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
    color: inherit;
    outline: none;
    transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s, filter 0.2s;
  }

  button:hover {
    filter: brightness(1.06);
  }

  button:active {
    transform: scale(0.96);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  input, select, textarea {
    font-family: inherit;
    color: inherit;
    outline: none;
    border: none;
  }

  /* 스크린 리더용 숨김 클래스 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* 스크롤바 UI 완전히 숨김 (모든 브라우저 대응, 스크롤 기능 및 레이아웃 유지) */
  * {
    -ms-overflow-style: none !important; /* IE and Edge */
    scrollbar-width: none !important; /* Firefox */
  }

  *::-webkit-scrollbar {
    display: none !important; /* Chrome, Safari, Edge, Opera */
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }
`;
