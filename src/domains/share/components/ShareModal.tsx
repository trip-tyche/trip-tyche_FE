import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Search, Send, AlertCircle } from 'lucide-react';

import { useTripShare } from '@/domains/share/hooks/useTripShare';
import { NICKNAME_FORM } from '@/domains/user/constants';
import { validateUserNickName } from '@/libs/utils/validate';
import Avatar from '@/shared/components/Avatar';
import Modal from '@/shared/components/common/Modal';
import { COLORS } from '@/shared/constants/theme';
import { useToastStore } from '@/shared/stores/useToastStore';

export interface ShareModalProps {
    tripKey: string;
    tripTitle: string;
    startDate: string;
    endDate: string;
    onClose: () => void;
}

const ShareModal = ({ tripKey, tripTitle, onClose, startDate, endDate }: ShareModalProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const { showToast } = useToastStore.getState();
    const { isSharing, error: errorResult, shareTrip, clearError } = useTripShare(inputValue, tripKey!, onShareSuccess);

    useEffect(() => {
        const error = validateUserNickName(inputValue, NICKNAME_FORM.MIN_LENGTH, NICKNAME_FORM.MAX_LENGTH);
        setIsValid(error.valid);
        setErrorMessage(error.message);
    }, [inputValue]);

    function onShareSuccess() {
        onClose();
        showToast(`'${inputValue}'님께 여행 공유를 요청했습니다`);
    }

    const closeModal = () => {
        onClose?.();
        setInputValue('');
        clearError();
    };

    const disabled = !isValid || isSharing || inputValue.trim().length === 0;

    return (
        <Modal closeModal={closeModal} customStyle={customModalStyle}>
            <h2 css={titleStyle}>티켓 공유하기</h2>

            <div css={ticketPreviewStyle}>
                <Avatar />
                <div css={ticketContentStyle}>
                    <p css={ticketTitleStyle}>{tripTitle}</p>
                    <p css={ticketDatesStyle}>{`${startDate} ~ ${endDate}`}</p>
                </div>
            </div>

            <p css={descriptionStyle}>
                함께 여행 티켓을 관리할 친구를 추가해 보세요!
                <br />
                친구에게 초대 알림이 전송됩니다
            </p>

            <div css={searchContainerStyle}>
                <div css={inputContainerStyle(isValid)}>
                    <div css={searchIconStyle}>
                        <Search size={20} color={COLORS.ICON.LIGHT} />
                    </div>
                    <input
                        type='text'
                        placeholder={'친구 닉네임 검색'}
                        css={searchInputStyle}
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        maxLength={NICKNAME_FORM.MAX_LENGTH + 1}
                    />
                </div>

                <div css={inputInfoStyle}>
                    {errorMessage ? (
                        <p css={errorMessageStyle}>
                            <AlertCircle size={12} />
                            <span css={errorTextStyle}>{errorMessage}</span>
                        </p>
                    ) : (
                        <p css={inputHintStyle}>한글, 영문, 숫자 조합 가능 (특수문자 제외)</p>
                    )}
                    <p css={charCountStyle(inputValue.length > NICKNAME_FORM.MAX_LENGTH)}>
                        {inputValue.length}/{NICKNAME_FORM.MAX_LENGTH}자
                    </p>
                </div>
            </div>

            {errorResult && <p css={errorReulstMessageStyle}>{errorResult}</p>}

            <div css={buttonsContainerStyle}>
                <button css={cancelButtonStyle} onClick={closeModal}>
                    취소
                </button>
                <button css={confirmButtonStyle(!disabled)} disabled={disabled} onClick={shareTrip}>
                    <Send size={16} css={sendIconStyle} />
                    <span>공유하기</span>
                </button>
            </div>
        </Modal>
    );
};

const customModalStyle = css`
    width: 400px;
`;

const titleStyle = css`
    font-size: 18px;
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
    margin-top: 8px;
    margin-bottom: 20px;
`;

const ticketPreviewStyle = css`
    width: 100%;
    background-color: ${COLORS.BACKGROUND.PRIMARY};
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
`;

const ticketContentStyle = css`
    margin-left: 12px;
`;

const ticketTitleStyle = css`
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.TEXT.BLACK};
    margin: 0;
    margin-bottom: 6px;
`;

const ticketDatesStyle = css`
    font-size: 12px;
    color: #6b7280;
    margin: 0;
`;

const descriptionStyle = css`
    width: 100%;
    text-align: center;
    margin: 16px 0 28px;
    font-size: 14px;
    color: #374151;
    line-height: 1.4;
`;

const searchContainerStyle = css`
    width: 100%;
    padding: 0 8px;
    margin-bottom: 24px;
`;

const inputContainerStyle = (isValid: boolean) => css`
    position: relative;
    border: 1px solid ${isValid ? COLORS.BORDER : COLORS.TEXT.ERROR};
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
`;

const searchIconStyle = css`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${COLORS.ICON.LIGHT};
    pointer-events: none;
`;

const searchInputStyle = css`
    width: 100%;
    padding: 10px 16px 10px 40px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;

    &:focus {
        ${COLORS.BOX_SHADOW.INPUT_FOCUS};
    }

    &::placeholder {
        color: ${COLORS.TEXT.PLACEHOLDER};
    }
`;

const inputInfoStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
`;

const errorMessageStyle = css`
    display: flex;
    align-items: center;
    color: ${COLORS.TEXT.ERROR};
    font-size: 12px;
`;

const errorTextStyle = css`
    margin-left: 4px;
`;

const inputHintStyle = css`
    color: #6b7280;
    font-size: 12px;
`;

const charCountStyle = (isOverLimit: boolean) => css`
    font-size: 12px;
    color: ${isOverLimit ? COLORS.TEXT.ERROR : '#6b7280'};
`;

const errorReulstMessageStyle = css`
    margin: 0 16px 16px;
    padding: 8px 12px;
    background-color: #fef2f2;
    border-radius: 8px;
    color: ${COLORS.TEXT.ERROR};
    font-size: 14px;
`;

const buttonsContainerStyle = css`
    width: 100%;
    padding-top: 16px;
    border-top: 1px solid ${COLORS.BORDER};
    display: flex;
    gap: 12px;
`;

const cancelButtonStyle = css`
    flex: 1;
    height: 48px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background-color: ${COLORS.BACKGROUND.WHITE};
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const confirmButtonStyle = (isActive: boolean) => css`
    flex: 1;
    height: 48px;
    padding: 10px;
    border-radius: 8px;
    border: none;
    background-color: ${isActive ? COLORS.PRIMARY : COLORS.DISABLED};
    color: ${isActive ? 'white' : COLORS.ICON.LIGHT};
    font-weight: 500;
    cursor: ${isActive ? 'pointer' : 'not-allowed'};
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: ${isActive ? COLORS.PRIMARY_HOVER : COLORS.DISABLED};
    }
`;

const sendIconStyle = css`
    margin-right: 8px;
`;

export default ShareModal;
