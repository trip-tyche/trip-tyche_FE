import { MediaFile } from '@/domains/media/types';

export const sortByDate = (mediaFiles: MediaFile[]) =>
    mediaFiles.sort(
        (dateA: MediaFile, dateB: MediaFile) =>
            new Date(dateA.recordDate).getTime() - new Date(dateB.recordDate).getTime(),
    );
