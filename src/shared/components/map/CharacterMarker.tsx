import { Marker } from '@react-google-maps/api';

import characterImage from '/character.png';
import planeImage from '/plane-icon.png';
import carImage from '/car-icon.png';

import { Location } from '@/shared/types/map';

interface CharacterMarkerProps {
    position: Location;
    isMapRendered: boolean;
    transportType?: string;
}

const CharacterMarker = ({ position, isMapRendered, transportType = 'walking' }: CharacterMarkerProps) => {
    if (!isMapRendered) {
        return;
    }

    const getMarkerImage = () => {
        switch (transportType) {
            case 'car':
                return {
                    url: carImage,
                    scaledSize: new window.google.maps.Size(55, 50),
                    anchor: new window.google.maps.Point(22, 32),
                };
            case 'plane':
                return {
                    url: planeImage,
                    scaledSize: new window.google.maps.Size(45, 45),
                    anchor: new window.google.maps.Point(28, 28),
                };
            default:
                return {
                    url: characterImage,
                    scaledSize: new window.google.maps.Size(45, 60),
                    anchor: new window.google.maps.Point(28, 50),
                };
        }
    };

    return (
        <Marker position={{ lat: position.latitude, lng: position.longitude }} icon={getMarkerImage()} zIndex={1000} />
    );
};

export default CharacterMarker;

// import React, { useEffect, useState } from 'react';

// import { Marker } from '@react-google-maps/api';

// import { Location } from '@/shared/types/map';

// interface CharacterMarkerProps {
//     position: Location;
//     isMapRendered: boolean;
//     transportType?: string; // 'walking', 'car', 'plane' 중 하나
//     transportIcon?: string;
// }

// const CharacterMarker = ({
//     position,
//     isMapRendered,
//     transportType = 'walking',
//     transportIcon = '🚶',
// }: CharacterMarkerProps) => {
//     const [marker, setMarker] = useState<google.maps.Marker | null>(null);

//     const getMarkerImage = () => {
//         switch (transportType) {
//             case 'car':
//                 return {
//                     url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
//                         `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
//                             <circle cx="20" cy="20" r="18" fill="#4285F4" stroke="#FFF" stroke-width="2"/>
//                             <text x="20" y="25" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#FFF">${transportIcon}</text>
//                         </svg>`,
//                     )}`,
//                     scaledSize: new google.maps.Size(40, 40),
//                     anchor: new google.maps.Point(20, 20),
//                 };
//             case 'plane':
//                 return {
//                     url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
//                         `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
//                             <circle cx="25" cy="25" r="23" fill="#FF5252" stroke="#FFF" stroke-width="2"/>
//                             <text x="25" y="32" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#FFF">${transportIcon}</text>
//                         </svg>`,
//                     )}`,
//                     scaledSize: new google.maps.Size(50, 50),
//                     anchor: new google.maps.Point(25, 25),
//                 };
//             default: // walking
//                 return {
//                     url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
//                         `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
//                             <circle cx="17.5" cy="17.5" r="15.5" fill="#34A853" stroke="#FFF" stroke-width="2"/>
//                             <text x="17.5" y="23" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#FFF">${transportIcon}</text>
//                         </svg>`,
//                     )}`,
//                     scaledSize: new google.maps.Size(35, 35),
//                     anchor: new google.maps.Point(17.5, 17.5),
//                 };
//         }
//     };

//     useEffect(() => {
//         if (isMapRendered && marker) {
//             marker.setPosition({ lat: position.latitude, lng: position.longitude });
//             // 이동 수단이 변경되면 아이콘도 변경
//             marker.setIcon(getMarkerImage());
//         }
//     }, [position, isMapRendered, marker, transportType, transportIcon]);

//     return isMapRendered ? (
//         <Marker
//             position={{ lat: position.latitude, lng: position.longitude }}
//             icon={getMarkerImage()}
//             zIndex={1000}
//             onLoad={setMarker}
//         />
//     ) : null;
// };

// export default CharacterMarker;
