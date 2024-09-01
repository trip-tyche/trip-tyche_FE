import { css } from '@emotion/react';

import AirplaneSvg from '../../../assets/icons/AirplaneSvg';

const AirplaneHeader = (): JSX.Element => (
    <>
        <div css={AirplaneHeaderStyle}>
            <div css={AirplaneSvgContainerStyle}>
                <AirplaneSvg />
            </div>
        </div>
    </>
);

export default AirplaneHeader;

const AirplaneHeaderStyle = css`
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid #333;
`;

const AirplaneSvgContainerStyle = css`
    margin-top: 48px;
    padding: 0 6px;
    background-color: #fff;
`;
