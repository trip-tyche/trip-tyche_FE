import { css } from '@emotion/react';
import characterImg from '@/assets/images/character.png';
import earthImg from '@/assets/images/earth.png';

const LogoImages = () => {
    return (
        <div css={LogoImagesStyle}>
            <img src={characterImg} className='characterImg' alt='character' />
            <img src={earthImg} className='earthImg' alt='earth' />
        </div>
    );
};

export default LogoImages;

const LogoImagesStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .characterImg {
        width: 55px;
        z-index: 1;
    }

    .earthImg {
        width: 320px;
        margin-top: -45px;
    }
`;
