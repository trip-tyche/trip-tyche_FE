// piexifjs에서 반환하는 EXIF 데이터 구조
// 각 IFD(Image File Directory)는 태그 번호를 키로 사용
type IfdData = Record<number, string | number | number[][] | [number, number][]>;

export interface Exif {
    '0th'?: IfdData;
    Exif?: IfdData;
    GPS?: IfdData;
    '1st'?: IfdData;
    Interop?: IfdData;
    thumbnail?: string | null;
}
