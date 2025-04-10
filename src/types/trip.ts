export interface Trip {
    tripId?: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
    imagesDate?: string[];
    // TODO: meidaFilesDates 오타
    meidaFilesDates?: string[];
    userNickname?: string;
    ownerNickname: string;
    sharedUserNicknames?: string[];
}
