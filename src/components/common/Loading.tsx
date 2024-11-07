import { ClipLoader } from 'react-spinners';

const Loading = ({ type }: { type?: string }) => (
    <>
        {type === 'bgBlack' ? (
            <ClipLoader color='#fff' size={30} speedMultiplier={0.7} />
        ) : (
            <ClipLoader color='#333' size={30} speedMultiplier={0.7} />
        )}
    </>
);

export default Loading;
