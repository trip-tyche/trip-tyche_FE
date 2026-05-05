import { Navigate } from 'react-router-dom';

import useUserStore from '@/domains/user/stores/useUserStore';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';

/**
 * 인증된 사용자만 children을 렌더링한다.
 * - status === 'unknown' → 부팅 중. AuthProvider가 status를 결정할 때까지 대기.
 * - status === 'unauthenticated' → /signin 으로 redirect (replace).
 * - status === 'authenticated' → children 렌더.
 *
 * 401 사이클을 차단하는 핵심 가드. interceptor가 setUnauthenticated()를 호출하면
 * 다음 렌더 사이클에서 이 컴포넌트가 즉시 navigate한다.
 */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const status = useUserStore((s) => s.status);

    if (status === 'unknown') return <Indicator />;
    if (status === 'unauthenticated') return <Navigate to={ROUTES.PATH.SIGNIN} replace />;
    return <>{children}</>;
};

export default RequireAuth;
