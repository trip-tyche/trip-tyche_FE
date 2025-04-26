export type ShareStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SharedTripDetail {
    shareId: string;
    status: ShareStatus;
    ownerNickname: string;
    recipientNickname: string;

    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
