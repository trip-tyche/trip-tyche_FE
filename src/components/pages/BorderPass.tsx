import { css } from '@emotion/react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

import characterImg from '@/assets/images/character.png';

interface Trip {
    tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
interface FormattedTrip extends Omit<Trip, 'startDate' | 'endDate'> {
    startDate: string;
    endDate: string;
}

interface BorderPassProps {
    trip: FormattedTrip;
    userNickname: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const BorderPass: React.FC<BorderPassProps> = ({ trip, userNickname, onEdit, onDelete }) => (
    <div css={borderPassContainer}>
        <div css={borderPassContent}>
            <div css={borderPassLeft}>
                <div css={countryName}>{trip.country}</div>
                <img src={characterImg} alt='character' css={characterImage} />
                <div css={borderPassText}>BORDER PASS</div>
            </div>
            <div css={borderPassRight}>
                <h3 css={tripTitle}>{trip.tripTitle}</h3>
                <div css={tripInfo}>
                    <p>
                        <strong>PASSENGER:</strong> {userNickname}
                    </p>
                    <p>
                        <strong>FROM:</strong> 인천
                    </p>
                    <p>
                        <strong>TO:</strong> {trip.country.substring(4)}
                    </p>
                    <p>
                        <strong>DATE:</strong> {trip.startDate} ~ {trip.endDate}
                    </p>
                </div>
                <div css={hashtagContainer}>
                    {trip.hashtags.map((tag, index) => (
                        <span key={index} css={hashtag}>
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        <div css={buttonContainer}>
            <button css={editButton} onClick={onEdit}>
                <FaPencilAlt /> Edit
            </button>
            <button css={deleteButton} onClick={onDelete}>
                <FaTrashAlt /> Delete
            </button>
        </div>
    </div>
);

const borderPassContainer = css`
    width: 100%;
    max-width: 430px;
    background: #e8d9b5;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    margin: 10px auto;
    position: relative;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" fill="%23c4a671" opacity="0.1"/></svg>');
        background-size: 50px 50px;
        opacity: 0.5;
    }
`;

const borderPassContent = css`
    display: flex;
    flex-direction: column;
`;

const borderPassLeft = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #453525;
    position: relative;
    overflow: hidden;

    &:before {
        content: 'LV';
        position: absolute;
        font-size: 80px;
        color: rgba(255, 255, 255, 0.05);
        bottom: -20px;
        right: -10px;
        font-weight: bold;
        font-family: 'Futura', sans-serif;
    }
`;

const borderPassRight = css`
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
`;

const countryName = css`
    font-size: 20px;
    font-weight: bold;
    color: #c4a671;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    font-family: 'Futura', sans-serif;
    letter-spacing: 1px;
`;

const characterImage = css`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #c4a671;
    box-shadow: 0 0 10px rgba(196, 166, 113, 0.5);
`;

const borderPassText = css`
    font-size: 12px;
    font-weight: bold;
    color: #c4a671;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Futura', sans-serif;
`;

const tripTitle = css`
    font-size: 18px;
    color: #453525;
    margin-bottom: 10px;
    font-family: 'Futura', sans-serif;
    letter-spacing: 1px;
`;

const tripInfo = css`
    font-size: 14px;
    color: #453525;

    p {
        margin: 5px 0;
    }

    strong {
        font-weight: bold;
        color: #996515;
    }
`;

const hashtagContainer = css`
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
`;

const hashtag = css`
    background-color: #453525;
    color: #c4a671;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    margin-right: 5px;
    margin-bottom: 5px;
    font-family: 'Futura', sans-serif;
    letter-spacing: 0.5px;
`;

const buttonContainer = css`
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    background-color: rgba(69, 53, 37, 0.1);

    button {
        &:hover {
            cursor: pointer;
        }
    }
`;

const buttonBase = css`
    padding: 6px 10px;
    border: none;
    border-radius: 15px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'Futura', sans-serif;

    &:hover {
        transform: translateY(-2px);
    }
`;

const editButton = css`
    ${buttonBase}
    background-color: #c4a671;
    color: #453525;
    margin-right: 10px;

    &:hover {
        background-color: #b3955f;
    }
`;

const deleteButton = css`
    ${buttonBase}
    background-color: #453525;
    color: #c4a671;

    &:hover {
        background-color: #5a4632;
    }
`;

export default BorderPass;
