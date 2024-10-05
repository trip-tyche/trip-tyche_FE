import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// import { getDaysImages } from '@/api/trip'; // API 함수를 가정합니다
import Header from '@/components/layout/Header';

interface MediaFiles {
    latitude: number;
    longitude: number;
    mediaFileId: number;
    mediaLink: string;
}

const DaysImages = () => {
    const [isEntering, setIsEntering] = useState(true);
    const [mediaFiles, setMediaFiles] = useState<MediaFiles[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { tripId } = location.state as { tripId: string };

    useEffect(() => {
        const { mediaFiles } = location.state;
        setMediaFiles(mediaFiles);
    }, []);

    console.log(mediaFiles);

    const handleBackClick = () => {
        setIsEntering(true);
        setTimeout(() => {
            navigate(-1);
        }, 300);
    };

    return (
        <PageContainer isEntering={isEntering}>
            <div css={headerWrapper}>
                <Header title='Days Images' isBackButton onBack={handleBackClick} />
            </div>
            <Content>
                {mediaFiles.map((image) => (
                    <ImageItem key={image.mediaFileId}>
                        <img src={image.mediaLink} alt={`Image-${image.mediaFileId}`} />
                    </ImageItem>
                ))}
            </Content>
            {/* <WeatherSection onClick={handleBackClick}>
                <div>지도로 돌아가기</div>
                <ChevronDown size={20} />
            </WeatherSection> */}
        </PageContainer>
    );
};

const PageContainer = styled.div<{ isEntering: boolean }>`
    height: 100vh;
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
`;

const headerWrapper = css`
    position: fixed;
    top: 1;
    width: 100vw;
    max-width: 428px;
`;

const Content = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 4px;
    padding-top: 54px;
`;

const ImageItem = styled.div`
    img {
        width: 100%;
        border-radius: 4px;
    }
`;

export default DaysImages;
