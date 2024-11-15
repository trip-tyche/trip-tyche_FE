import { ClipLoader } from 'react-spinners';

import theme from '@/styles/theme';

type BackgroundType = 'light' | 'dark';
interface SpinnerProps {
    background?: BackgroundType;
}

const Spinner = ({ background = 'light' }: SpinnerProps) => (
    <ClipLoader
        color={background === 'light' ? theme.colors.black : theme.colors.modalBg}
        size={30}
        speedMultiplier={0.7}
    />
);

export default Spinner;
