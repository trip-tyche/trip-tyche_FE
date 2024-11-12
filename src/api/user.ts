// import axios from 'axios';

// import { ENV } from '@/constants/auth';
// import { getToken } from '@/utils/auth';

// const apiBaseUrl = ENV.API_BASE_URL;

// export const createUserNickName = async (userNickName: string) => {
//     try {
//         const token = getToken();
//         const response = await axios.post(`${apiBaseUrl}/api/user/updateUserNickName`, userNickName, {
//             headers: {
//                 accept: '*/*',
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'text/plain',
//             },
//         });
//         console.log('사용자 닉네임이 등록되었습니다', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('사용자 닉네임 등록에 실패하였습니다', error);
//         return error;
//     }
// };
