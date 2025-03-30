import axios from 'axios';

import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { PresignedUrlRequest } from '@/types/image';
import { GpsCoordinates } from '@/types/location';
import { MediaFile, RealMediaFile, UnlocatedMediaFileModel } from '@/types/media';
import { getToken } from '@/utils/auth';

export const tripImageAPI = {
    // 핀포인트 슬라이드
    fetchImagesByPinPoint: async (tripId: string, pinPoint: string) => {
        const token = getToken();
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/pinpoints/${pinPoint}/images`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data;
    },
    // 날짜별 이미지 조회
    fetchImagesByDate: async (tripId: string, date: string) => {
        const formattedDate = date.slice(0, 10);
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/map?date=${formattedDate}`);
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
    requestPresignedUploadUrls: async (tripId: string, files: PresignedUrlRequest[]) => {
        const formattedData = { tripId, files };
        const data = await apiClient.post(`/api/trips/${tripId}/presigned-url`, formattedData);
        return data.data.presignedUrls;
    },
    uploadToS3: async (presignedUrl: string, file: File) => {
        const data = await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
        return data;
    },
    // 미디어 파일의 메타데이터 등록
    postMediaFileMetadata: async (tripId: string, mediaFiles: RealMediaFile[]) => {
        const response = await apiClient.post(`/api/trips/${tripId}/media-files`, mediaFiles);

        return response;
    },

    // 여행에 등록된 모든 이미지 조회
    getTripImages: async (tripId: string) => {
        const response = await apiClient.get(`/api/trips/${tripId}/media-files`);
        return response.data;
    },

    // 선택한 여행 이미지 삭제
    deleteImages: async (tripId: string, imagesToDelete: string[]) => {
        const response = await apiClient.delete(`/api/trips/${tripId}/media-files`, {
            data: { mediaFileIds: imagesToDelete },
        });
        return response.data;
    },

    // 선택한 여행 이미지 수정
    updateImages: async (tripId: string, imagesToUpdate: MediaFile[]) => {
        const response = await apiClient.patch(`/api/trips/${tripId}/media-files`, {
            mediaFiles: imagesToUpdate,
        });
        return response.data;
    },
};
