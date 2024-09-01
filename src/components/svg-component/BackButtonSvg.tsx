interface BackButtonSvgProps {
    width?: number;
    height?: number;
    color?: string;
}

const BackButtonSvg = ({ width = 24, height = 24, color = '#333' }: BackButtonSvgProps): JSX.Element => (
    <>
        <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' fill='currentColor'>
            <g clipPath='url(#clip0_4_3262)'>
                <path
                    d='M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z'
                    fill={color}
                ></path>
            </g>
        </svg>
    </>
);

export default BackButtonSvg;
