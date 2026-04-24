import { Navigate, Outlet } from 'react-router-dom';

import { useSummary } from '@/domains/user/hooks/queries';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';

const PrivateRoute = () => {
    const { data: summaryResult, isLoading } = useSummary();

    if (isLoading) return <Indicator />;
    if (!summaryResult?.success || !summaryResult.data) {
        return <Navigate to={ROUTES.PATH.SIGNIN} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
