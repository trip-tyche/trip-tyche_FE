import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MediaFile } from '@/domains/media/types';
import { mediaAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useMediaDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tripKey, images }: { tripKey: string; images: MediaFile[] }) => {
            const mediaFilesId: string[] = images.map((image) => image.mediaFileId!);
            return mediaAPI.deleteImages(tripKey, mediaFilesId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trip-images'] });
        },
    });
};

export const useMetadataUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tripKey, images }: { tripKey: string; images: MediaFile[] }) =>
            toResult(() => mediaAPI.updateMediaFileMetadata(tripKey, images)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trip-images'] });
        },
    });
};
