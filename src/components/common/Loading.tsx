import { PacmanLoader, RiseLoader, PropagateLoader, MoonLoader } from 'react-spinners';

const Loading = ({ type }: { type?: string }) => (
    <>
        {type === 'button' ? (
            // <MoonLoader color='#fff' size={20} speedMultiplier={0.7} />
            <PacmanLoader size={10} color='#fff' speedMultiplier={1} />
        ) : (
            // <PropagateLoader color='#ffffff' size={8} speedMultiplier={1} />
            <MoonLoader color='#333' size={30} speedMultiplier={0.7} />
        )}
    </>
);

export default Loading;
