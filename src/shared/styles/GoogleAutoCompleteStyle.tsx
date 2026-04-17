import { css, Global } from '@emotion/react';

const GoogleAutoCompleteStyle = () => (
    <Global
        styles={css`
            .pac-container {
                border-radius: 12px;
                box-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;
                border: none;
                font-family: 'SF Pro Text', 'Helvetica Neue', Helvetica, sans-serif;
                width: calc(100% + 54px) !important;
                max-width: calc(428px * 0.9);
                left: 50% !important;
                transform: translateX(-50%) !important;
                margin-top: 4px;
                background: #ffffff;
                box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 20px 0px;
            }

            .pac-item {
                padding: 12px 16px;
                cursor: pointer;
                transition: background-color 0.15s;
                letter-spacing: -0.224px;
            }

            .pac-item:hover {
                background-color: #f5f5f7;
            }

            .pac-item-query {
                font-size: 15px;
                color: #1d1d1f;
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
