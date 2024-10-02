import { css } from '@emotion/react';
import { HashLoader, RiseLoader, PropagateLoader, FadeLoader } from 'react-spinners';

const Loading = ({ type }: { type: string }) => (
    <>
        {type === 'button' ? (
            <PropagateLoader color='#ffffff' size={8} speedMultiplier={1} />
        ) : (
            <RiseLoader color='#ff0000' size={10} speedMultiplier={1} />
        )}
    </>
);

export default Loading;
