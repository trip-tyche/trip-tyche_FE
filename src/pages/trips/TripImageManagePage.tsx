import { useState, useEffect, Fragment, useMemo } from 'react';

import { css } from '@emotion/react';
// import { Trash2, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import Header from '@/components/common/Header';
import ImageGrid1 from '@/components/features/image/ImageGrid1';
import { ROUTES } from '@/constants/paths';
import theme from '@/styles/theme';
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
        const grouped = tripImages.reduce<Record<string, MediaFileWithDate>>((acc, curr) => {
            const date = curr.recordDate.split('T')[0];

            if (!acc[date]) {
                acc[date] = { recordDate: date, images: [curr] };
            } else {
                acc[date].images = [...acc[date].images, curr];
            }
            return acc;
        }, {});

        return Object.values(grouped);
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
        <div css={containerStyle}>
            <Header title='사진 관리' isBackButton onBack={() => navigate(ROUTES.PATH.TRIPS.ROOT)} />
            <main css={mainStyle}>
                {/* <div css={header}>
                    <Select
                        defaultValue='모든 사진'
                        data={['모든 사진', '위치 정보 없음', '날짜 정보 없음']}
                        size='sm'
                        radius='sm'
                        allowDeselect={false}
                        w={120}
                        styles={{
                            input: {},
                        }}
                    />
                    <div css={selectButton}>선택</div>
                </div> */}
                {imageGroupByDate?.map((image) => (
                    <Fragment key={image.recordDate}>
                        <h2 css={dateStyle}>{formatToKorean(image.recordDate.split('T')[0])}</h2>
                        <ImageGrid1
                            displayedImages={image.images}
                            selectedImages={[]}
                            onHashtagSelect={() => console.log('select')}
                        />
                    </Fragment>
                ))}
            </main>
        </div>
    );
};

const containerStyle = css`
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

// const header = css`
//     padding: 4px;
//     position: relative;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
// `;

// const selectButton = css`
//     padding: 8px 12px;
//     position: fixed;
//     right: calc(50% - 206px);
//     top: 54px;
//     background-color: ${COLORS.SECONDARY};
//     color: ${COLORS.TEXT.WHITE};
//     font-size: 14px;
//     font-weight: 500;
//     border-radius: 14px;
//     z-index: 50;
// `;

const dateStyle = css`
    font-size: ${theme.FONT_SIZES.XL};
    font-weight: bold;
    padding: 12px 0 12px 12px;
    background-color: #eee;
    border-bottom: 1px solid ${theme.COLORS.BORDER};
    border-top: 1px solid ${theme.COLORS.BORDER};
`;

export default TripImageManagePage;
