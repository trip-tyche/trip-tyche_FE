// import axios from 'axios';

// import { ENV } from '@/constants/auth';
// import { TripInfo } from '@/types/trip';
// import { getToken } from '@/utils/auth';

// const apiBaseUrl = ENV.API_BASE_URL;

// export const fetchTripTicketInfo = async (tripId: string) => {
//     try {
//         const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}`, {
//             headers: {
//                 accept: '*/*',
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log('여행정보 데이터', response.data);
//         return response.data.data;
//     } catch (error) {
//         console.error('여행정보 데이터패칭에 실패하였습니다.', error);
//     }
// };

// export const fetchTripTicketList = async () => {
//     try {
//         const token = getToken();
//         const response = await axios.get(`${apiBaseUrl}/api/trips`, {
//             headers: {
//                 accept: '*/*',
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log('여행티켓리스트 데이터', response.data.data);
//         return response.data.data;
//     } catch (error) {
//         console.error('여행티켓리스트 데이터패칭에 실패하였습니다.', error);
//     }
// };

// export const fetchTripTimeline = async (tripId: string) => {
//     try {
//         const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/info`, {
//             headers: {
//                 accept: '*/*',
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log('타임라인 데이터', response.data.data);
//         return response.data.data;
//     } catch (error) {
//         console.error('타임라인 데이터패칭에 실패하였습니다.', error);
//     }
// };

// export const createTrip = async () => {
//     try {
//         const token = getToken();
//         const response = await axios.post(
//             `${apiBaseUrl}/api/trips`,
//             {},
//             {
//                 headers: {
//                     accept: '*/*',
//                     Authorization: `Bearer ${token}`,
//                 },
//             },
//         );
//         console.log('tripId가 등록되었습니다', response.data.data.tripId);
//         return response.data.data.tripId;
//     } catch (error) {
//         console.error('tripId 등록에 실패하였습니다', error);
//     }
// };

// export const createTripInfo = async ({ tripId, tripTitle, country, startDate, endDate, hashtags }: TripInfo) => {
//     try {
//         const token = getToken();
//         const response = await axios.post(
//             `${apiBaseUrl}/api/trips/${tripId}/info`,
//             {
//                 tripTitle,
//                 country,
//                 startDate,
//                 endDate,
//                 hashtags,
//             },
//             {
//                 headers: {
//                     accept: '*/*',
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             },
//         );
//         console.log('여행정보가 등록되었습니다', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('여행정보 등록에 실패하였습니다', error);
//     }
// };

// export const createTripImages = async (tripId: string, images: File[]) => {
//     const formData = new FormData();
//     images.forEach((image) => {
//         formData.append('files', image);
//     });

//     try {
//         const response = await axios.post(`${apiBaseUrl}/api/trips/${tripId}/upload`, formData, {
//             headers: {
//                 accept: '*/*',
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         console.log('여행사진이 등록되었습니다', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('여행사진 등록에 실패하였습니다', error);
//     }
// };

// export const updateTripInfo = async (
//     tripId: string,
//     { tripTitle, country, startDate, endDate, hashtags }: TripInfo,
// ) => {
//     try {
//         const token = getToken();
//         const response = await axios.put(
//             `${apiBaseUrl}/api/trips/${tripId}`,
//             {
//                 tripTitle,
//                 country,
//                 startDate,
//                 endDate,
//                 hashtags,
//             },
//             {
//                 headers: {
//                     accept: '*/*',
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             },
//         );
//         console.log('여행정보가 수정되었습니다', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('여행정보 수정에 실패하였습니다', error);
//     }
// };

// export const deleteTripTicket = async (tripId: string) => {
//     try {
//         const token = getToken();
//         const response = await axios.delete(`${apiBaseUrl}/api/trips/${tripId}`, {
//             headers: {
//                 accept: '*/*',
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log('여행티켓이 삭제되었습니다.', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('여행티켓 삭제에 실패하였습니다.', error);
//     }
// };
