import axios from 'axios';

import { PresignedUrlRequest, PresignedUrlResponse } from '@/domains/media/image';
import { MediaFile, UnlocatedMediaFileModel } from '@/domains/media/types';
import { apiClient } from '@/libs/apis/client';
import { API_ENDPOINTS } from '@/libs/apis/constants';
import { ApiResponse, MediaByDate, MediaByPinPoint, Result } from '@/libs/apis/types';
import { exceptTimeFromDateString } from '@/libs/utils/date';
import { Location } from '@/shared/types/location';

export const mediaAPI = {
    // 핀포인트별 미디어 파일 조회
    fetchMediaByPinPoint: async (tripKey: string, pinPointId: string): Promise<ApiResponse<MediaByPinPoint>> =>
        await apiClient.get(`/v1/trips/${tripKey}/pinpoints/${pinPointId}/images`),
    // 날짜별 미디어 파일 조회
    fetchMediaByDate: async (tripKey: string, dateString: string): Promise<ApiResponse<MediaByDate>> => {
        const onlyDate = exceptTimeFromDateString(dateString);
        return await apiClient.get(`/v1/trips/${tripKey}/map?date=${onlyDate}`);
    },
    // 첫번째 이미지 좌표[위치정보⭕️]
    fetchDefaultLocation: async (tripKey: string) => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripKey}/images/firstimage`);
        return data.data;
    },
    fetchUnlocatedImages: async (tripKey: string): Promise<UnlocatedMediaFileModel[]> => {
        const data = await apiClient.get<UnlocatedMediaFileModel[]>(
            `${API_ENDPOINTS.TRIPS}/${tripKey}/images/unlocated`,
        );
        return data.data;
    },
    updateUnlocatedImages: async (tripKey: string, mediaFileId: string, location: Location) => {
        const data = await apiClient.put(`${API_ENDPOINTS.TRIPS}/${tripKey}/images/unlocated/${mediaFileId}`, location);
        return data.data;
    },

    // 미디어 파일 업로드를 위한 Presigned URL 생성
    requestPresignedUrls: async (
        tripKey: string,
        imageNames: PresignedUrlRequest[],
    ): Promise<Result<PresignedUrlResponse[]>> => {
        try {
            const response = await apiClient.post(`/v1/trips/${tripKey}/presigned-url`, { files: imageNames });
            return { success: true, data: response.data.presignedUrls };
        } catch (error) {
            console.error(error);
            return { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
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
    createMediaFileMetadata: async (tripKey: string, metaDatas: Omit<MediaFile, 'mediaFileId'>[]) => {
        await apiClient.post(`/v1/trips/${tripKey}/media-files`, metaDatas);
    },
    // 여행에 등록된 모든 이미지 조회
    getTripImages: async (
        tripKey: string,
    ): Promise<
        ApiResponse<{
            startDate: string;
            endDate: string;
            mediaFiles: MediaFile[];
        }>
    > => await apiClient.get(`/v1/trips/${tripKey}/media-files`),
    // 여행에 등록된 모든 이미지 조회
    getUnlcoatedImages: async (tripKey: string) => {
        try {
            const response = await apiClient.get(`/v1/trips/${tripKey}/media-files/unlocated`);
            return response.data.media;
        } catch (error) {
            console.error(error);
            return { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
    // 선택한 여행 이미지 삭제
    deleteImages: async (tripKey: string, images: string[]): Promise<Result<string>> => {
        try {
            const response = await apiClient.delete(`/v1/trips/${tripKey}/media-files`, {
                data: { mediaFileIds: images },
            });
            if (response.status !== 200 || !response.data) {
                return { success: false, error: `사진 삭제에 실패하였습니다.` };
            } else {
                return { success: true, data: `${images.length}장의 사진이 성공적으로 삭제되었습니다.` };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
    // 선택한 여행 이미지 수정
    updateImages: async (tripKey: string, images: MediaFile[]) => {
        try {
            const response = await apiClient.patch(`/v1/trips/${tripKey}/media-files`, {
                mediaFiles: images,
            });
            if (response.status !== 200 || !response.data) {
                return { success: false, error: `사진 삭제에 실패하였습니다.` };
            } else {
                return { success: true, data: `${images.length}장의 사진이 성공적으로 삭제되었습니다.` };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
};
