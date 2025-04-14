import { Trip } from '@/types/trips';

export interface UserInfo {
    userId: number;
    nickname: string;
    tripsCount: string;
    recentTrip: Trip;
}
