import { PacmanLoader, RiseLoader, PropagateLoader, MoonLoader } from 'react-spinners';

const Loading = ({ type }: { type: string }) => (
    <>
        {type === 'button' ? (
            <PacmanLoader size={10} color='#fff' speedMultiplier={1} />
        ) : (
            // <PropagateLoader color='#ffffff' size={8} speedMultiplier={1} />
            <RiseLoader color='#ff0000' size={10} speedMultiplier={1} />
        )}
    </>
);

export default Loading;
