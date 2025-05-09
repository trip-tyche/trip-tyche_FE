export interface Trip extends TripInfo {
    // userNickname?: string;
    ownerNickname?: string;
    sharedUserNicknames?: string[];
}

export interface TripInfo {
    tripKey?: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
    mediaFilesDates?: string[];
    shareId?: number;
}

export interface Country {
    emoji: string;
    nameKo: string;
    nameEn: string;
    value: string;
}
