// import { useEffect, useState } from 'react';

// import { css } from '@emotion/react';
// import { useNavigate } from 'react-router-dom';

// import { getUserData } from '@/api/user';
// import characterImg from '@/assets/images/ogami_3.png';
// import Button from '@/components/common/button/Button';
// import ConfirmModal from '@/components/common/modal/ConfirmModal';
// import { LOGOUT_MODAL } from '@/constants/message';
// import { PATH } from '@/constants/path';
// import { BUTTON } from '@/constants/title';
// import useAuthStore from '@/stores/useAuthStore';
// import { useModalStore } from '@/stores/useModalStore';
// import theme from '@/styles/theme';
// import { getUserId } from '@/utils/auth';

// const MyPage = (): JSX.Element => {
//     const [userNickName, setUserNickname] = useState('');

//     const { isModalOpen, openModal, closeModal } = useModalStore();
//     const setLogout = useAuthStore((state) => state.setLogout);

//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserNickName = async () => {
//             const userId = getUserId();
//             if (!userId) {
//                 navigate(PATH.LOGIN);
//                 return;
//             }

//             const { userNickName } = await getUserData(userId);
//             setUserNickname(userNickName);
//         };

//         fetchUserNickName();
//     }, []);

//     const confirmModal = () => {
//         closeModal();
//         setLogout();
//         navigate(PATH.LOGIN);
//     };

//     return (
//         <div css={containerStyle}>
//             <div css={imgWrapperStyle}>
//                 <img src={characterImg} className='characterImg' alt='character' />
//             </div>

//             <p css={textWrapper}>안녕하세요, {userNickName} 님</p>

//             <div css={buttonWrapper}>
//                 <Button text={BUTTON.LOGOUT} btnTheme='pri' size='sm' onClick={openModal} />
//             </div>

//             {isModalOpen && (
//                 <ConfirmModal
//                     title={LOGOUT_MODAL.TITLE}
//                     description={LOGOUT_MODAL.MESSAGE}
//                     confirmText={LOGOUT_MODAL.CONFIRM_TEXT}
//                     cancelText={LOGOUT_MODAL.CANCEL_TEXT}
//                     confirmModal={confirmModal}
//                     closeModal={closeModal}
//                 />
//             )}
//         </div>
//     );
// };

// const containerStyle = css`
//     display: flex;
//     flex-direction: column;
//     min-height: 100vh;
// `;

// const imgWrapperStyle = css`
//     flex: 1;

//     display: flex;
//     justify-content: center;
//     align-items: center;

//     .characterImg {
//         width: 120px;
//     }
// `;

// const textWrapper = css`
//     font-size: ${theme.fontSizes.xxlarge_20};
//     font-weight: 600;
//     text-align: center;
// `;

// const buttonWrapper = css`
//     flex: 1;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;

// export default MyPage;
