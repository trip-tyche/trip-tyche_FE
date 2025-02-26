export interface Notification {
    notificationId: number;
    referenceId: number;
    message: string;
    status: string;
    senderNickname: string;
    createdAt: string;
}

export interface SharedTripInfo {
    ownerNickname: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
