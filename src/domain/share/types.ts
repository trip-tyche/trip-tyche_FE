export interface SharedTripDetail {
    shareId: string;
    status: string;
    ownerNickname: string;
    recipientNickname: string;

    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    // TODO: hashtags: string[]로 수정 요청
    hashtags: string;
}
