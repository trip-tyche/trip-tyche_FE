// import { useEffect, useState, useRef } from 'react';

// import { css } from '@emotion/react';
// import { ArrowDown, ChevronLeft } from 'lucide-react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';

// import { useMediaByDate } from '@/domains/media/hooks/queries';
// // import DateMap from '@/domains/trip/components/DateMap';
// import { useImagesLocationObserver } from '@/domains/media/hooks/useImagesLocationObserver';
// import DateMap from '@/domains/trip/components/DateMap';
// import DateSelector from '@/domains/trip/components/DateSelector';
// import ImageItem from '@/domains/trip/components/ImageItem';
// import Spinner from '@/shared/components/common/Spinner';
// import { ROUTES } from '@/shared/constants/paths';
// import { useGoogleMaps } from '@/shared/hooks/useGoogleMaps';
// import { useScrollHint } from '@/shared/hooks/useScrollHint';
// import { useToastStore } from '@/shared/stores/useToastStore';
// import theme from '@/shared/styles/theme';
// // import { LatLng } from '@/types/maps';

// const ImageByDatePage = () => {
//     const [currentDate, setCurrentDate] = useState('');
//     const [datesWithImages, setDatesWithImages] = useState<string[]>([]);

//     // const [imageLocation, setImageLocation] = useState<LatLng>();

//     const { isLoaded, loadError } = useGoogleMaps();
//     const showToast = useToastStore((state) => state.showToast);

//     const { tripKey } = useParams();
//     const {
//         state: { startDate, imagesByDates: imageDates, pinPointId },
//     } = useLocation();

//     const navigate = useNavigate();

//     const imageListRef = useRef<HTMLDivElement>(null);
//     const { data: result, isLoading } = useMediaByDate(tripKey!, currentDate);

//     // const { isHintOverlayVisible, isFirstLoad } = useScrollHint(imageListRef, isLoaded);
//     const { isHintOverlayVisible, isFirstLoad } = useScrollHint(imageListRef, isLoaded, isImageLoaded);
//     const imageRefs = useImagesLocationObserver(
//         'data' in result! && Array.isArray(result.data) ? result.data : [],
//         setImageLocation,
//     );

//     useEffect(() => {
//         if (!imageDates?.length) {
//             return;
//         }

//         setDatesWithImages(imageDates);
//         setCurrentDate(imageDates[0]);
//     }, [imageDates]);

//     if (loadError) {
//         showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
//         navigate(-1);
//     }

//     if (!isLoaded || isLoading) {
//         return <Spinner />;
//     }

//     if (!result) return;
//     if (!result.success) {
//         return;
//     }

//     const images = result.data;

//     return (
//         <div css={pageContainer}>
//             <button
//                 css={backButtonStyle}
//                 onClick={() => navigate(`${ROUTES.PATH.TRIP.ROUTE.ROOT(tripKey as string)}`, { state: pinPointId })}
//             >
//                 <ChevronLeft color={theme.COLORS.TEXT.DESCRIPTION} size={24} strokeWidth={1.5} />
//             </button>

//             {imageLocation && <DateMap imageLocation={imageLocation} />}

//             <DateSelector
//                 currentDate={currentDate}
//                 datesWithImages={datesWithImages}
//                 startDate={startDate}
//                 onDateSelect={(date: string) => setCurrentDate(date)}
//             />

//             <section ref={imageListRef} css={imageListStyle}>
//                 {images.map((image, index) => (
//                     <ImageItem
//                         key={image.mediaFileId}
//                         image={image}
//                         index={index}
//                         onImageLoad={handleImageLoad}
//                         isImageLoaded={isImageLoaded}
//                         reference={(element) => (imageRefs.current[index] = element)}
//                     />
//                 ))}
//             </section>

//             {isFirstLoad && (
//                 <div css={scrollHintOverlayStyle(isHintOverlayVisible)}>
//                     <div css={scrollHintContentStyle}>
//                         <p css={scrollHintText}>아래로 스크롤하세요</p>
//                         <ArrowDown size={24} color={theme.COLORS.TEXT.WHITE} />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const pageContainer = css`
//     height: 100dvh;
//     display: flex;
//     flex-direction: column;
//     transition: transform 0.3s ease-in-out;
//     overflow-y: auto;
//     background-color: ${theme.COLORS.BACKGROUND.BLACK};
//     position: relative;
// `;

// const backButtonStyle = css`
//     width: 40px;
//     height: 40px;
//     position: absolute;
//     z-index: 1;
//     top: 8px;
//     left: 8px;
//     border: 1px solid ${theme.COLORS.TEXT.DESCRIPTION};
//     border: none;
//     box-shadow:
//         rgba(50, 50, 93, 0.25) 13px 13px 30px -10px,
//         rgba(0, 0, 0, 0.8) 5px 8px 16px -10px;
//     border-radius: 4px;
//     cursor: pointer;
// `;

// const imageListStyle = css`
//     flex: 1;
//     overflow-y: auto;
//     position: relative;

//     &::before {
//         content: '';
//         position: fixed;
//         left: 0;
//         top: 234px;
//         bottom: 0;
//         width: 28px;
//         background-color: ${theme.COLORS.BACKGROUND.BLACK};
//         z-index: 10;
//         box-shadow: 1px 0 3px rgba(0, 0, 0, 0.3);

//         background-image: repeating-linear-gradient(
//             to bottom,
//             transparent 0px,
//             transparent 5px,
//             rgba(255, 255, 255, 0.9) 5px,
//             rgba(255, 255, 255, 0.9) 15px,
//             transparent 15px,
//             transparent 20px
//         );
//         background-size: 12px 24px;
//         background-position: center;
//         background-repeat: repeat-y;
//     }

//     &::after {
//         content: '';
//         position: fixed;
//         right: 0;
//         top: 234px;
//         bottom: 0;
//         width: 28px;
//         background-color: ${theme.COLORS.BACKGROUND.BLACK};
//         z-index: 10;
//         box-shadow: -1px 0 3px rgba(0, 0, 0, 0.3);

//         background-image: repeating-linear-gradient(
//             to bottom,
//             transparent 0px,
//             transparent 5px,
//             rgba(255, 255, 255, 0.9) 5px,
//             rgba(255, 255, 255, 0.9) 15px,
//             transparent 15px,
//             transparent 20px
//         );
//         background-size: 12px 24px;
//         background-position: center;
//         background-repeat: repeat-y;
//     }
// `;

// const scrollHintOverlayStyle = (isVisible: boolean) => css`
//     position: fixed;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background-color: rgba(0, 0, 0, 0.7);
//     display: flex;
//     justify-content: center;
//     align-items: end;
//     opacity: ${isVisible ? 1 : 0};
//     visibility: ${isVisible ? 'visible' : 'hidden'};
//     transition:
//         opacity 0.3s ease-in-out,
//         visibility 0.3s ease-in-out;
//     z-index: 1000;
//     pointer-events: ${isVisible ? 'auto' : 'none'};
//     padding: 16px;
// `;

// const scrollHintContentStyle = css`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 8px;
//     margin-bottom: 18px;
// `;

// const scrollHintText = css`
//     color: ${theme.COLORS.TEXT.WHITE};
//     text-align: center;
//     margin: 0;
// `;

// export default ImageByDatePage;

import { useEffect, useState, useRef } from 'react';

import { css } from '@emotion/react';
import { ArrowDown, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMediaByDate } from '@/domains/media/hooks/queries';
import { useImagesLocationObserver } from '@/domains/media/hooks/useImagesLocationObserver';
import DateMap from '@/domains/trip/components/DateMap';
import DateSelector from '@/domains/trip/components/DateSelector';
import ImageItem from '@/domains/trip/components/ImageItem';
import Spinner from '@/shared/components/common/Spinner';
import { ROUTES } from '@/shared/constants/paths';
import { useGoogleMaps } from '@/shared/hooks/useGoogleMaps';
import { useScrollHint } from '@/shared/hooks/useScrollHint';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';
import { LatLng } from '@/shared/types/map';

const ImageByDatePage = () => {
    // const [currentDate, setCurrentDate] = useState('');
    // const [datesWithImages, setDatesWithImages] = useState<string[]>([]);
    // const [imageLocation, setImageLocation] = useState<LatLng>();
    // const [isImageLoaded, setIsImageLoaded] = useState(false);
    // const { isLoaded, loadError } = useGoogleMaps();
    // const showToast = useToastStore((state) => state.showToast);
    // const { tripKey } = useParams();
    // const {
    //     state: { startDate, imagesByDates: imageDates, pinPointId },
    // } = useLocation();
    // const navigate = useNavigate();
    // const imageListRef = useRef<HTMLDivElement>(null);
    // const { data: result, isLoading } = useMediaByDate(tripKey!, currentDate || startDate);
    // // handleImageLoad 함수 추가
    // const handleImageLoad = () => {
    //     setIsImageLoaded(true);
    // };
    // const { isHintOverlayVisible, isFirstLoad } = useScrollHint(imageListRef, isLoaded, isImageLoaded);
    // const imageRefs = useImagesLocationObserver(
    //     result && 'data' in result && Array.isArray(result.data) ? result.data : [],
    //     setImageLocation,
    // );
    // useEffect(() => {
    //     if (!imageDates?.length) {
    //         return;
    //     }
    //     setDatesWithImages(imageDates);
    //     setCurrentDate(imageDates[0]);
    // }, [imageDates]);
    // if (loadError) {
    //     showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
    //     navigate(-1);
    // }
    // if (!isLoaded || isLoading) {
    //     return <Spinner />;
    // }
    // // null 및 undefined 체크 추가
    // if (!result) return <div>데이터를 불러올 수 없습니다.</div>;
    // if (!result.success) {
    //     return <div>데이터를 불러오는데 문제가 발생했습니다.</div>;
    // }
    // const images = result.data;
    // return (
    //     <div css={pageContainer}>
    //         <button
    //             css={backButtonStyle}
    //             onClick={() => navigate(`${ROUTES.PATH.TRIP.ROUTE.ROOT(tripKey as string)}`, { state: pinPointId })}
    //         >
    //             <ChevronLeft color={theme.COLORS.TEXT.DESCRIPTION} size={24} strokeWidth={1.5} />
    //         </button>
    //         {imageLocation && <DateMap imageLocation={imageLocation} />}
    //         <DateSelector
    //             currentDate={currentDate || startDate}
    //             datesWithImages={datesWithImages}
    //             startDate={startDate}
    //             onDateSelect={(date: string) => setCurrentDate(date)}
    //         />
    //         <section ref={imageListRef} css={imageListStyle}>
    //             {images.map((image, index) => (
    //                 <ImageItem
    //                     key={image.mediaFileId}
    //                     image={image}
    //                     index={index}
    //                     onImageLoad={handleImageLoad}
    //                     isImageLoaded={isImageLoaded}
    //                     reference={(element) => (imageRefs.current[index] = element)}
    //                 />
    //             ))}
    //         </section>
    //         {isFirstLoad && (
    //             <div css={scrollHintOverlayStyle(isHintOverlayVisible)}>
    //                 <div css={scrollHintContentStyle}>
    //                     <p css={scrollHintText}>아래로 스크롤하세요</p>
    //                     <ArrowDown size={24} color={theme.COLORS.TEXT.WHITE} />
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    // );
    return <>zxc</>;
};

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
    background-color: ${theme.COLORS.BACKGROUND.BLACK};
    position: relative;
`;

const backButtonStyle = css`
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 8px;
    border: 1px solid ${theme.COLORS.TEXT.DESCRIPTION};
    border: none;
    box-shadow:
        rgba(50, 50, 93, 0.25) 13px 13px 30px -10px,
        rgba(0, 0, 0, 0.8) 5px 8px 16px -10px;
    border-radius: 4px;
    cursor: pointer;
`;

const imageListStyle = css`
    flex: 1;
    overflow-y: auto;
    position: relative;

    &::before {
        content: '';
        position: fixed;
        left: 0;
        top: 234px;
        bottom: 0;
        width: 28px;
        background-color: ${theme.COLORS.BACKGROUND.BLACK};
        z-index: 10;
        box-shadow: 1px 0 3px rgba(0, 0, 0, 0.3);

        background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 5px,
            rgba(255, 255, 255, 0.9) 5px,
            rgba(255, 255, 255, 0.9) 15px,
            transparent 15px,
            transparent 20px
        );
        background-size: 12px 24px;
        background-position: center;
        background-repeat: repeat-y;
    }

    &::after {
        content: '';
        position: fixed;
        right: 0;
        top: 234px;
        bottom: 0;
        width: 28px;
        background-color: ${theme.COLORS.BACKGROUND.BLACK};
        z-index: 10;
        box-shadow: -1px 0 3px rgba(0, 0, 0, 0.3);

        background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 5px,
            rgba(255, 255, 255, 0.9) 5px,
            rgba(255, 255, 255, 0.9) 15px,
            transparent 15px,
            transparent 20px
        );
        background-size: 12px 24px;
        background-position: center;
        background-repeat: repeat-y;
    }
`;

const scrollHintOverlayStyle = (isVisible: boolean) => css`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: end;
    opacity: ${isVisible ? 1 : 0};
    visibility: ${isVisible ? 'visible' : 'hidden'};
    transition:
        opacity 0.3s ease-in-out,
        visibility 0.3s ease-in-out;
    z-index: 1000;
    pointer-events: ${isVisible ? 'auto' : 'none'};
    padding: 16px;
`;

const scrollHintContentStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
`;

const scrollHintText = css`
    color: ${theme.COLORS.TEXT.WHITE};
    text-align: center;
    margin: 0;
`;

export default ImageByDatePage;
