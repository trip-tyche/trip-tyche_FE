import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/theme';

interface TabProps {
    isActive: boolean;
    title: string;
    onChange: () => void;
}

const Tab = ({ isActive, title, onChange }: TabProps) => {
    return (
        <button css={[tabButtonStyle, isActive && activeTabStyle]} onClick={() => onChange()}>
            {title}
        </button>
    );
};

const tabButtonStyle = css`
    flex: 1;
    padding: 12px 0;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
`;

const activeTabStyle = css`
    color: ${COLORS.PRIMARY};
    border-bottom: 2px solid ${COLORS.PRIMARY};
`;

export default Tab;
