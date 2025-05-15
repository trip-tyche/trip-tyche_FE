export const calculateTripDay = (firstImageDate: string, startDate: string, endDate: string) => {
    const firstImage = new Date(firstImageDate).getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const diffInTime = firstImage - start;
    const diffInEnd = end - start;

    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    const diffInEndDay = Math.floor(diffInEnd / (1000 * 60 * 60 * 24));

    return diffInDays === 0 ? '출국' : diffInDays === diffInEndDay ? '귀국' : `Day ${diffInDays + 1}`;
};
