const colors = {
  primary: '#2DC384',
  hoverPrimary: '#3BB77D',
  supportOrange: '#FF8E3D',
  alertRed: '#E45148',
  black: '#1E1E1E',
  white: '#FFFFFF',
  darkestGray: '#333D4B',
  darkGray: '#8B95A1',
  lightGray: '#E3E5EB',
  lightestGray: '#F2F3F6',
  hoverLightGray: '#D5D7DD',
  paleRed: '#E24C4C',
  paleOrange: '#F0864B',
  paleYellow: '#ECAA0A',
  paleGreen: '#29BB7E',
  paleBlue: '#2D8DC3',
  palePurple: '#8E45EA',
  bgGray: '#F6F7F9', // 배경색
  borderLightGray: '#F4F5F7',
  toastGray: '#7D7F84',
};

const pickerColors = {
  paleRed: '#F68383',
  paleOrange: '#FFAB8C',
  paleYellow: '#FAD781',
  paleGreen: '#95DB94',
  paleBlue: '#A2CDFF',
  palePurple: '#C394FF',
};

const fontSizes = {
  xsmall: '10px',
  small: '12px',
  normal: '14px',
  large: '16px',
  xlarge: '18px',
  xxlarge: '20px',
};

// input, button, toast 등의 높이를 정의
const heights = {
  short: '32px',
  medium: '40px',
  tall: '50px',
  xtall: '60px',
};

export type ColorsTypes = typeof colors;
export type FontSizeTypes = typeof fontSizes;
export type HeightsTypes = typeof heights;
export type ScheduleColorsTypes = typeof pickerColors;

interface Theme {
  colors: ColorsTypes;
  pickerColors: ScheduleColorsTypes;
  fontSizes: FontSizeTypes;
  heights: HeightsTypes;
}
// ThemeProvider 적용하기 위해 Theme 타입을 정의
const theme: Theme = {
  colors,
  pickerColors,
  fontSizes,
  heights,
};

export default theme;
