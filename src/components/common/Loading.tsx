import { MoonLoader } from 'react-spinners';

const Loading = ({ type }: { type?: string }) => (
    <>
        {type === 'button' ? (
            <MoonLoader size={20} color='#fff' speedMultiplier={1} />
        ) : type === 'bgBlack' ? (
            <MoonLoader color='#fff' size={30} speedMultiplier={0.7} />
        ) : (
            <MoonLoader color='#333' size={30} speedMultiplier={0.7} />
        )}
    </>
);

export default Loading;
