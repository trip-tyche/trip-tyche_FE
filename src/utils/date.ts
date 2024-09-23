import { FormattedTripDate, Trip } from '@/types/trip';

export const formatTripDate = (tripsList: Trip[]): FormattedTripDate[] =>
    tripsList?.map((trip) => ({
        ...trip,
        country: trip.country.toUpperCase(),
        startDate: new Date(trip.startDate).toLocaleDateString('ko-KR'),
        endDate: new Date(trip.endDate).toLocaleDateString('ko-KR'),
    }));
