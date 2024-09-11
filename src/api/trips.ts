import axios from 'axios';

interface Trip {
    tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
interface Trips {
    userNickName: string;
    trips: Trip[];
}
export const fetchTripsList = async (): Promise<Trips> => {
    try {
        const response = await axios.get(`/src/mock/getTrips.json`, {
            // const response = await axios.get(`http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips`, {
            // headers: {
            // Authorization: `Bearer ${TOKEN}`,
            // 'Content-Type': 'application/json',
            // },
        });

        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};
