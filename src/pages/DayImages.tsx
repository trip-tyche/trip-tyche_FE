import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// import { getDaysImages } from '@/api/trip'; // API 함수를 가정합니다
import Header from '@/components/layout/Header';
const DaysImages = () => {
    const [images, setImages] = useState([]);
    const [isEntering, setIsEntering] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    // const { tripId } = location.state as { tripId: string };

    // useEffect(() => {
    //     const fetchImages = async () => {
    //         try {
    //             const data = await getDaysImages(tripId);
    //             setImages(data);
    //         } catch (error) {
    //             console.error('Error fetching days images:', error);
    //         }
    //     };

    //     fetchImages();
    //     setTimeout(() => setIsEntering(false), 300);
    // }, [tripId]);

    const handleBackClick = () => {
        setIsEntering(true);
        setTimeout(() => {
            navigate(-1);
        }, 300);
    };

    console.log('asdfsdaf');

    return (
        <PageContainer isEntering={isEntering}>
            <Header title='Days Images' isBackButton onBack={handleBackClick} />
            {/* <Content>
                {images.map((image, index) => (
                    <ImageItem key={index}>
                        <img src={image.url} alt={`Day ${image.day}`} />
                        <p>Day {image.day}</p>
                    </ImageItem>
                ))}
            </Content> */}
            {/* <WeatherSection onClick={handleBackClick}>
                <div>지도로 돌아가기</div>
                <ChevronDown size={20} />
            </WeatherSection> */}
        </PageContainer>
    );
};

const PageContainer = styled.div<{ isEntering: boolean }>`
    height: calc(100vh - 54px);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.isEntering ? 'translateY(100%)' : 'translateY(0)')};
`;

const Content = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
`;

const ImageItem = styled.div`
    margin-bottom: 20px;
    img {
        width: 100%;
        border-radius: 8px;
    }
    p {
        margin-top: 8px;
    }
`;

const WeatherSection = styled.div`
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

export default DaysImages;
