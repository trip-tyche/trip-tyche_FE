import { css } from '@emotion/react';

const LogoImages = () => {
    return (
        <div css={LogoImagesStyle}>
            <img src='/public/character.png' className='characterImg' alt='character' />
            <img src='/public/earth.png' className='earthImg' alt='earth' />
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
