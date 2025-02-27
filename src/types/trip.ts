export interface TripModel {
    readonly tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
    imagesDate: string[];
    ownerNickname: string;
    userNickname: string;
    sharedUserNicknames: string[];
}

export interface TripListModel {
    readonly userNickName: string;
    readonly trips: TripModel[];
}

export type TripModelWithoutTripId = Omit<TripModel, 'tripId'>;
export type TripModelWithoutTripIdAndImagesDate = Omit<TripModel, 'tripId' | 'imagesDate'>;
