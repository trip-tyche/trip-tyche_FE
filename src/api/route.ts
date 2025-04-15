import { apiClient } from '@/api/client';
// import { RouteResponse } from '@/api/types';

export const routeAPI = {
    // 여행 경로 정보 조회
    // fetchTripRoute: async (tripKey: string): Promise<ApiResponse<RouteResponse>> =>
    //     await apiClient.get(`/v1/trips/${tripKey}/info`),
    fetchTripRoute: async (tripKey: string) => {
        const res = await apiClient.get(`/v1/trips/${tripKey}/info`);
        return res.data;
    },
};
