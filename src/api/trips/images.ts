import axios from 'axios';

import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { Result } from '@/types/apis/common';
import { PresignedUrlRequest, PresignedUrlResponse } from '@/types/image';
import { GpsCoordinates } from '@/types/location';
import { MediaFileMetaData, UnlocatedMediaFileModel } from '@/types/media';
import { getToken } from '@/utils/auth';

export const tripImageAPI = {
    // 핀포인트 슬라이드
    fetchImagesByPinPoint: async (tripId: string, pinPoint: string) => {
        const token = getToken();
        const data = await apiClient.get(`/v1/trips/${tripId}/pinpoints/${pinPoint}/images`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data;
    },
    // 날짜별 이미지 조회
    fetchImagesByDate: async (tripId: string, date: string) => {
        const formattedDate = date.slice(0, 10);
        const data = await apiClient.get(`/v1/trips/${tripId}/map?date=${formattedDate}`);
        return data.data;
    },

    // 첫번째 이미지 좌표[위치정보⭕️]
    fetchDefaultLocation: async (tripId: string) => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/images/firstimage`);
        return data.data;
    },
    fetchUnlocatedImages: async (tripId: string): Promise<UnlocatedMediaFileModel[]> => {
        const data = await apiClient.get<UnlocatedMediaFileModel[]>(
            `${API_ENDPOINTS.TRIPS}/${tripId}/images/unlocated`,
        );
        return data.data;
    },
    updateUnlocatedImages: async (tripId: string, mediaFileId: string, location: GpsCoordinates) => {
        const data = await apiClient.put(`${API_ENDPOINTS.TRIPS}/${tripId}/images/unlocated/${mediaFileId}`, location);
        return data.data;
    },

    // 미디어 파일 업로드를 위한 Presigned URL 생성
    requestPresignedUrls: async (
        tripId: string,
        fileNames: PresignedUrlRequest[],
    ): Promise<Result<PresignedUrlResponse[]>> => {
        try {
            const response = await apiClient.post(`/v1/trips/${tripId}/presigned-url`, { files: fileNames });
            return { isSuccess: true, data: response.data.presignedUrls };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
    // S3 스토리지로 미디어 파일 업로드
    uploadToS3: async (presignedUrl: string, file: File) => {
        await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
    },
    // 미디어 파일 메타데이터 등록 (mediaLink, latitude, longitude, recordDate)
    createMediaFileMetadata: async (tripId: string, metaDatas: Omit<MediaFileMetaData, 'mediaFileId'>[]) => {
        await apiClient.post(`/v1/trips/${tripId}/media-files`, metaDatas);
    },
    // 여행에 등록된 모든 이미지 조회
    getTripImages: async (tripId: string) => {
        try {
            const response = await apiClient.get(`/v1/trips/${tripId}/media-files`);
            if (response.status !== 200 || !response.data) {
                return { isSuccess: false, error: '사진을 불러오는 중 오류가 발생했습니다.' };
            }
            return { isSuccess: true, data: response.data.mediaFiles };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
    // 선택한 여행 이미지 삭제
    deleteImages: async (tripId: string, imagesToDelete: string[]): Promise<Result<string>> => {
        try {
            const response = await apiClient.delete(`/v1/trips/${tripId}/media-files`, {
                data: { mediaFileIds: imagesToDelete },
            });
            if (response.status !== 200 || !response.data) {
                return { isSuccess: false, error: `사진 삭제에 실패하였습니다.` };
            } else {
                return { isSuccess: true, data: `${imagesToDelete.length}장의 사진이 성공적으로 삭제되었습니다.` };
            }
        } catch (error) {
            console.error(error);
            return { isSuccess: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
    // 선택한 여행 이미지 수정
    updateImages: async (tripId: string, imagesToUpdate: MediaFileMetaData[]) => {
        const response = await apiClient.patch(`/v1/trips/${tripId}/media-files`, {
            mediaFiles: imagesToUpdate,
        });
        return response.data;
    },
};
