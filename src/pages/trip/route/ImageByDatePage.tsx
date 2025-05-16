import { useEffect, useState, useRef } from 'react';

import { css } from '@emotion/react';
import { ArrowDown, ImageOff } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMediaByDate } from '@/domains/media/hooks/queries';
import { useImagesLocationObserver } from '@/domains/media/hooks/useImagesLocationObserver';
import { MediaFile } from '@/domains/media/types';
import { filterValidLocationMediaFile } from '@/domains/media/utils';
import DateSelector from '@/domains/trip/components/DateSelector';
import ImageItem from '@/domains/trip/components/ImageItem';
import BackButton from '@/shared/components/common/Button/BackButton';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import SingleMarkerMap from '@/shared/components/map/SingleMarkerMap';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useScrollHint } from '@/shared/hooks/useScrollHint';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';
import { Location } from '@/shared/types/map';

const ImageByDatePage = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [imageDates, setImageDates] = useState<string[]>([]);
    const [imageLocation, setImageLocation] = useState<Location | null>(null);
    const [isAllImageLoad, setIsAllImageLoad] = useState(false);
    const [images, setImages] = useState<MediaFile[]>([]);

    const showToast = useToastStore((state) => state.showToast);

    const { tripKey } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const imageListRef = useRef<HTMLDivElement>(null);
    const loadedImagesCount = useRef<number>(0);

    const { data: result, isLoading } = useMediaByDate(tripKey!, selectedDate);
    const { isMapScriptLoaded, isMapScriptLoadError } = useMapControl(ZOOM_SCALE.DEFAULT.IMAGE_BY_DATE, DEFAULT_CENTER);
    const { isHintOverlayVisible, isFirstUser } = useScrollHint(imageListRef, isMapScriptLoaded, isAllImageLoad);

    useEffect(() => {
        const imageDates = JSON.parse(sessionStorage.getItem('imageDates') || '') as string[];
        setImageDates(imageDates);
        setSelectedDate(imageDates[0]);
    }, []);

    useEffect(() => {
        if (result) {
            const images = result.success ? result.data : [];
            setImages(filterValidLocationMediaFile(images));
            if (images.length === 0) {
                setIsAllImageLoad(true);
            }
        }
        setImageLocation(null);
    }, [result]);

    useEffect(() => {
        if (selectedDate) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('date', selectedDate);
            setSearchParams(newSearchParams);
        }
    }, [searchParams, selectedDate, setSearchParams]);

    const imageRefs = useImagesLocationObserver(
        result && 'data' in result && Array.isArray(result.data) ? result.data : [],
        setImageLocation,
    );

    const handleImageLoad = () => {
        loadedImagesCount.current += 1;
        if (loadedImagesCount.current === images.length) {
            setIsAllImageLoad(true);
        }
    };

    if (!isMapScriptLoaded || isLoading) {
        return <Indicator />;
    }

    if (isMapScriptLoadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
        navigate(ROUTES.PATH.MAIN);
    }

    const emptyImage = images.length === 0;

    return (
        <>
            <div css={container}>
                {(!result || isLoading || !isAllImageLoad) && <Indicator text='사진 불러오는 중...' />}

                <BackButton onClick={() => navigate(`${ROUTES.PATH.TRIP.ROUTE.ROOT(tripKey as string)}`)} />

                <SingleMarkerMap position={imageLocation} />
                <DateSelector
                    selectedDate={selectedDate}
                    imageDates={imageDates}
                    onDateSelect={(date: string) => setSelectedDate(date)}
                />

                {!emptyImage ? (
                    <main ref={imageListRef} css={imageListStyle}>
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
                ) : (
                    <div css={emptyImageList}>
                        <div css={emptyIcon}>
                            <ImageOff color='white' />
                        </div>
                        <h3 css={emptyImageListHeading}>등록된 사진이 없어요</h3>
                        <p css={emptyImageListDescription}>{`티켓 속 사진 관리에서\n새로운 사진을 등록해주세요`}</p>
                    </div>
                )}
            </div>
            {isFirstUser && (
                <div css={scrollHintOverlayStyle(isHintOverlayVisible)}>
                    <div css={scrollHintContentStyle}>
                        <p css={scrollHintText}>아래로 스크롤하세요</p>
                        <ArrowDown size={24} color={theme.COLORS.TEXT.WHITE} />
                    </div>
                </div>
            )}
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
