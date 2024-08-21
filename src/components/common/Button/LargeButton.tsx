import { css } from '@emotion/react';

interface LargeButtonProps {
    text: string;
    theme: 'pri' | 'sec';
}

const LargeButton = ({ text, theme }: LargeButtonProps): JSX.Element => {
    return <button css={SmallButtonStyle(theme)}>{text}</button>;
};

export default LargeButton;

const SmallButtonStyle = (theme: 'pri' | 'sec') => css`
    padding: 8px 16px;
    border-radius: 10px;
    border: 2px solid #333;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: 220px;
    height: 40px;
    transition: background-color 0.3s ease;

    color: ${theme === 'pri' ? '#000' : '#000'};
    background-color: ${theme === 'pri' ? '#000' : '#333'};

    &:hover {
        color: ${theme === 'pri' ? '#000' : '#000'};
        background-color: ${theme === 'pri' ? '#000' : '#fff'};
    }

    &:active {
        opacity: 0.8;
    }
`;
