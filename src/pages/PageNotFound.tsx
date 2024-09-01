import { useRouteError } from 'react-router-dom';

export default function PageNotFound() {
    const error = useRouteError();
    // 리액트 라우터에서 특정 라우트에서 발생한 오류를 처리하고, 해당 오류에 대한 정보를 제공하기 위한 훅
    console.error(error);

    return (
        <div>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
        </div>
    );
}
