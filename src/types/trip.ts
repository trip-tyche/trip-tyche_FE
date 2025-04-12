export interface Trip {
    tripId?: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
    imagesDate?: string[];
    // TODO: meidaFilesDates -> mediaFilesDates 오타 수정 요청 필요
    meidaFilesDates?: string[];
    userNickname?: string;
    ownerNickname: string;
    sharedUserNicknames?: string[];
}
