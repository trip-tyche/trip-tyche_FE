import { css } from '@emotion/react';

interface TabProps {
    isActive: boolean;
    title: string;
    onChange: () => void;
}

const Tab = ({ isActive, title, onChange }: TabProps) => {
    return (
        <button css={[tab, isActive && activeTab]} onClick={() => onChange()}>
            {title}
        </button>
    );
};

const tab = css`
    flex: 1;
    padding: 12px 0;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.224px;
    text-align: center;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    color: #64748b;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
`;

const activeTab = css`
    color: #0071e3;
    font-weight: 600;
    border-bottom: 2px solid #0071e3;
`;

export default Tab;
