import { useQuery } from '@tanstack/react-query';

import { userAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

/**
 * 사용자 summary 조회. AuthProvider가 부팅 시 1회 호출하고,
 * 페이지(MainPage / GlobeMapPage)는 socket invalidation 후 자동 refetch를 받기 위해 구독한다.
 * 인증 가드는 RequireAuth가 책임지므로 별도 enabled 옵션은 두지 않는다.
 */
export const useSummary = () =>
    useQuery({
        queryKey: ['summary'],
        queryFn: () => toResult(() => userAPI.fetchUserInfo()),
        staleTime: 0,
    });
