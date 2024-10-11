import { paths } from '@/constants/paths';
import { LoadingScreen } from '@/shared/components/loading-screen';
import { useAuthStore } from '@/stores';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const AuthGuard = (props: Props) => {
    const { getUserData, loading } = useAuthStore();

    useEffect(() => {
        getUserData();
    }, []);

    return loading ? <LoadingScreen /> : <Container>{props.children}</Container>;
};

export default AuthGuard;

function Container({ children }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const { userData } = useAuthStore();
    const isAuth = !!userData;

    const [checked, setChecked] = useState(false);

    const check = useCallback(async () => {
        if (!isAuth) {
            const searchParams = new URLSearchParams({
                returnTo: location.pathname,
            }).toString();

            navigate(
                {
                    pathname: paths.signUp,
                    search: `?${searchParams}`,
                },
                {
                    replace: true,
                }
            );
        } else {
            setChecked(true);
        }
    }, [isAuth]);

    useEffect(() => {
        check();
    }, []);

    if (!checked) {
        return null;
    }

    return <>{children}</>;
}
