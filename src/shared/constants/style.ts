import { ThemeType } from '@/shared/types';

export const COLORS = {
    PRIMARY: '#0071e3',
    SECONDARY: '#1d1d1f',
    PRIMARY_HOVER: '#0077ed',
    TEXT: {
        BLACK: '#1d1d1f',
        TITLE: '#1d1d1f',
        WHITE: '#ffffff',
        PLACEHOLDER: 'rgba(0, 0, 0, 0.48)',
        SUCCESS: '#059669',
        ERROR: '#ef4444',
        DESCRIPTION: 'rgba(0, 0, 0, 0.8)',
        DESCRIPTION_LIGHT: 'rgba(0, 0, 0, 0.48)',
        SECONDARY: 'rgba(0, 0, 0, 0.48)',
        LINK_LIGHT: '#0066cc',
        LINK_DARK: '#2997ff',
    },
    ICON: {
        DEFAULT: '#1d1d1f',
        LIGHT: 'rgba(0, 0, 0, 0.48)',
    },
    DISABLED: 'rgba(0, 0, 0, 0.16)',
    BACKGROUND: {
        PRIMARY: '#f5f5f7',
        PRIMARY_LIGHT: 'rgba(0, 113, 227, 0.08)',
        BLACK: '#000000',
        WHITE: '#ffffff',
        WHITE_SECONDARY: '#f5f5f7',
        GRAY: '#f5f5f7',
        GRAY_LIGHT: '#f5f5f7',
        ICON: 'rgba(0, 0, 0, 0.08)',
        TOAST: '#1d1d1f',
        ERROR_LIGHT: '#fff5f5',
        BODY: '#f5f5f7',
        OVERLAY: 'rgba(0, 0, 0, 0.72)',
        OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.32)',
        NAV: 'rgba(0, 0, 0, 0.8)',
        DARK_CARD: '#272729',
    },
    BORDER: 'rgba(0, 0, 0, 0.1)',
    BORDER_LIGHT: 'rgba(0, 0, 0, 0.06)',
    BOX_SHADOW: {
        DEFAULT: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
        INPUT_FOCUS: '0 0 0 3px rgba(0, 113, 227, 0.32)',
        CARD: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
        PHOTO_CARD: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
    },
    PROGRESS: {
        BLUE: '#0071e3',
        BLUE_DARK: '#0055d4',
        GREEN: '#10b981',
        GREEN_DARK: '#059669',
    },
    BUTTON: {
        WHITE_BG: '#fafafc',
        WHITE_HOVER: '#ededf2',
        DISABLED_TEXT: 'rgba(0, 0, 0, 0.28)',
        ERROR_HOVER: '#fff5f5',
    },
    FLAG: {
        OWNER_BG: 'rgba(0, 113, 227, 0.08)',
        OWNER_BORDER: 'rgba(0, 113, 227, 0.2)',
        SHARED_BG: '#f5f5f7',
        SHARED_BORDER: 'rgba(0, 0, 0, 0.1)',
    },
    HASHTAG: {
        DEFAULT_BG: 'rgba(0, 0, 0, 0.06)',
        DEFAULT_TEXT: 'rgba(0, 0, 0, 0.48)',
    },
} as const;

export const THEME_COLORS: Record<ThemeType, { TEXT: string; BACKGROUND: string; BORDER?: string }> = {
    default: { TEXT: 'rgba(0, 0, 0, 0.8)', BACKGROUND: '#f5f5f7' },
    primary: { TEXT: '#1d1d1f', BACKGROUND: 'rgba(0, 113, 227, 0.06)' },
    success: { TEXT: '#065f46', BACKGROUND: '#f0fdf4' },
    warning: { TEXT: '#92400e', BACKGROUND: '#fffbeb', BORDER: '1px solid rgba(245, 158, 11, 0.3)' },
    error: { TEXT: '#ef4444', BACKGROUND: '#fff5f5' },
};

export const FONT_SIZES = {
    XS: '10px',
    SM: '12px',
    MD: '14px',
    LG: '17px',
    XL: '21px',
    XXL: '28px',
    XXXL: '40px',
} as const;

export const SPACING = {
    XXS: '2px',
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '24px',
    XXL: '32px',
    XXXL: '48px',
} as const;
