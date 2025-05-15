import { apiClient } from '@/libs/apis/shared/client';
import { ApiResponse, RouteResponse } from '@/libs/apis/shared/types';
// import { RouteResponse } from '@/api/types';

export const routeAPI = {
    // 여행 경로 정보 조회
    fetchTripRoute: async (tripKey: string): Promise<ApiResponse<RouteResponse>> =>
        await apiClient.get(`/v1/trips/${tripKey}/info`),
};
