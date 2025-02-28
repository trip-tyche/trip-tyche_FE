import { useState, useEffect, Fragment, useMemo } from 'react';

import { css } from '@emotion/react';
// import { Trash2, Plus } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import Header from '@/components/common/Header';
import MediaImageGrid from '@/components/features/image/ImageGrid1';
import { ROUTES } from '@/constants/paths';
import { COLORS } from '@/constants/theme';
import { MediaFile, MediaFileWithDate } from '@/types/media';
import { formatToKorean } from '@/utils/date';

const TripImageManagePage = () => {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const [tripImages, setTripImages] = useState<MediaFile[]>([]);
    // const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
    // const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const getTripImages = async () => {
            try {
                if (!tripId) return;

                const response = await tripImageAPI.getTripImages(tripId);
                setTripImages(response.mediaFiles);
            } catch (error) {
                console.error('여행 이미지 조회 실패', error);
                // TODO: 에러 처리 추가
            }
        };

        getTripImages();
    }, [tripId]);

    const imageGroupByDate = useMemo(() => {
        const group = tripImages.reduce<Record<string, MediaFileWithDate>>((acc, curr) => {
            const date = curr.recordDate.split('T')[0];

            if (!acc[date]) {
                acc[date] = { recordDate: date, images: [curr] };
            } else {
                acc[date].images = [...acc[date].images, curr];
            }

            return acc;
        }, {});

        return Object.values(group).sort(
            (dateA: MediaFileWithDate, dateB: MediaFileWithDate) =>
                new Date(dateA.recordDate).getTime() - new Date(dateB.recordDate).getTime(),
        );
    }, [tripImages]);

    // const handleDeleteImages = async (imagesToDelete: MediaFile[]) => {
    //     try {
    //         // TODO: API 호출로 이미지 삭제 구현
    //         // await tripImageAPI.deleteImages(imagesToDelete.map(img => img.mediaFileId));

    //         setTripImages((prev) =>
    //             prev.filter(
    //                 (image) => !imagesToDelete.some((deleteImage) => deleteImage.mediaFileId === image.mediaFileId),
    //             ),
    //         );
    //         setSelectedImages([]);
    //         setIsSelectionMode(false);
    //     } catch (error) {
    //         console.error('Failed to delete images:', error);
    //         // TODO: 에러 처리 추가
    //     }
    // };

    if (!tripImages) return null;

    return (
        <div css={container}>
            <Header title='사진 관리' isBackButton onBack={() => navigate(ROUTES.PATH.TRIPS.ROOT)} />
            <main css={mainStyle}>
                {imageGroupByDate?.map((image) => (
                    <Fragment key={image.recordDate}>
                        <h2 css={dateStyle}>{formatToKorean(image.recordDate.split('T')[0])}</h2>
                        <MediaImageGrid images={image.images} />
                    </Fragment>
                ))}
            </main>
            <div css={buttonGroup}>
                <div css={buttonStyle}>선택</div>
                <div css={buttonStyle}>
                    <GoKebabHorizontal strokeWidth={1.5} />
                </div>
            </div>
        </div>
    );
};

const container = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: auto;
`;

const mainStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const buttonGroup = css`
    min-width: 428px;
    height: 84px;
    padding: 12px;
    position: absolute;
    bottom: 0;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    align-items: end;
    background-image: linear-gradient(#00000000, #00000060);
`;

const buttonStyle = css`
    color: ${COLORS.TEXT.WHITE};
    background-color: ${COLORS.TEXT.DESCRIPTION};
    font-size: 12px;
    padding: 8px 10px;
    border-radius: 18px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;

const dateStyle = css`
    font-weight: bold;
    padding: 12px;
`;

export default TripImageManagePage;
