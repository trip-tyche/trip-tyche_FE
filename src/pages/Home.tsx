import { useStore } from '../store/store';
import { BearState } from '../types/store';

export default function Home() {
  const bears = useStore((state: BearState) => state.bears);
  const increase = useStore((state: BearState) => state.increase);

  return (
    <>
      <h1>Home</h1>
      <h2>{bears}</h2>
      <button
        onClick={() => {
          increase(1);
        }}
      >
        Increase Bears!!
      </button>
    </>
  );
}
