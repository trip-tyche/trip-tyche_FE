export interface Trip {
    tripId?: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
    imagesDate?: string[];
    userNickname?: string;
    ownerNickname: string;
    sharedUserNicknames?: string[];
}

export interface TripList {
    userNickName: string;
    trips: Trip[];
}
