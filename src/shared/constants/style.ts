export const COLORS = {
    PRIMARY: '#0073bb',
    SECONDARY: '#404040',
    PRIMARY_HOVER: '#005d96',
    TEXT: {
        BLACK: '#404040',
        WHITE: '#F1F1F1',
        PLACEHOLDER: '#9ca3af',
        ERROR: '#ef4444',
        DESCRIPTION: '#4b5563',
        DESCRIPTION_LIGHT: '#8B95A1',
    },
    ICON: {
        DEFAULT: '#374151',
        LIGHT: '#9ca3af',
    },
    DISABLED: '#e5e7eb',
    BACKGROUND: {
        PRIMARY: '#eff6ff',
        BLACK: '#101010',
        WHITE: '#FFFFFF',
        WHITE_SECONDARY: '#f9fafb',
        ICON: '#8B95A1',
    },
    ALERT: {
        DEFAULT: {
            TEXT: '#4b5563',
            BACKGROUND: '#f3f4f6',
        },
        PRIMARY: {
            TEXT: '#0073bb',
            BACKGROUND: '#eff6ff',
        },
        SUCCESS: {
            TEXT: '#065f46',
            BACKGROUND: '#d1fae5',
        },
        WARNING: {
            TEXT: '#fff9db',
            BACKGROUND: '#f59f00',
        },
        ERROR: {
            TEXT: '#ef4444',
            BACKGROUND: '#fff5f5',
        },
    },
    BORDER: '#e5e7eb',
    BOX_SHADOW: {
        DEFAULT: 'rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
        INPUT_FOCUS: 'rgba(0, 115, 187, 0.2) 0 0 0 3px ;',
    },
} as const;

export const FONT_SIZES = {
    XS: '10px',
    SM: '12px',
    MD: '14px',
    LG: '16px',
    XL: '18px',
    XXL: '20px',
    XXXL: '24px',
} as const;
