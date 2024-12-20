import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { TripModelWithoutTripId } from '@/types/trip';
import { getToken } from '@/utils/auth';

export const tripAPI = {
    fetchTripTicketInfo: async (tripId: string) => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}`);
        return data.data;
    },
    fetchTripTicketList: async () => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}`);

        return data.data;
    },
    fetchTripTimeline: async (tripId: string) => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/info`);
        return data.data;
    },
    createTrip: async () => {
        const token = getToken();
        const data = await apiClient.post(
            `${API_ENDPOINTS.TRIPS}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return data.data.tripId;
    },
    createTripInfo: async (tripId: string, tripInfo: TripModelWithoutTripId) => {
        const token = getToken();
        const data = await apiClient.post(`${API_ENDPOINTS.TRIPS}/${tripId}/info`, tripInfo, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
    // createTripImages: async (tripId: string, images: File[]) => {
    //     const formData = new FormData();
    //     images.forEach((image) => {
    //         formData.append('files', image);
    //     });

    //     const data = await apiClient.post(`${API_ENDPOINTS.TRIPS}/${tripId}/upload`, formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     });
    //     return data;
    // },
    updateTripInfo: async (tripId: string, tripInfo: TripModelWithoutTripId) => {
        const token = getToken();
        const data = await apiClient.put(`${API_ENDPOINTS.TRIPS}/${tripId}`, tripInfo, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
    deleteTripTicket: async (tripId: string) => {
        const token = getToken();
        const data = await apiClient.delete(`${API_ENDPOINTS.TRIPS}/${tripId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
};
