import { css } from '@emotion/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/paths';
import { COLORS } from '@/shared/constants/theme';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div css={page}>
            <div css={iconContainer}>
                <div css={iconContent}>
                    <div css={errorIcon}>
                        <AlertTriangle size={48} color={COLORS.TEXT.ERROR} />
                    </div>
                    <div css={overlayIcon}>
                        <div css={pulseCircle}></div>
                    </div>
                </div>

                <div css={iconShadow}></div>
            </div>

            <h1 css={title}>오류가 발생했습니다</h1>
            <h2 css={subTitle}>예상치 못한 문제가 생겼어요</h2>
            <p css={description}>
                페이지를 불러오는 중에 오류가 발생했습니다.
                <br />
                잠시 후 다시 시도하거나 홈으로 돌아가세요.
            </p>

            <div css={buttonContainer}>
                <button css={secondaryButton} onClick={handleRefresh}>
                    <RefreshCw css={buttonIcon} />
                    새로고침
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

const errorIcon = css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fee2e2;
    border-radius: 50%;
    opacity: 0.9;
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
    border: 2px solid ${COLORS.TEXT.ERROR};
    opacity: 0;
    animation: pulse 2s infinite;

    @keyframes pulse {
        0% {
            transform: scale(0.95);
            opacity: 0.7;
        }
        70% {
            transform: scale(1.1);
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
    color: ${COLORS.TEXT.ERROR};
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

export default ErrorPage;
