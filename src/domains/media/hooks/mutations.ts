import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mediaAPI } from '@/libs/apis';

export const useMediaDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tripKey, images }: { tripKey: string; images: string[] }) =>
            mediaAPI.deleteImages(tripKey, images),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trip-images'] });
        },
    });
};
