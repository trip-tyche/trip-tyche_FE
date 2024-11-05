import { PinPoint } from '@/types/trip';

export interface UserInfo {
    readonly userId: string;
    userNickName: string;
    trips: number;
    pinPoints: PinPoint[];
}
