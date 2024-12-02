import { css, Global } from '@emotion/react';

const GoogleAutoCompleteStyle = () => (
    <Global
        styles={css`
            .pac-container {
                border-radius: 10px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                border: none;
                font-family: Arial, sans-serif;
                width: calc(100% + 54px) !important;
                max-width: calc(428px * 0.9);
                left: 50% !important;
                transform: translateX(-50%) !important;
                margin-top: 4px;
            }

            .pac-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .pac-item:hover {
                background-color: #f0f0f0;
            }

            .pac-item-query {
                font-size: 16px;
                color: #333;
            }

            .pac-matched {
                font-weight: bold;
            }

            .pac-icon {
                display: none;
            }
        `}
    />
);

export default GoogleAutoCompleteStyle;
