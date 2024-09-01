import { useEffect, useState } from 'react';

const S3Test = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetch('/src/mock/s3test.json')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUserInfo(data);
                setImageUrl(data.avatarUrl);
            })
            .catch((error) => console.error('Error:', error));
    }, []);
    function downloadFile(fileUrl: string) {
        fetch(fileUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'avatar.png'; // 파일 다운로드 이름 지정
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((error) => console.error('Error downloading file:', error));
    }

    return (
        <>
            <img src={imageUrl} />
        </>
    );
};

export default S3Test;
