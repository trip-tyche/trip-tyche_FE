// EXIF 데이터의 타입 정의
export interface ExifData {
    '0th'?: { [key: number]: any };
    GPS?: { [key: number]: any };
    [key: string]: any;
}
