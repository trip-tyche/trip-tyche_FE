import { css } from '@emotion/react';
import { Touchpad } from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';

type AvatarSize = 'lg' | 'sm';

const Avatar = ({ size = 'lg', isDot }: { size?: AvatarSize; isDot?: boolean }) => {
    return (
        <div css={container}>
            <div css={iconContainer(size)}>
                <Touchpad size={size === 'lg' ? 24 : 20} color={COLORS.PRIMARY} />
            </div>
            {isDot && <div css={dot} />}
        </div>
    );
};

const container = css`
    position: relative;
`;

const iconContainer = (size: string) => css`
    width: ${size === 'lg' ? '48px' : '36px'};
    height: ${size === 'lg' ? '48px' : '36px'};
    background-color: #dbeafe;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const dot = css`
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background-color: ${COLORS.PRIMARY};
    border-radius: 50%;
    border: 2px solid white;
`;

export default Avatar;
