export interface Trip {
    tripId?: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
    imagesDate?: string[];
    mediaFilesDates?: string[];
    userNickname?: string;
    ownerNickname: string;
    sharedUserNicknames?: string[];
}
