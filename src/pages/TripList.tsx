import { Link } from 'react-router-dom';
import '/src/styles/TripList.css';

export default function TripList() {
  return (
    <>
      <div className="list-title">여행 관리</div>
      <div className="list-trip-create-btn">
        <Link to={'/trip-create'}>여행 등록</Link>
      </div>
      <div className="list-trip-list">
        <img src="/public/border-pass.png" />
        <img src="/public/border-pass.png" />
        <img src="/public/border-pass.png" />
        <img src="/public/border-pass.png" />
        <img src="/public/border-pass.png" />
        <img src="/public/border-pass.png" />
      </div>
    </>
  );
}
