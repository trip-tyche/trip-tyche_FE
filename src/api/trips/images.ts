import axios from 'axios';

import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { getToken } from '@/utils/auth';

export const tripImageAPI = {
    fetchImagesByPinPoint: async (tripId: string, pinPoint: string) => {
        const token = getToken();
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/pinpoints/${pinPoint}/images`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data;
    },
    fetchImagesByDate: async (tripId: string, date: string) => {
        const formattedDate = date.slice(0, 10);
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/map?date=${formattedDate}`);
        return data.data;
    },
    createTripImages: async (tripId: string, images: File[]) => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('files', image);
        });

        const data = await apiClient.post(`${API_ENDPOINTS.TRIPS}/${tripId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },
    requestPresignedUploadUrls: async (tripId: string, files: PresignedUploadFileInfo[]) => {
        const formData = { tripId, files };
        const data = await apiClient.post(`/api/trips/${tripId}/presigned-url`, formData);
        // console.log(data);
        return data.data.presignedUrls;
    },
    uploadToS3: async (presignedUrl: string, file: File) => {
        const data = await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
        // console.log(data);
        return data;
    },
    registerTripMediaFiles: async (tripId: string, files: MediaFileMetadata[]) => {
        // const formData = { tripId, files };
        const data = await apiClient.post(`/api/trips/${tripId}/media-files`, files);
        // console.log(data);
        return data;
    },
};

interface PresignedUploadFileInfo {
    fileName: string;
    fileType: string;
}

interface MediaFileMetadata {
    mediaLink: string;
    latitude: number | null;
    longitude: number | null;
    recordDate: string;
    mediaType: string;
}
