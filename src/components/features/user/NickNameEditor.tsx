import { useState } from 'react';

import { css } from '@emotion/react';
import { MdCancel } from 'react-icons/md';

import { userAPI } from '@/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';

interface NickNameEditorProps {
    setIsEditing: (isEditing: boolean) => void;
}

const NickNameEditor = ({ setIsEditing }: NickNameEditorProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const setUserNickName = useAuthStore((state) => state.setUserNickName);
    const showToast = useToastStore((state) => state.showToast);

    const handleCancelButtonClick = () => setInputValue('');

    const submitUserNickName = async () => {
        try {
            setUserNickName(inputValue);
            await userAPI.createUserNickName(inputValue);
            showToast('닉네임이 변경되었습니다.');
        } catch (error) {
            showToast('닉네임 수정이 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <div css={editorContainer}>
            <div css={inputContainer}>
                <h1 css={titleStyle}>새로운 닉네임을 입력해주세요.</h1>
                <Input
                    value={inputValue}
                    onChange={setInputValue}
                    variant='error'
                    setIsInvalid={setIsInvalid}
                    maxLength={15}
                    rightSection={
                        <MdCancel size={16} onClick={handleCancelButtonClick} style={{ cursor: 'pointer' }} />
                    }
                />
            </div>
            <div css={buttonWrapper}>
                <Button text='변경 완료' onClick={submitUserNickName} disabled={isInvalid} />
            </div>
        </div>
    );
};

const editorContainer = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;
`;

const inputContainer = css`
    display: flex;
    flex-direction: column;
    padding: 0 8px;
`;
const titleStyle = css`
    font-size: ${theme.fontSizes.large_16};
    font-weight: 600;
    color: ${theme.colors.black};
    margin: 12px 0 16px 0;
`;

const buttonWrapper = css`
    padding: 0 12px;
    margin-bottom: 12px;
`;

export default NickNameEditor;
