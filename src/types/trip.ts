export interface TripModel {
    readonly tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

export interface TripListModel {
    readonly userNickName: string;
    readonly trips: TripModel[];
}

export type TripModelWithoutTripId = Omit<TripModel, 'tripId'>;
