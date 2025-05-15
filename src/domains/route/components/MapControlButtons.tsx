import { css } from '@emotion/react';
import { Pause, Play } from 'lucide-react';
import { BsPersonWalking } from 'react-icons/bs';

import Button from '@/shared/components/common/Button';
import { COLORS } from '@/shared/constants/style';

interface MapControlButtonsProps {
    isVisible: boolean;
    isCharacterView: boolean;
    isLastPinPoint: boolean;
    isCharacterPlaying: boolean;
    handler: {
        handleDateViewClick: () => void;
        handleCharacterViewClick: () => void;
        handleCharacterPlayToggle: () => void;
    };
}

const MapControlButtons = ({
    isVisible,
    isCharacterView,
    isLastPinPoint,
    isCharacterPlaying,
    handler,
}: MapControlButtonsProps) => {
    return (
        isVisible && (
            <div css={buttonGroup}>
                <Button
                    text='날짜별 사진보기'
                    variant='white'
                    onClick={handler.handleDateViewClick}
                    customStyle={customButtonStyle('white')}
                />
                {isCharacterView ? (
                    <Button
                        text={
                            isLastPinPoint
                                ? '처음 위치로 돌아가기'
                                : isCharacterPlaying
                                  ? '잠시 멈추기'
                                  : '다음 위치로 이동하기'
                        }
                        icon={isLastPinPoint ? '' : isCharacterPlaying ? <Pause size={16} /> : <Play size={16} />}
                        onClick={handler.handleCharacterPlayToggle}
                        customStyle={customButtonStyle()}
                    />
                ) : (
                    <Button
                        text='경로로 돌아가기'
                        icon={<BsPersonWalking size={16} />}
                        onClick={handler.handleCharacterViewClick}
                        customStyle={customButtonStyle()}
                    />
                )}
            </div>
        )
    );
};

const buttonGroup = css`
    position: absolute;
    width: 100%;
    bottom: 30px;
    padding: 12px;
    display: flex;
    gap: 8px;
`;

const customButtonStyle = (variant: string = 'primary') => css`
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    color: ${variant === 'white' ? COLORS.TEXT.DESCRIPTION : ''};
    font-weight: bold;
    transition: all 0.3s ease;
`;

export default MapControlButtons;
