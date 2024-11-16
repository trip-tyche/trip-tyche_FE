import { useState } from 'react';

import { css } from '@emotion/react';
import { MdCancel } from 'react-icons/md';

import { userAPI } from '@/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';

type ModeType = 'create' | 'edit';

interface NickNameFormProps {
    mode: ModeType;
    title: string;
    buttonText: string;
    placeholder?: string;
    getUserInfoData?: () => void;
    setIsEditing?: (isEditing: boolean) => void;
}

const NickNameForm = ({ mode, title, buttonText, placeholder, getUserInfoData, setIsEditing }: NickNameFormProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const setUserNickName = useUserDataStore((state) => state.setUserNickName);
    const showToast = useToastStore((state) => state.showToast);

    const handleCancelButtonClick = () => setInputValue('');

    const submitUserNickName = async () => {
        try {
            setUserNickName(inputValue);
            await userAPI.createUserNickName(inputValue);
            mode === 'edit' ? showToast('닉네임이 변경되었습니다.') : getUserInfoData && getUserInfoData();
        } catch (error) {
            showToast(`닉네임 ${mode === 'edit' ? '수정' : '등록'}이 실패했습니다. 다시 시도해주세요.`);
        } finally {
            setIsEditing && setIsEditing(false);
        }
    };

    return (
        <div css={formContainer}>
            <div css={inputContainer}>
                <h1 css={titleStyle}>{title}</h1>
                <Input
                    value={inputValue}
                    onChange={setInputValue}
                    variant='error'
                    setIsInvalid={setIsInvalid}
                    maxLength={15}
                    placeholder={placeholder || '닉네임은 최대 10자까지 등록할 수 있습니다.'}
                    rightSection={
                        <MdCancel size={16} onClick={handleCancelButtonClick} style={{ cursor: 'pointer' }} />
                    }
                />
            </div>
            <div css={buttonWrapper}>
                <Button text={buttonText} onClick={submitUserNickName} disabled={isInvalid} />
            </div>
        </div>
    );
};

const formContainer = css`
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
    margin: 12px 0 20px 4px;
`;

const buttonWrapper = css`
    padding: 0 12px;
    margin-bottom: 12px;
`;

export default NickNameForm;