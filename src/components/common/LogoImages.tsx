import { css } from '@emotion/react';

import characterImg from '@/assets/images/character.png';
import earthImg from '@/assets/images/earth.png';

const LogoImages = () => (
    <div css={LogoImagesStyle}>
        <img src={characterImg} className='characterImg' alt='character' />
        <img src={earthImg} className='earthImg' alt='earth' />
    </div>
);

export default LogoImages;

const LogoImagesStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .characterImg {
        width: 55px;
        z-index: 1;
    }

    .earthImg {
        width: 300px;
        margin-top: -45px;
    }
`;
