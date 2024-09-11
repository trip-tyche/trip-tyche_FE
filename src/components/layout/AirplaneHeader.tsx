import { css } from '@emotion/react';
import { Plane } from 'lucide-react';

import theme from '@/styles/theme';

const AirplaneHeader = (): JSX.Element => (
    <>
        <div css={AirplaneHeaderStyle}>
            <div css={AirplaneSvgContainerStyle}>
                <Plane size={32} />
            </div>
        </div>
    </>
);

export default AirplaneHeader;

const AirplaneHeaderStyle = css`
    height: ${theme.heights.medium_44};
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid #333;
`;

const AirplaneSvgContainerStyle = css`
    margin-top: ${theme.heights.medium_44};
    padding: 0 6px;
    background-color: ${theme.colors.white};
`;
