import type { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#009D68',
    sub: '#C2FFD3',
    banner: {
      primary: '#FCFFFC',
      sub: '#F1F8F6',
    },
    gray: {
      light: '#D9D9D9',
      medium: '#B2B3B6',
      dense: '#898A8C',
    },
    black: '#000',
    white: '#fff',
  },
  fontSize: {
    // * Regular
    r1: '0.625rem',
    r2: '0.813rem',
    r3: '0.938rem',
    r4: '1rem',
    r5: '1.25rem',
    r6: '1.438rem',
    // * Medium
    m1: '0.625rem',
    m2: '0.938rem',
    m3: '1.063rem',
    m4: '1.125rem',
    m5: '1.25rem',
    // * Semi Bold
    sb1: '0.625rem',
    sb2: '0.75rem',
    sb3: '0.938rem',
    sb4: '1.25rem',
    sb5: '1.375rem',
    sb6: '1.563rem',
    // * Bold
    b1: '0.875rem',
    b2: '1.375rem',
    // * Extra Bold
    eb1: '0.75rem',
  },
};

export default theme;
