import { Trip } from '@/domain/trip/types';

export interface UserInfo {
    userId: number;
    nickname: string;
    tripsCount: string;
    recentTrip: Trip;
}
