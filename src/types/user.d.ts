import { PinPoint, Trip } from '@/types/trip';

export interface UserInfo {
    readonly userId: string;
    userNickName: string;
    trips: Trip[];
    pinPoints: PinPoint[];
}
