export interface SharedTripDetail {
    shareId: string;
    status: string;
    ownerNickname: string;
    recipientNickname: string;

    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
