import { css } from '@emotion/react';

import Tab from '@/shared/components/common/Tab';
import { COLORS } from '@/shared/constants/style';
import { TabItem } from '@/shared/types';

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onActiveChange: (activeTab: string) => void;
}

const TabNavigation = ({ tabs, activeTab, onActiveChange }: TabNavigationProps) => {
    return (
        <div css={tabNavigationStyle}>
            {tabs.map((tab) => (
                <Tab
                    key={tab.id}
                    isActive={activeTab === tab.id}
                    title={tab.title}
                    onChange={() => onActiveChange(tab.id)}
                />
            ))}
        </div>
    );
};

const tabNavigationStyle = css`
    display: flex;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
`;

export default TabNavigation;
