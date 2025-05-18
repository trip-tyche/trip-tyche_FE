import { css } from '@emotion/react';
import { Touchpad } from 'lucide-react';

import { COLORS } from '@/shared/constants/style';

type SizeType = 'lg' | 'sm';
type ShapeType = 'circle' | 'rectangle';

interface AvatarProp {
    size?: SizeType;
    shape?: ShapeType;
    icon?: React.ReactNode;
    isDot?: boolean;
}

const Avatar = ({
    size = 'lg',
    shape = 'rectangle',
    icon = <Touchpad size={size === 'lg' ? 24 : 20} color={COLORS.PRIMARY} />,
    isDot,
}: AvatarProp) => {
    return (
        <div css={container}>
            <div css={iconContainer(size, shape)}>{icon}</div>
            {isDot && <div css={dot} />}
        </div>
    );
};

const container = css`
    position: relative;
`;

const iconContainer = (size: string, shape: string) => css`
    width: ${size === 'lg' ? '48px' : '36px'};
    height: ${size === 'lg' ? '48px' : '36px'};
    background-color: #dbeafe;
    border-radius: ${shape === 'rectangle' ? '8px' : '9999px'};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;
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
