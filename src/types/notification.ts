export interface Notification {
    notificationId: number;
    referenceId: number;
    message: string;
    status: string;
    senderNickname: string;
    createdAt: string;
}

export interface SharedTripDetail {
    shareId: number;
    status: string;
    ownerNickname: string;
    recipientNickname: string;
    tripId: number;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
