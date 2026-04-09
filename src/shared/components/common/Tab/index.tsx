import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/style';

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
    font-weight: 500;
    text-align: center;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    color: ${COLORS.TEXT.SECONDARY};
    user-select: none;
    transition: color 0.2s ease, border-color 0.2s ease;
`;

const activeTab = css`
    color: ${COLORS.PRIMARY};
    border-bottom-color: ${COLORS.PRIMARY};
`;

export default Tab;
