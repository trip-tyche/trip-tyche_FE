import { css } from '@emotion/react';
import characterImg from '@/assets/images/character.png';
// import barcode from '@/assets/images/barcode.png';

const BorderPass = () => {
    return (
        <div css={borderPass}>
            <div className='borderPass' css={borderPassLeft}>
                <div className='borderPass-top'>JAPAN</div>
                <div className='borderPass-mid'>
                    <img src={characterImg} alt='border-pass-character' />
                    <p>BORDER PASS</p>
                    {/* <img src={barcode} alt='border-pass-barcode' /> */}
                </div>
                <div className='borderPass-bottom'></div>
            </div>
            <div className='borderPass' css={borderPassRight}>
                <div className='borderPass-top'>원준이 형과의 뜨거운 라오스 여행</div>
                <div className='borderPass-mid'></div>
                <div className='borderPass-bottom'></div>
            </div>
        </div>
    );
};

export default BorderPass;

const borderPass = css`
    display: flex;
    width: 95%;
    height: 190px;
    cursor: pointer;

    .borderPass {
        display: flex;
        flex-direction: column;
    }

    .borderPass-top {
        border-radius: 20px 20px 0 0;
        height: 20%;
        background-color: #ff7979;
    }

    .borderPass-mid {
        flex: 1;
        background-color: #eee;
    }

    .borderPass-bottom {
        border-radius: 0 0 20px 20px;
        height: 6%;
        background-color: #ff7979;
    }
`;

const borderPassLeft = css`
    flex: 2;

    .borderPass-top {
        color: #fff;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 800;
        letter-spacing: 2px;
    }

    .borderPass-mid {
        border-right: 1px dashed #ccc;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        p {
            font-size: 12px;
            font-weight: 600;
        }
        img:first-child {
            width: 50px;
        }
        /* img:last-child {
            width: 100px;
        } */
    }
`;

const borderPassRight = css`
    flex: 5;

    .borderPass-top {
        color: #fff;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        letter-spacing: 2px;
    }
`;
