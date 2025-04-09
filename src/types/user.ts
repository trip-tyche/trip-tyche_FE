import { Trip } from '@/types/trip';

export interface UserInfo {
    userId: number;
    nickname: string;
    tripsCount: string;
    recentTrip: Trip;
}
