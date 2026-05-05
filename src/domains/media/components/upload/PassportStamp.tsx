interface PassportStampProps {
    size?: number;
    color?: string;
    city?: string;
    brand?: string;
    date?: string;
}

const PassportStamp = ({
    size = 90,
    color = '#dc2626',
    city = 'ENTRY',
    brand = 'TRIPTYCHE',
    date = '',
}: PassportStampProps) => {
    const R = size * 0.44;
    const fontFamily = "'Outfit', -apple-system, sans-serif";

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ mixBlendMode: 'multiply', opacity: 0.92 }}
        >
            <circle cx={size / 2} cy={size / 2} r={R} fill='none' stroke={color} strokeWidth={size * 0.038} />
            <circle cx={size / 2} cy={size / 2} r={R * 0.72} fill='none' stroke={color} strokeWidth={size * 0.016} />
            <text
                x={size / 2}
                y={size / 2 - size * 0.07}
                textAnchor='middle'
                fontSize={size * 0.18}
                fontWeight={900}
                fill={color}
                fontFamily={fontFamily}
                letterSpacing={0.5}
            >
                {city}
            </text>
            <text
                x={size / 2}
                y={size / 2 + size * 0.05}
                textAnchor='middle'
                fontSize={size * 0.075}
                fontWeight={700}
                fill={color}
                fontFamily={fontFamily}
                letterSpacing={1.4}
            >
                {brand}
            </text>
            {date && (
                <text
                    x={size / 2}
                    y={size / 2 + size * 0.18}
                    textAnchor='middle'
                    fontSize={size * 0.08}
                    fontWeight={600}
                    fill={color}
                    fontFamily={fontFamily}
                    letterSpacing={0.5}
                >
                    {date}
                </text>
            )}
        </svg>
    );
};

export default PassportStamp;
