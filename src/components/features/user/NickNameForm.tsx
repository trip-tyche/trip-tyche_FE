import { useState } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { MdCancel } from 'react-icons/md';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { MESSAGE } from '@/constants/ui';
import { useNickname } from '@/domain/user/hooks/useNickname';
import { useToastStore } from '@/stores/useToastStore';
import useUserStore from '@/stores/useUserStore';
import theme from '@/styles/theme';
import { FormMode } from '@/types/common';

interface NickNameFormProps {
    mode: FormMode;
    setIsEditing?: (isEditing: boolean) => void;
}

const NickNameForm = ({ mode, setIsEditing }: NickNameFormProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const nickname = useUserStore((state) => state.userInfo?.nickname);
    const showToast = useToastStore((state) => state.showToast);
    const { isSubmitting, error, submitNickname } = useNickname(inputValue, onSubmitSuccess);

    const queryClient = useQueryClient();

    const isEditing = mode === 'edit';

    function onSubmitSuccess() {
        queryClient.invalidateQueries({ queryKey: ['ticket-list'] });

        if (isEditing) {
            showToast('닉네임이 변경되었습니다');
            setIsEditing?.(false);
        }
    }

    if (error) showToast(error);

    return (
        <div css={formContainer}>
            <div css={inputContainer}>
                <h1 css={titleStyle}>
                    {isEditing ? MESSAGE.NICKNAME_FORM.TITLE : `반가워요! ${MESSAGE.NICKNAME_FORM.TITLE}`}
                </h1>
                <Input
                    value={inputValue}
                    onChange={setInputValue}
                    variant='error'
                    setIsInvalid={setIsInvalid}
                    maxLength={15}
                    placeholder={nickname || MESSAGE.NICKNAME_FORM.PLACEHOLDER}
                    readOnly={isSubmitting}
                    rightSection={
                        <MdCancel size={16} onClick={() => setInputValue('')} style={{ cursor: 'pointer' }} />
                    }
                />
            </div>
            <div css={buttonWrapper}>
                <Button
                    text={`닉네임 ${isEditing ? '변경' : '등록'}하기`}
                    onClick={submitNickname}
                    disabled={isInvalid || isSubmitting}
                />
            </div>
        </div>
    );
};

const formContainer = css`
    height: 100dvh;
    padding: 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const inputContainer = css`
    display: flex;
    flex-direction: column;
    padding: 0 8px;
`;

const titleStyle = css`
    font-weight: 600;
    color: ${theme.COLORS.TEXT.BLACK};
    margin: 12px 0 20px 4px;
`;

const buttonWrapper = css`
    padding: 0 12px;
    margin-bottom: 12px;
`;

export default NickNameForm;
