// 'country-list'의 타입을 TypeScript가 인식할 수 있게 해줌
declare module 'country-list' {
    export function getCode(countryName: string): string | undefined;
    export function getName(countryCode: string): string | undefined;
    export function getNames(): string[];
    export function getData(): { name: string; code: string }[];
}
