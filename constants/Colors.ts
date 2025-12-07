// Colors.ts

// Core brand colors - Purple-themed trading app aesthetic
const deepNavy = '#0A0B1A';      // main app background (darkest)
const darkNavy = '#1A1B2E';      // card backgrounds
const cardNavy = '#252638';      // elevated cards
const headerNavy = '#1E1F30';    // headers / tab bar

// Purple gradient system (primary brand color)
const purple500 = '#6C3EFF';     // main purple
const purple600 = '#5A2FE6';     // darker purple
const purple400 = '#8B5CFF';     // lighter purple
const purpleGlow = '#7B4AFF';    // glow/hover state

// Status colors
const successGreen = '#00FF88';  // bright lime green for positive
const errorRed = '#FF3366';      // vibrant red for negative
const warningOrange = '#FF9500'; // orange for warnings

// Neutrals
const white = '#FFFFFF';
const offWhite = '#F8F9FA';
const gray100 = '#E5E7EB';
const gray300 = '#D1D5DB';
const gray400 = '#9CA3AF';
const gray500 = '#8F92A1';
const gray600 = '#6B7280';
const gray700 = '#4B5563';

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
    // Main purple-themed dark mode
    text: offWhite,
    background: deepNavy,           // main screen background
    cardBackground: darkNavy,       // card backgrounds
    elevatedCard: cardNavy,         // elevated/interactive cards
    headerBackground: headerNavy,   // headers / top bars
    border: '#2A2B3E',              // subtle borders

    primary: purple500,             // main purple brand
    primaryVariant: purple600,      
    primaryText: white,
    primaryGradientStart: purple400, // for gradient buttons
    primaryGradientEnd: purple600,

    secondary: purple400,           // lighter purple for accents
    secondaryText: white,

    accent: purpleGlow,             // hover/active states

    mutedText: gray500,             // secondary text
    labelText: gray400,             // labels/captions

    success: successGreen,          // bright green
    error: errorRed,                // vibrant red
    warning: warningOrange,
    info: purple400,

    // Tab bar + icons
    tint: tintColorDark,
    tabIconDefault: gray500,
    tabIconSelected: purple400,
    tabBarBackground: darkNavy,

    // Input fields
    inputBackground: '#0F1019',    // darker input bg
    inputBorder: '#2A2B3E',
    inputFocusBorder: purple500,

    // Chips/Pills
    chipBackground: purple500,
    chipText: white,
  },
};