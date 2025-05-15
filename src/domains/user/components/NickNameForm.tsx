import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { X, Check, User, AlertCircle } from 'lucide-react';

import { NICKNAME_FORM } from '@/domains/user/constants';
import { useNickname } from '@/domains/user/hooks/useNickname';
import useUserStore from '@/domains/user/stores/useUserStore';
import { validateUserNickName } from '@/libs/utils/validate';
import Spinner from '@/shared/components/Spinner';
import { COLORS } from '@/shared/constants/theme';
import { useToastStore } from '@/shared/stores/useToastStore';
import { FormMode } from '@/shared/types';

interface NickNameFormProps {
    mode: FormMode;
    onSubmit?: () => void;
}

const NickNameForm = ({ mode, onSubmit }: NickNameFormProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const nickname = useUserStore((state) => state.userInfo?.nickname);
    const showToast = useToastStore((state) => state.showToast);
    const { isSubmitting, error, submitNickname } = useNickname(inputValue, onSubmitSuccess);

    const queryClient = useQueryClient();

    const isEditing = mode === 'edit';

    useEffect(() => {
        const error = validateUserNickName(inputValue, NICKNAME_FORM.MIN_LENGTH, NICKNAME_FORM.MAX_LENGTH);
        setIsValid(error.valid);
        setErrorMessage(error.message);
    }, [inputValue]);

    function onSubmitSuccess() {
        queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
        onSubmit?.();
        if (isEditing) showToast('닉네임이 변경되었습니다');
    }

    const clearInput = () => {
        setInputValue('');
    };

    if (error) showToast(error);

    return (
        <div css={page}>
            <main css={mainContentStyle}>
                <div css={titleContainerStyle}>
                    <h2 css={mainTitleStyle}>새로운 닉네임을 입력해주세요 😃</h2>
                    <p css={subtitleStyle}>닉네임은 여행 티켓과 공유 시 다른 사람에게 표시됩니다</p>
                </div>

                <div css={inputSectionStyle}>
                    <div css={inputContainerStyle(isValid)}>
                        <div css={inputIconStyle}>
                            <User size={20} color={COLORS.ICON.LIGHT} />
                        </div>
                        <input
                            css={inputStyle}
                            type='text'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={nickname || '트립티케'}
                            maxLength={NICKNAME_FORM.MAX_LENGTH + 1}
                        />
                        {inputValue && (
                            <button css={clearButtonStyle} onClick={clearInput}>
                                <X size={20} color={COLORS.ICON.DEFAULT} />
                            </button>
                        )}
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

                <div css={suggestionsContainerStyle}>
                    <h3 css={suggestionsTitleStyle}>추천 닉네임</h3>
                    <div css={suggestionsGridStyle}>
                        {NICKNAME_FORM.SUGGESTIONS.map((suggestion, index) => (
                            <button key={index} css={suggestionButtonStyle} onClick={() => setInputValue(suggestion)}>
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                <div css={infoBoxStyle}>
                    <div css={infoContentStyle}>
                        <AlertCircle size={20} css={infoIconStyle} />
                        <p css={infoTextStyle}>닉네임 변경 시 이전에 만든 모든 여행 티켓에도 새 닉네임이 적용됩니다.</p>
                    </div>
                </div>
            </main>

            <div css={footerStyle}>
                <button
                    css={submitButtonStyle(isValid && !isSubmitting)}
                    disabled={!isValid || isSubmitting}
                    onClick={submitNickname}
                >
                    {isSubmitting ? (
                        <div css={submitButtonContentStyle}>
                            <Spinner diameter={22} isLightBackGround={false} />
                            <span>처리 중...</span>
                        </div>
                    ) : (
                        <div css={submitButtonContentStyle}>
                            {isValid && inputValue && <Check />}
                            <span>{`닉네임 ${isEditing ? '변경' : '등록'}하기`}</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

// 스타일 정의
const page = css`
    height: calc(100dvh - 48px);
    display: flex;
    flex-direction: column;
    background-color: ${COLORS.BACKGROUND.WHITE};
`;

const mainContentStyle = css`
    flex: 1;
    padding: 20px 16px;
    overflow-y: auto;
`;

const titleContainerStyle = css`
    margin-bottom: 24px;
`;

const mainTitleStyle = css`
    font-size: 18px;
    font-weight: 500;
    color: ${COLORS.TEXT.BLACK};
    margin-bottom: 8px;
`;

const subtitleStyle = css`
    font-size: 14px;
    color: #6b7280;
`;

const inputSectionStyle = css`
    margin-bottom: 36px;
`;

const inputContainerStyle = (isValid: boolean) => css`
    position: relative;
    border: 1px solid ${isValid ? COLORS.BORDER : COLORS.TEXT.ERROR};
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
`;

const inputIconStyle = css`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${COLORS.ICON};
`;

const inputStyle = css`
    width: 100%;
    padding: 12px 40px;
    outline: none;
    border: none;
`;

const clearButtonStyle = css`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
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

const suggestionsContainerStyle = css`
    margin-bottom: 32px;
`;

const suggestionsTitleStyle = css`
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 12px;
`;

const suggestionsGridStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const suggestionButtonStyle = css`
    padding: 8px 12px;
    background-color: #f3f4f6;
    border-radius: 9999px;
    border: none;
    font-size: 14px;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${COLORS.DISABLED};
    }
`;

const infoBoxStyle = css`
    background-color: ${COLORS.BACKGROUND.PRIMARY};
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 32px;
`;

const infoContentStyle = css`
    display: flex;
`;

const infoIconStyle = css`
    margin-right: 12px;
    margin-top: 2px;
    flex-shrink: 0;
    color: ${COLORS.PRIMARY};
`;

const infoTextStyle = css`
    font-size: 14px;
    color: ${COLORS.TEXT.BLACK};
    line-height: 1.3;
`;

const footerStyle = css`
    padding: 16px;
    border-top: 1px solid ${COLORS.BORDER};
`;

const submitButtonStyle = (isActive: boolean) => css`
    width: 100%;
    height: 48px;
    padding: 12px;
    border-radius: 8px;
    font-weight: 500;
    border: none;
    cursor: ${isActive ? 'pointer' : 'not-allowed'};
    background-color: ${isActive ? COLORS.PRIMARY : COLORS.DISABLED};
    color: ${isActive ? COLORS.TEXT.WHITE : COLORS.ICON};
    transition: all 0.2s ease;
`;

const submitButtonContentStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
`;

export default NickNameForm;
