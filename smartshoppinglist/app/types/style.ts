/**
 * Style & Theme Types - UI Styling and Theming Configuration
 * Contains all types related to styling, theming, variants, and visual configuration
 */

// === UI STYLE & THEME TYPES ===

// Individual variant types for backward compatibility
export interface ButtonVariant {
  base: string
  primary: string
  secondary: string
  danger: string
  success: string
  warning: string
}

export interface ContainerVariant {
  base: string
  card: string
  section: string
  modal: string
}

export interface InputVariant {
  base: string
  default: string
  error: string
  success: string
  highlighted: string
}

export interface ItemVariant {
  pending: string
  inCart: string
  purchased: string
}

// Consolidated style variants for consistent theming
export interface StyleVariants {
  button: ButtonVariant
  container: ContainerVariant
  input: InputVariant
  item: ItemVariant
}

// === THEME CONFIGURATION ===

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export interface ThemeTypography {
  fontFamily: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    xxl: string
  }
  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }
}

export interface ThemeBorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  full: string
}

export interface ThemeShadows {
  sm: string
  md: string
  lg: string
  xl: string
}

export interface Theme {
  mode: ThemeMode
  colors: ThemeColors
  spacing: ThemeSpacing
  typography: ThemeTypography
  borderRadius: ThemeBorderRadius
  shadows: ThemeShadows
}

// === COMPONENT STYLING TYPES ===

export interface ComponentStyleProps {
  variant?: string
  size?: 'sm' | 'md' | 'lg'
  color?: keyof ThemeColors
  rounded?: keyof ThemeBorderRadius
  shadow?: keyof ThemeShadows
}

export interface ResponsiveStyleProps {
  mobile?: ComponentStyleProps
  tablet?: ComponentStyleProps
  desktop?: ComponentStyleProps
}

// === ANIMATION & TRANSITION TYPES ===

export type EasingFunction = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'

export interface AnimationConfig {
  duration: number
  delay?: number
  easing?: EasingFunction
  iterations?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
}

export interface TransitionConfig {
  property: string
  duration: number
  easing?: EasingFunction
  delay?: number
}

// === LAYOUT TYPES ===

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
export type AlignItems = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline'

export interface FlexLayoutProps {
  direction?: FlexDirection
  wrap?: FlexWrap
  justify?: JustifyContent
  align?: AlignItems
  gap?: keyof ThemeSpacing
}

export interface GridLayoutProps {
  columns?: number | string
  rows?: number | string
  gap?: keyof ThemeSpacing
  autoFit?: boolean
  autoFill?: boolean
  minColumnWidth?: string
}

// === ACCESSIBILITY STYLING ===

export interface A11yStyleProps {
  highContrast?: boolean
  reducedMotion?: boolean
  focusVisible?: boolean
  screenReaderOnly?: boolean
}
