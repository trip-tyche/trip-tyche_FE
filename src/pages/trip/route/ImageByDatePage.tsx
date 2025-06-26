import { useEffect, useState, useRef, useCallback } from 'react';

import { css } from '@emotion/react';
import { ImageOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMediaByDate } from '@/domains/media/hooks/queries';
import { useImageLocationObserver } from '@/domains/media/hooks/useImageLocationObserver';
import { MediaFile } from '@/domains/media/types';
import DateSelector from '@/domains/trip/components/DateSelector';
import ImageItem from '@/domains/trip/components/ImageItem';
import BackButton from '@/shared/components/common/Button/BackButton';
import Spinner from '@/shared/components/common/Spinner';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import SingleMarkerMap from '@/shared/components/map/SingleMarkerMap';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location } from '@/shared/types/map';

const ImageByDatePage = () => {
    const [images, setImages] = useState<MediaFile[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [currentImageLocation, setCurrentImageLocation] = useState<Location | null>(null);
    const [isAllImageLoad, setIsAllImageLoad] = useState(false);

    const showToast = useToastStore((state) => state.showToast);

    const { tripKey, date } = useParams();
    const navigate = useNavigate();

    const loadedImagesCount = useRef<number>(0);
    const imageRefs = useImageLocationObserver(
        images,
        useCallback((location: Location) => setCurrentImageLocation(location), []),
    );
    const { isMapScriptLoaded, isMapScriptLoadError } = useMapControl(ZOOM_SCALE.IMAGE_BY_DATE, DEFAULT_CENTER);
    const { data: imagesResult } = useMediaByDate(tripKey || '', date || '');

    useEffect(() => {
        const dates: string[] = JSON.parse(sessionStorage.getItem('imageDates') || '');
        setDates(dates);
    }, []);

    useEffect(() => {
        if (imagesResult) {
            const images = imagesResult.success ? imagesResult.data : [];
            setImages(images);
            if (images.length === 0) {
                setIsAllImageLoad(true);
            }
            const initialLocation = { latitude: images[0].latitude, longitude: images[0].longitude };
            setCurrentImageLocation(initialLocation);
        }
    }, [imagesResult]);

    const handleImageLoad = useCallback(() => {
        loadedImagesCount.current += 1;
        if (loadedImagesCount.current === images.length) setIsAllImageLoad(true);
    }, [images]);

    if (isMapScriptLoadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
        navigate(ROUTES.PATH.MAIN);
        return null;
    }

    const emptyImage = images.length === 0;

    return (
        <>
            <div css={container}>
                {!isAllImageLoad && <Indicator />}

                <BackButton onClick={() => navigate(`${ROUTES.PATH.TRIP.ROOT(tripKey as string)}`)} />
                {isMapScriptLoaded && isAllImageLoad ? (
                    <SingleMarkerMap position={currentImageLocation} />
                ) : (
                    <div css={mapLoader}>
                        <Spinner />
                    </div>
                )}
                <DateSelector selectedDate={date!} dates={dates} />
                {emptyImage ? (
                    <div css={emptyImageList}>
                        <div css={emptyIcon}>
                            <ImageOff color='white' />
                        </div>
                        <h3 css={emptyImageListHeading}>등록된 사진이 없어요</h3>
                        <p css={emptyImageListDescription}>{`티켓 속 사진 관리에서\n새로운 사진을 등록해주세요`}</p>
                    </div>
                ) : (
                    <main css={imageListStyle}>
                        {images.map((image, index) => (
                            <ImageItem
                                key={image.mediaFileId}
                                reference={(element) => (imageRefs.current[index] = element)}
                                image={image}
                                index={index}
                                onImageLoad={handleImageLoad}
                            />
                        ))}
                    </main>
                )}
            </div>
        </>
    );
};

const container = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
    background-color: #f9fafb;
    position: relative;
    user-select: none;
`;

const imageListStyle = css`
    max-width: 430px;
    flex: 1;
    overflow-y: auto;
    position: relative;
`;

const emptyImageList = css`
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const emptyImageListHeading = css`
    margin-top: 18px;
    color: #303038;
    font-size: 18px;
    font-weight: bold;
`;

const emptyImageListDescription = css`
    margin-top: 8px;
    color: #767678;
    font-size: 15px;
    line-height: 21px;
    text-align: center;
    white-space: pre-line;
`;

const emptyIcon = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
`;

const mapLoader = css`
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default ImageByDatePage;
