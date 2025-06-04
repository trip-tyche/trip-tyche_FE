export interface Trip extends TripInfo {
    ownerNickname?: string;
    sharedUsersNicknames?: string[];
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
    confirmed?: boolean;
}

export interface Country {
    emoji: string;
    nameKo: string;
    nameEn: string;
    value: string;
}
