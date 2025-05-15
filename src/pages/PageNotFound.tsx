// import { css } from '@emotion/react';
// import { MapPin, Home, RouteOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import { ROUTES } from '@/shared/constants/paths';
// import { COLORS } from '@/shared/constants/theme';

// const PageNotFound = () => {
//     const navigate = useNavigate();
//     return (
//         <div css={page}>
//             <div css={iconContainer}>
//                 <div css={iconContent}>
//                     <div css={routeIcon}>
//                         <RouteOff size={48} color={COLORS.PRIMARY} />
//                     </div>
//                     <div css={pinIcon}>
//                         <MapPin size={40} color={COLORS.TEXT.ERROR} />
//                     </div>
//                 </div>

//                 <div css={iconShadow}></div>
//             </div>

//             <h1 css={title}>Page Not Found</h1>
//             <h2 css={subTitle}>길을 잃으셨나요?</h2>
//             <p css={description}>
//                 찾으시는 페이지를 발견하지 못했습니다.
//                 <br />
//                 새로운 여행을 시작하거나 홈으로 돌아가세요.
//             </p>

//             <button css={primaryButton} onClick={() => navigate(`${ROUTES.PATH.MAIN}`)}>
//                 <Home css={buttonIcon} />
//                 홈으로 돌아가기
//             </button>
//         </div>
//     );
// };

// const page = css`
//     max-width: 500px;
//     height: 100dvh;
//     padding: 32px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     position: relative;
//     text-align: center;
//     background-color: #f8fafc;
// `;

// const iconContainer = css`
//     position: relative;
//     margin-bottom: 3rem;
// `;

// const iconContent = css`
//     position: relative;
//     width: 120px;
//     height: 120px;
// `;

// const routeIcon = css`
//     position: absolute;
//     inset: 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: #dbeafe;
//     border-radius: 50%;
//     opacity: 0.9;
// `;

// const pinIcon = css`
//     position: absolute;
//     top: -18px;
//     left: 50%;
//     transform: translateX(-50%);
// `;

// const iconShadow = css`
//     width: 80px;
//     height: 10px;
//     position: absolute;
//     bottom: -8px;
//     left: 50%;
//     transform: translateX(-50%);
//     background-color: #cbd5e1;
//     border-radius: 50%;
//     opacity: 0.3;
// `;

// const title = css`
//     font-size: 36px;
//     font-weight: 700;
//     color: ${COLORS.PRIMARY};
// `;

// const subTitle = css`
//     margin: 16px 0;
//     font-size: 20px;
//     font-weight: 600;
//     color: ${COLORS.TEXT.BLACK};
// `;

// const description = css`
//     margin-bottom: 34px;
//     color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
//     line-height: 1.6;
//     font-size: 14px;
// `;

// const primaryButton = css`
//     width: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 12px 24px;
//     background-color: ${COLORS.PRIMARY};
//     height: 48px;
//     color: #f2f4f9;
//     border: none;
//     border-radius: 8px;
//     font-weight: 500;
//     cursor: pointer;
//     transition: background-color 0.2s;

//     &:hover {
//         background-color: ${COLORS.PRIMARY_HOVER};
//     }
// `;

// const buttonIcon = css`
//     width: 20px;
//     height: 20px;
//     margin-right: 0.5rem;
// `;

// export default PageNotFound;

import { css } from '@emotion/react';
import { MapPin, Home, RouteOff, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div css={page}>
            <div css={iconContainer}>
                <div css={iconContent}>
                    <div css={routeIcon}>
                        <RouteOff size={48} color={COLORS.PRIMARY} />
                    </div>
                    <div css={pinIcon}>
                        <MapPin size={40} color={COLORS.TEXT.ERROR} />
                    </div>
                    <div css={overlayIcon}>
                        <div css={pulseCircle}></div>
                    </div>
                </div>

                <div css={iconShadow}></div>
            </div>

            <h1 css={title}>Page Not Found</h1>
            <h2 css={subTitle}>길을 잃으셨나요?</h2>
            <p css={description}>
                찾으시는 페이지를 발견하지 못했습니다.
                <br />
                이전 페이지로 돌아가거나 홈에서 새로운 여행을 시작하세요.
            </p>

            <div css={buttonContainer}>
                <button css={secondaryButton} onClick={handleGoBack}>
                    <Search css={buttonIcon} />
                    이전 페이지로 돌아가기
                </button>

                <button css={primaryButton} onClick={() => navigate(`${ROUTES.PATH.MAIN}`)}>
                    <Home css={buttonIcon} />
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
};

const page = css`
    max-width: 500px;
    height: 100dvh;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    background-color: #f8fafc;
`;

const iconContainer = css`
    position: relative;
    margin-bottom: 3rem;
`;

const iconContent = css`
    position: relative;
    width: 120px;
    height: 120px;
`;

const routeIcon = css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dbeafe;
    border-radius: 50%;
    opacity: 0.9;
`;

const pinIcon = css`
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
`;

const overlayIcon = css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const pulseCircle = css`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid ${COLORS.PRIMARY};
    opacity: 0;
    animation: pulse 3s infinite;

    @keyframes pulse {
        0% {
            transform: scale(0.95);
            opacity: 0.5;
        }
        70% {
            transform: scale(1.05);
            opacity: 0;
        }
        100% {
            transform: scale(0.95);
            opacity: 0;
        }
    }
`;

const iconShadow = css`
    width: 80px;
    height: 10px;
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #cbd5e1;
    border-radius: 50%;
    opacity: 0.3;
`;

const title = css`
    font-size: 36px;
    font-weight: 700;
    color: ${COLORS.PRIMARY};
`;

const subTitle = css`
    margin: 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
`;

const description = css`
    margin-bottom: 34px;
    color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
    line-height: 1.6;
    font-size: 14px;
`;

const buttonContainer = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const primaryButton = css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background-color: ${COLORS.PRIMARY};
    height: 48px;
    color: #f2f4f9;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${COLORS.PRIMARY_HOVER};
    }
`;

const secondaryButton = css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background-color: white;
    border: 1px solid ${COLORS.BORDER};
    height: 48px;
    color: ${COLORS.TEXT.BLACK};
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f1f5f9;
    }
`;

const buttonIcon = css`
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
`;

export default PageNotFound;
