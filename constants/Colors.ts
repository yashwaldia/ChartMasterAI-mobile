// Colors.ts

// Core brand colors - Purple-themed trading app aesthetic (2026 Modern Update)
const deepNavy = '#121218';      // main app background (softer grey, not pure black)
const darkNavy = '#1C1C24';      // card backgrounds (improved elevation)
const cardNavy = '#252530';      // elevated cards (better contrast)
const headerNavy = '#1C1C24';    // headers / tab bar (matches card layer)

// Purple gradient system (primary brand color) - Desaturated for better accessibility
const purple500 = '#7C5CFF';     // main purple (15% less saturated)
const purple600 = '#6B4FE8';     // darker purple (smoother gradient)
const purple400 = '#8B6FFF';     // lighter purple (refined)
const purpleGlow = '#8B6FFF';    // glow/hover state (matches lighter variant)

// Status colors - Improved contrast and accessibility
const successGreen = '#00E676';  // Material Design green (better legibility)
const errorRed = '#FF5252';      // softer red (less aggressive)
const warningOrange = '#FFB74D'; // warmer orange (more approachable)

// Neutrals - Enhanced text hierarchy
const white = '#FFFFFF';
const offWhite = '#FAFAFA';      // softer white (reduced eye strain)
const gray100 = '#E5E7EB';
const gray300 = '#D1D5DB';
const gray400 = '#9CA3AF';
const gray500 = '#B8B8C0';       // improved secondary text contrast
const gray600 = '#6E6E78';       // better tertiary text
const gray700 = '#4A4A54';       // disabled state

const tintColorLight = purple500;
const tintColorDark = purple400;

export default {
  light: {
    // Light mode (minimal support, but functional)
    text: '#1A1B2E',
    background: '#F8F9FA',
    cardBackground: white,
    headerBackground: white,
    border: gray300,

    primary: purple500,
    primaryVariant: purple600,
    primaryText: white,
    primaryGradientStart: purple400,
    primaryGradientEnd: purple600,

    secondary: purple400,
    secondaryText: white,

    accent: purple500,

    mutedText: gray600,
    labelText: gray500,

    success: successGreen,
    error: errorRed,
    warning: warningOrange,
    info: purple400,

    tint: tintColorLight,
    tabIconDefault: gray400,
    tabIconSelected: tintColorLight,
    tabBarBackground: white,

    inputBackground: gray100,
    inputBorder: gray300,
  },

  dark: {
    // Main purple-themed dark mode (2026 Enhanced)
    text: offWhite,                 // softer white for reduced eye strain
    background: deepNavy,           // main screen background (no pure black)
    cardBackground: darkNavy,       // card backgrounds (improved elevation)
    elevatedCard: cardNavy,         // elevated/interactive cards (clear hierarchy)
    headerBackground: headerNavy,   // headers / top bars
    border: '#2E2E3A',              // subtle borders (slightly lighter)

    primary: purple500,             // main purple brand (desaturated)
    primaryVariant: purple600,      
    primaryText: white,
    primaryGradientStart: purple400, // for gradient buttons
    primaryGradientEnd: purple600,

    secondary: purple400,           // lighter purple for accents
    secondaryText: white,

    accent: purpleGlow,             // hover/active states

    mutedText: gray500,             // secondary text (improved contrast)
    labelText: gray600,             // labels/captions (tertiary text)

    success: successGreen,          // Material Design green
    error: errorRed,                // softer red
    warning: warningOrange,         // warmer orange
    info: purple400,

    // Tab bar + icons
    tint: tintColorDark,
    tabIconDefault: gray500,
    tabIconSelected: purple400,
    tabBarBackground: darkNavy,

    // Input fields
    inputBackground: '#16161C',    // slightly lighter for better visibility
    inputBorder: '#2E2E3A',
    inputFocusBorder: purple500,

    // Chips/Pills
    chipBackground: purple500,
    chipText: white,
  },
};
