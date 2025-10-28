import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box
  }

  html {
    height: 100%;
    font-size: 16px;
  }

  html:focus-within {
  scroll-behavior: smooth;
}
  
  body{
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  a { 
    color: inherit; 
    text-decoration: none;
  }

  input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

.loader {
  /* position: fixed;
  top: 10px;
  right: 10px; */
  margin: 10px;
  background: ${({ theme }) => theme.colors.accent};
  width: max-content;
  padding: 6px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-size: 14px;
  animation: blink 0.5s infinite alternate;
}

@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0.6; }
}

`;
