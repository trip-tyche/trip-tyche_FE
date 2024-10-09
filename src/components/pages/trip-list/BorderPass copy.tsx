// import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';

// import { css, keyframes } from '@emotion/react';
// import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
// import { FiPlus } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

// import { deleteTripInfo } from '@/api/trip';
// import characterImg from '@/assets/images/ogami_1.png';
// import ColumnButtonModal from '@/components/common/modal/ColumnButtonModal';
// import ModalOverlay from '@/components/common/modal/ModalOverlay';
// import { PATH } from '@/constants/path';
// import { FormattedTripDate } from '@/types/trip';

// interface BorderPassProps {
//     trip: FormattedTripDate;
//     userNickname: string;
//     setTripCount: Dispatch<SetStateAction<number>>;
//     setIsDelete: Dispatch<SetStateAction<boolean>>;
// }

// const BorderPass = ({ trip, userNickname, setTripCount, setIsDelete }: BorderPassProps): JSX.Element => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const navigate = useNavigate();

//     const { tripId, tripTitle, country, startDate, endDate, hashtags } = trip;

//     const handleEdit = () => {
//         navigate(`/trips/${tripId}/edit`);
//     };

//     const handleDelete = async () => {
//         try {
//             await deleteTripInfo(tripId);
//             setIsModalOpen(false);
//             setIsDelete(true);
//             setTripCount((prev: number) => prev - 1);
//         } catch (error) {
//             console.error('Error delete trip:', error);
//             setIsModalOpen(false);
//         } finally {
//             setIsModalOpen(false);
//         }
//     };

//     const goToUpload = () => {
//         navigate(PATH.TRIP_UPLOAD, { state: tripId });
//     };
//     return (
//         <div css={borderPassContainer}>
//             <div
//                 css={borderPassContent}
//                 onClick={() =>
//                     navigate(`${PATH.TIMELINE_MAP}/${tripId}`, {
//                         state: { tripId: trip.tripId, tripTitle: trip.tripTitle },
//                     })
//                 }
//             >
//                 <div css={borderPassLeft}>
//                     <div css={countryName}>{country}</div>
//                     <img src={characterImg} alt='character' css={characterImage} />
//                     <div css={borderPassText}>BORDER PASS</div>
//                 </div>

//                 <div css={borderPassRight}>
//                     <h3 css={tripTitleStyle}>{tripTitle}</h3>
//                     <div css={tripInfo}>
//                         <p>
//                             <strong>PASSENGER:</strong> {userNickname}
//                         </p>
//                         <p>
//                             <strong>FROM:</strong> 인천
//                         </p>
//                         <p>
//                             <strong>TO:</strong> {country.substring(4)}
//                         </p>
//                         <p>
//                             <strong>DATE:</strong> {startDate} ~ {endDate}
//                         </p>
//                     </div>
//                     <div css={hashtagContainer}>
//                         {hashtags.map((tag, index) => (
//                             <span key={index} css={hashtag}>
//                                 #{tag}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div css={buttonContainer}>
//                 <button css={editButton} onClick={handleEdit}>
//                     <FaPencilAlt /> Edit
//                 </button>
//                 <button css={deleteButton} onClick={() => setIsModalOpen(true)}>
//                     <FaTrashAlt /> Delete
//                 </button>
//                 <button css={uploadButton} onClick={goToUpload}>
//                     <FiPlus /> Upload
//                 </button>
//             </div>

//             {isModalOpen && (
//                 <>
//                     <ModalOverlay closeModal={() => setIsModalOpen(false)} />
//                     <ColumnButtonModal
//                         title='정말 삭제하시겠습니까?'
//                         message='삭제 후, 여행 정보는 다시 복구할 수 없습니다.'
//                         confirmText='삭제하기'
//                         cancelText='취소'
//                         confirmModal={handleDelete}
//                         closeModal={() => setIsModalOpen(false)}
//                     />
//                 </>
//             )}
//         </div>
//     );
// };

// const borderPassContainer = css`
//     width: 100%;
//     max-width: 430px;
//     background: #e8d9b5;
//     border-radius: 15px;
//     overflow: hidden;
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//     transition: all 0.3s ease;
//     margin: 10px auto;
//     position: relative;

//     &:hover {
//         /* transform: translateY(-2px); */
//         cursor: pointer;
//     }
// `;

// const borderPassContent = css`
//     display: flex;
//     flex-direction: column;
// `;

// const borderPassLeft = css`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 15px;
//     background-color: #453525;
//     position: relative;
//     overflow: hidden;

//     &:before {
//         content: 'LV';
//         position: absolute;
//         font-size: 80px;
//         color: rgba(255, 255, 255, 0.05);
//         bottom: -20px;
//         right: -10px;
//         font-weight: bold;
//         font-family: 'Futura', sans-serif;
//     }
// `;

// const borderPassRight = css`
//     padding: 15px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     position: relative;
// `;

// const countryName = css`
//     font-size: 20px;
//     font-weight: bold;
//     color: #c4a671;
//     text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
//     font-family: 'Futura', sans-serif;
//     letter-spacing: 1px;
// `;

// const characterImage = css`
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//     object-fit: cover;
//     border: 2px solid #c4a671;
//     box-shadow: 0 0 10px rgba(196, 166, 113, 0.5);
// `;

// const borderPassText = css`
//     font-size: 12px;
//     font-weight: bold;
//     color: #c4a671;
//     text-transform: uppercase;
//     letter-spacing: 2px;
//     font-family: 'Futura', sans-serif;
// `;

// const tripTitleStyle = css`
//     font-size: 18px;
//     color: #453525;
//     margin-bottom: 10px;
//     font-family: 'Futura', sans-serif;
//     letter-spacing: 1px;
// `;

// const tripInfo = css`
//     font-size: 14px;
//     color: #453525;

//     p {
//         margin: 5px 0;
//     }

//     strong {
//         font-weight: bold;
//         color: #996515;
//     }
// `;

// const hashtagContainer = css`
//     display: flex;
//     flex-wrap: wrap;
//     margin-top: 10px;
// `;

// const hashtag = css`
//     background-color: #453525;
//     color: #c4a671;
//     padding: 4px 8px;
//     border-radius: 12px;
//     font-size: 11px;
//     margin-right: 5px;
//     margin-bottom: 5px;
//     font-family: 'Futura', sans-serif;
//     letter-spacing: 0.5px;
// `;

// const buttonContainer = css`
//     display: flex;
//     justify-content: flex-end;
//     padding: 10px 15px;
//     background-color: rgba(69, 53, 37, 0.1);
// `;

// const buttonBase = css`
//     padding: 6px 10px;
//     border: none;
//     border-radius: 15px;
//     font-size: 12px;
//     font-weight: bold;
//     cursor: pointer;
//     transition: all 0.3s ease;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     font-family: 'Futura', sans-serif;

//     &:hover {
//         transform: translateY(-2px);
//         cursor: pointer;
//     }
// `;

// const editButton = css`
//     ${buttonBase}
//     background-color: #c4a671;
//     color: #453525;
//     margin-right: 10px;

//     &:hover {
//         background-color: #b3955f;
//     }
// `;

// const deleteButton = css`
//     ${buttonBase}
//     background-color: #453525;
//     color: #c4a671;
//     margin-right: 10px;

//     &:hover {
//         background-color: #5a3432;
//     }
// `;

// const uploadButton = css`
//     ${buttonBase}
//     background-color: #dc453d;
//     color: #c4a671;
//     margin-right: 10px;

//     &:hover {
//         background-color: #962f2a;
//     }
// `;

// export default BorderPass;

// // import React, { useState, Dispatch, SetStateAction } from 'react';

// // import { css } from '@emotion/react';
// // import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
// // import { FiPlus } from 'react-icons/fi';
// // import { useNavigate } from 'react-router-dom';

// // import { deleteTripInfo } from '@/api/trip';
// // import ColumnButtonModal from '@/components/common/modal/ColumnButtonModal';
// // import ConfirmModal from '@/components/common/modal/ConfirmModal';
// // import ModalOverlay from '@/components/common/modal/ModalOverlay';
// // import { PATH } from '@/constants/path';
// // import { FormattedTripDate } from '@/types/trip';

// // interface BorderPassProps {
// //     trip: FormattedTripDate;
// //     userNickname: string;
// //     setTripCount: Dispatch<SetStateAction<number>>;
// //     setIsDelete: Dispatch<SetStateAction<boolean>>;
// // }

// // const BorderPass = ({ trip, userNickname, setTripCount, setIsDelete }: BorderPassProps) => {
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const navigate = useNavigate();
// //     const { tripId, tripTitle, country, startDate, endDate, hashtags } = trip;

// //     const handleEdit = () => {
// //         navigate(`/trips/${tripId}/edit`);
// //     };

// //     const handleDelete = async () => {
// //         try {
// //             await deleteTripInfo(tripId);
// //             setIsModalOpen(false);
// //             setIsDelete(true);
// //             setTripCount((prev) => prev - 1);
// //         } catch (error) {
// //             console.error('Error delete trip:', error);
// //         } finally {
// //             setIsModalOpen(false);
// //         }
// //     };

// //     const goToUpload = () => {
// //         navigate(PATH.TRIP_UPLOAD, { state: tripId });
// //     };
// //     // 날짜 이전
// //     return (
// //         <div
// //             css={boardingPassContainer}
// //             onClick={() => {
// //                 navigate(`${PATH.TIMELINE_MAP}/${tripId}`);
// //                 localStorage.setItem('tripId', tripId);
// //                 localStorage.setItem('tripTitle', tripTitle);
// //             }}
// //         >
// //             <div css={headerStyle}>
// //                 <div>
// //                     <div css={passengerName}>{userNickname}</div>
// //                     <div css={dateStyle}>{startDate}</div>
// //                 </div>
// //                 <div>
// //                     <div css={seatStyle}>SEAT</div>
// //                     <div css={seatNumber}>9A</div>
// //                 </div>
// //                 <div css={flightStyle}>TRAVEL PASS</div>
// //             </div>
// //             <div css={mainContentStyle}>
// //                 <div css={locationContainer}>
// //                     <div css={fromStyle}>인천</div>
// //                     <div css={planeIcon}>✈</div>
// //                     <div css={toStyle}>{country.substring(4)}</div>
// //                 </div>
// //                 <div css={boardingInfoStyle}>
// //                     <div>
// //                         <div css={labelStyle}>BOARDING TIME</div>
// //                         <div css={valueStyle}>{startDate}</div>
// //                     </div>
// //                     <div>
// //                         <div css={labelStyle}>SEAT</div>
// //                         <div css={valueStyle}>9A</div>
// //                     </div>
// //                 </div>
// //                 <div css={tripInfoStyle}>
// //                     <div>
// //                         <div css={labelStyle}>GATE</div>
// //                         <div css={valueStyle}>13A</div>
// //                     </div>
// //                     <div>
// //                         <div css={labelStyle}>FLIGHT</div>
// //                         <div css={valueStyle}>TRAVEL PASS</div>
// //                     </div>
// //                     <div>
// //                         <div css={labelStyle}>DATE</div>
// //                         <div css={valueStyle}>{startDate}</div>
// //                     </div>
// //                 </div>
// //                 <div css={barcodeStyle}>*2312831239WQEQWE213312312312312312*</div>
// //             </div>
// //             <div css={buttonContainer}>
// //                 <button css={editButton} onClick={handleEdit}>
// //                     <FaPencilAlt /> Edit
// //                 </button>
// //                 <button css={deleteButton} onClick={() => setIsModalOpen(true)}>
// //                     <FaTrashAlt /> Delete
// //                 </button>
// //                 <button css={uploadButton} onClick={goToUpload}>
// //                     <FiPlus /> Upload
// //                 </button>
// //             </div>
// //             {isModalOpen && (
// //                 <ConfirmModal
// //                     title='보더패스를 삭제하시겠습니까?'
// //                     description='보더패스를 삭제하면 해당 여행의 정보와 사진들은 다시 복구할 수 없어요. 그래도 삭제하시겠습니까?'
// //                     confirmText='삭제'
// //                     cancelText='취소'
// //                     confirmModal={handleDelete}
// //                     closeModal={() => setIsModalOpen(false)}
// //                 />
// //             )}
// //         </div>
// //     );
// // };

// // const boardingPassContainer = css`
// //     width: 100%;
// //     max-width: 430px;
// //     background: #4285f4;
// //     border-radius: 15px;
// //     overflow: hidden;
// //     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
// //     margin: 10px auto;
// //     font-family: 'Arial', sans-serif;
// //     color: white;
// // `;

// // const headerStyle = css`
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     padding: 15px;
// //     background-color: #4285f4;
// // `;

// // const passengerName = css`
// //     font-size: 18px;
// //     font-weight: bold;
// // `;

// // const dateStyle = css`
// //     font-size: 14px;
// // `;

// // const seatStyle = css`
// //     font-size: 12px;
// // `;

// // const seatNumber = css`
// //     font-size: 18px;
// //     font-weight: bold;
// // `;

// // const flightStyle = css`
// //     font-size: 16px;
// //     font-weight: bold;
// // `;

// // const mainContentStyle = css`
// //     background-color: white;
// //     color: #333;
// //     padding: 20px;
// // `;

// // const locationContainer = css`
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     margin-bottom: 20px;
// // `;

// // const fromStyle = css`
// //     font-size: 24px;
// //     font-weight: bold;
// // `;

// // const planeIcon = css`
// //     font-size: 24px;
// //     color: #4285f4;
// // `;

// // const toStyle = css`
// //     font-size: 24px;
// //     font-weight: bold;
// // `;

// // const boardingInfoStyle = css`
// //     display: flex;
// //     justify-content: space-between;
// //     margin-bottom: 20px;
// // `;

// // const tripInfoStyle = css`
// //     display: flex;
// //     justify-content: space-between;
// //     margin-bottom: 20px;
// // `;

// // const labelStyle = css`
// //     font-size: 12px;
// //     color: #666;
// // `;

// // const valueStyle = css`
// //     font-size: 16px;
// //     font-weight: bold;
// // `;

// // const barcodeStyle = css`
// //     text-align: center;
// //     font-family: 'Libre Barcode 39', cursive;
// //     font-size: 24px;
// // `;

// // const buttonContainer = css`
// //     display: flex;
// //     justify-content: space-between;
// //     padding: 15px;
// //     background-color: #4285f4;
// // `;

// // const buttonBase = css`
// //     padding: 8px 16px;
// //     border: none;
// //     border-radius: 5px;
// //     font-size: 14px;
// //     font-weight: bold;
// //     cursor: pointer;
// //     transition: all 0.3s ease;
// //     display: flex;
// //     align-items: center;
// //     gap: 5px;
// // `;

// // const editButton = css`
// //     ${buttonBase}
// //     background-color: #34a853;
// //     color: white;
// //     &:hover {
// //         background-color: #2d9249;
// //     }
// // `;

// // const deleteButton = css`
// //     ${buttonBase}
// //     background-color: #ea4335;
// //     color: white;
// //     &:hover {
// //         background-color: #d33828;
// //     }
// // `;

// // const uploadButton = css`
// //     ${buttonBase}
// //     background-color: #fbbc05;
// //     color: #333;
// //     &:hover {
// //         background-color: #f2b600;
// //     }
// // `;

// // export default BorderPass;

// import theme from '@/styles/theme';

// interface BorderPassProps {
//     trip: FormattedTripDate;
//     userNickname: string;
//     setTripCount: React.Dispatch<React.SetStateAction<number>>;
//     setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const BorderPass = ({ trip, userNickname, setTripCount, setIsDelete }: BorderPassProps): JSX.Element => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isAnimating, setIsAnimating] = useState(false);
//     const navigate = useNavigate();
//     const { tripId, tripTitle, country, startDate, endDate, hashtags } = trip;

//     const handleEdit = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         navigate(`/trips/${tripId}/edit`);
//     };

//     const handleDelete = async () => {
//         try {
//             await deleteTripInfo(tripId);
//             setIsModalOpen(false);
//             setIsDelete(true);
//             setTripCount((prev: number) => prev - 1);
//         } catch (error) {
//             console.error('Error delete trip:', error);
//         } finally {
//             setIsModalOpen(false);
//         }
//     };

//     const goToUpload = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         navigate(PATH.TRIP_UPLOAD, { state: tripId });
//     };

//     const handleCardClick = () => {
//         setIsAnimating(true);
//     };

//     useEffect(() => {
//         if (isAnimating) {
//             const timer = setTimeout(() => {
//                 navigate(`${PATH.TIMELINE_MAP}/${tripId}`, {
//                     state: { tripId: trip.tripId, tripTitle: trip.tripTitle },
//                 });
//             }, 2000); // 2초 후 네비게이션

//             return () => clearTimeout(timer);
//         }
//     }, [isAnimating, navigate, tripId, trip.tripId, trip.tripTitle]);

//     return (
//         <div css={borderPassContainer} onClick={handleCardClick}>
//             <div css={topSection}>
//                 <div css={leftTopSection}>
//                     <div>
//                         <div css={label}>PASSENGER</div>
//                         <div css={value}>{userNickname}</div>
//                     </div>
//                     <div>
//                         <div css={label}>DATE</div>
//                         <div css={value}>{startDate}</div>
//                     </div>
//                     <div>
//                         <div css={label}>DATE</div>
//                         <div css={value}>{endDate}</div>
//                     </div>
//                 </div>
//                 <div css={[rightTopSection, isAnimating && animateRight]}>
//                     <div css={label}>FLIGHT</div>
//                     <div css={value}>FIVEFEELING AIR</div>
//                 </div>
//             </div>

//             <div css={mainContent}>
//                 <div css={leftContent}>
//                     <div css={contentContainer}>
//                         <div css={citiesStyle}>
//                             <div>인천</div>
//                             <div>✈</div>
//                             <div>{country.substring(4)}</div>
//                         </div>
//                         <div css={titleStyle}>{tripTitle}</div>
//                         <div css={hashtagContainer}>
//                             {hashtags.map((tag, index) => (
//                                 <span key={index} css={hashtag}>
//                                     #{tag}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                     <div css={buttonContainer}>
//                         <button css={buttonStyle} onClick={handleEdit}>
//                             <FaPencilAlt /> Edit
//                         </button>
//                         <button
//                             css={buttonStyle}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 setIsModalOpen(true);
//                             }}
//                         >
//                             <FaTrashAlt /> Delete
//                         </button>
//                         <button css={buttonStyle} onClick={goToUpload}>
//                             <FiPlus /> Upload
//                         </button>
//                     </div>
//                 </div>
//                 <div css={[rightContent, isAnimating && animateRight]}>
//                     <img src={characterImg} alt='Character' css={characterImageStyle} />
//                     <div css={textStyle}>Click Here!</div>
//                 </div>
//             </div>

//             {isModalOpen && (
//                 <>
//                     <ModalOverlay closeModal={() => setIsModalOpen(false)} />
//                     <ColumnButtonModal
//                         title='정말 삭제하시겠습니까?'
//                         message='삭제 후, 여행 정보는 다시 복구할 수 없습니다.'
//                         confirmText='삭제하기'
//                         cancelText='취소'
//                         confirmModal={handleDelete}
//                         closeModal={() => setIsModalOpen(false)}
//                     />
//                 </>
//             )}
//         </div>
//     );
// };

// const slideRight = keyframes`
//   from {
//     transform: translateX(0);
//   }
//   to {
//     transform: translateX(100%);
//   }
// `;

// const borderPassContainer = css`
//     width: 100%;
//     max-width: 428px;
//     background: #fff;
//     border-radius: 10px;
//     overflow: hidden;
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//     transition: all 0.3s ease;
//     margin-bottom: 24px;
//     cursor: pointer;
// `;

// const topSection = css`
//     display: flex;
//     align-items: center;
//     background-color: #4285f4;
//     color: white;
// `;

// const leftTopSection = css`
//     display: flex;
//     gap: 20px;
//     width: 70%;
//     padding: 10px 15px;
// `;

// const rightTopSection = css`
//     width: 30%;
//     padding: 10px 15px 10px 0;
//     transition: transform 2s ease;
// `;

// const animateRight = css`
//     animation: ${slideRight} 2s forwards;
// `;

// const label = css`
//     font-size: 12px;
//     color: rgba(255, 255, 255, 0.7);
//     margin-bottom: 2px;
// `;

// const value = css`
//     font-size: 12px;
//     font-weight: bold;
// `;

// const mainContent = css`
//     display: flex;
// `;

// const leftContent = css`
//     width: 70%;
//     border-right: 1px solid #e0e0e0;
// `;

// const rightContent = css`
//     width: 30%;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     transition: transform 2s ease;
// `;

// const contentContainer = css`
//     padding: 15px 15px 10px 15px;
// `;

// // const rightContent = css`
// //     width: 30%;
// //     display: flex;
// //     flex-direction: column;
// //     align-items: center;
// //     justify-content: center;
// // `;

// const citiesStyle = css`
//     display: flex;
//     justify-content: space-between;
//     font-size: 20px;
//     font-weight: bold;
//     margin-bottom: 20px;
// `;

// const titleStyle = css`
//     margin-bottom: 24px;
//     font-weight: bold;
// `;

// const hashtagContainer = css`
//     display: flex;
//     flex-wrap: wrap;
//     gap: 5px;
// `;

// const hashtag = css`
//     background-color: #f0f0f0;
//     color: #333;
//     padding: 5px 10px;
//     border-radius: 15px;
//     font-size: 12px;
// `;

// const characterImageStyle = css`
//     width: 80px;
//     margin-bottom: 18px;
// `;

// const textStyle = css`
//     font-size: 14px;
//     font-weight: 600;
//     color: ${theme.colors.descriptionText};
// `;

// const buttonContainer = css`
//     display: flex;
//     justify-content: space-between;
//     padding: 10px 15px;
//     /* background-color: #f5f5f5; */
//     border-top: 1px solid #e0e0e0;
// `;

// const buttonStyle = css`
//     padding: 6px 8px;
//     border: none;
//     border-radius: 4px;
//     font-size: 12px;
//     font-weight: bold;
//     cursor: pointer;
//     transition: all 0.3s ease;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     margin: 0 5px;
//     background-color: #4285f4;
//     color: white;
// `;

// export default BorderPass;
