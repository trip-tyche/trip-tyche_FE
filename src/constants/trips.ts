import { Country } from '@/domain/trip/types';

export const TICKET = {
    DEFAULT_COUNTY: '대한민국',
};

export const TRIP_FORM = {
    DATE: '여행 기간 *',
    COUNTRY: '여행 국가 *',
    COUNTRY_DEFAULT: '여행 국가를 선택해주세요',
    TITLE: '여행 제목 *',
    TITLE_PLACEHOLDER: '여행 제목을 입력해주세요',
    HASHTAG: '해시태그 *',
};

export const WELCOME_TICKET_DATA = {
    tripKey: '',
    tripTitle: '첫 티켓이 발급되었습니다',
    country: '👋/트립티케/TRIP TYCHE',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    hashtags: ['나홀로', '버킷리스트', '계획무시'],
    imagesDate: [],
    ownerNickname: '',
};

export const HASHTAG_MENU = [
    '솔로여행', // 혼자 여행하는 트렌드 반영
    '우리끼리', // 친구들과의 여행
    '커플여행', // 연인과의 여행
    '패밀리', // 가족여행
    '힐링스팟', // 휴식과 치유
    '로컬픽', // 현지 맛집, 장소
    '일상탈출', // 일상에서 벗어남
    '버킷리스트', // 도전, 꿈의 여행
    '감성충전', // 감성적인 순간
    '인생샷', // 사진, 추억
    '계획무시', // 즉흥적인 여행
    '취향저격', // 자신의 취향에 맞는
    '모험가', // 새로운 도전
    '여행메이트', // 여행 동반자와 함께
    '가성비템', // 실용적인 여행
] as const;

export const COUNTRIES: Country[] = [
    {
        emoji: '🇬🇭',
        nameKo: '가나',
        nameEn: 'GHANA',
        value: '🇬🇭/가나/GHANA',
    },
    {
        emoji: '🇬🇷',
        nameKo: '그리스',
        nameEn: 'GREECE',
        value: '🇬🇷/그리스/GREECE',
    },
    {
        emoji: '🇿🇦',
        nameKo: '남아프리카 공화국',
        nameEn: 'SOUTH AFRICA',
        value: '🇿🇦/남아프리카 공화국/SOUTH AFRICA',
    },
    {
        emoji: '🇳🇱',
        nameKo: '네덜란드',
        nameEn: 'NETHERLANDS',
        value: '🇳🇱/네덜란드/NETHERLANDS',
    },
    {
        emoji: '🇳🇴',
        nameKo: '노르웨이',
        nameEn: 'NORWAY',
        value: '🇳🇴/노르웨이/NORWAY',
    },
    {
        emoji: '🇳🇿',
        nameKo: '뉴질랜드',
        nameEn: 'NEW ZEALAND',
        value: '🇳🇿/뉴질랜드/NEW ZEALAND',
    },
    {
        emoji: '🇹🇼',
        nameKo: '대만',
        nameEn: 'TAIWAN',
        value: '🇹🇼/대만/TAIWAN',
    },
    {
        emoji: '🇰🇷',
        nameKo: '대한민국',
        nameEn: 'SOUTH KOREA',
        value: '🇰🇷/대한민국/SOUTH KOREA',
    },
    {
        emoji: '🇩🇰',
        nameKo: '덴마크',
        nameEn: 'DENMARK',
        value: '🇩🇰/덴마크/DENMARK',
    },
    {
        emoji: '🇩🇴',
        nameKo: '도미니카 공화국',
        nameEn: 'DOMINICAN REPUBLIC',
        value: '🇩🇴/도미니카 공화국/DOMINICAN REPUBLIC',
    },
    {
        emoji: '🇩🇪',
        nameKo: '독일',
        nameEn: 'GERMANY',
        value: '🇩🇪/독일/GERMANY',
    },
    {
        emoji: '🇱🇦',
        nameKo: '라오스',
        nameEn: 'LAOS',
        value: '🇱🇦/라오스/LAOS',
    },
    {
        emoji: '🇷🇴',
        nameKo: '루마니아',
        nameEn: 'ROMANIA',
        value: '🇷🇴/루마니아/ROMANIA',
    },
    {
        emoji: '🇱🇺',
        nameKo: '룩셈부르크',
        nameEn: 'LUXEMBOURG',
        value: '🇱🇺/룩셈부르크/LUXEMBOURG',
    },
    {
        emoji: '🇲🇴',
        nameKo: '마카오',
        nameEn: 'MACAU',
        value: '🇲🇴/마카오/MACAU',
    },
    {
        emoji: '🇲🇾',
        nameKo: '말레이시아',
        nameEn: 'MALAYSIA',
        value: '🇲🇾/말레이시아/MALAYSIA',
    },
    {
        emoji: '🇲🇽',
        nameKo: '멕시코',
        nameEn: 'MEXICO',
        value: '🇲🇽/멕시코/MEXICO',
    },
    {
        emoji: '🇲🇨',
        nameKo: '모나코',
        nameEn: 'MONACO',
        value: '🇲🇨/모나코/MONACO',
    },
    {
        emoji: '🇲🇦',
        nameKo: '모로코',
        nameEn: 'MOROCCO',
        value: '🇲🇦/모로코/MOROCCO',
    },
    {
        emoji: '🇲🇻',
        nameKo: '몰디브',
        nameEn: 'MALDIVES',
        value: '🇲🇻/몰디브/MALDIVES',
    },
    {
        emoji: '🇺🇸',
        nameKo: '미국',
        nameEn: 'UNITED STATES',
        value: '🇺🇸/미국/UNITED STATES',
    },
    {
        emoji: '🇧🇭',
        nameKo: '바레인',
        nameEn: 'BAHRAIN',
        value: '🇧🇭/바레인/BAHRAIN',
    },
    {
        emoji: '🇧🇩',
        nameKo: '방글라데시',
        nameEn: 'BANGLADESH',
        value: '🇧🇩/방글라데시/BANGLADESH',
    },
    {
        emoji: '🇻🇳',
        nameKo: '베트남',
        nameEn: 'VIETNAM',
        value: '🇻🇳/베트남/VIETNAM',
    },
    {
        emoji: '🇧🇪',
        nameKo: '벨기에',
        nameEn: 'BELGIUM',
        value: '🇧🇪/벨기에/BELGIUM',
    },
    {
        emoji: '🇧🇦',
        nameKo: '보스니아 헤르체고비나',
        nameEn: 'BOSNIA AND HERZEGOVINA',
        value: '🇧🇦/보스니아 헤르체고비나/BOSNIA AND HERZEGOVINA',
    },
    {
        emoji: '🇧🇷',
        nameKo: '브라질',
        nameEn: 'BRAZIL',
        value: '🇧🇷/브라질/BRAZIL',
    },
    {
        emoji: '🇧🇳',
        nameKo: '브루나이',
        nameEn: 'BRUNEI',
        value: '🇧🇳/브루나이/BRUNEI',
    },
    {
        emoji: '🇸🇦',
        nameKo: '사우디아라비아',
        nameEn: 'SAUDI ARABIA',
        value: '🇸🇦/사우디아라비아/SAUDI ARABIA',
    },
    {
        emoji: '🇸🇲',
        nameKo: '산마리노',
        nameEn: 'SAN MARINO',
        value: '🇸🇲/산마리노/SAN MARINO',
    },
    {
        emoji: '🇷🇸',
        nameKo: '세르비아',
        nameEn: 'SERBIA',
        value: '🇷🇸/세르비아/SERBIA',
    },
    {
        emoji: '🇸🇨',
        nameKo: '세이셸',
        nameEn: 'SEYCHELLES',
        value: '🇸🇨/세이셸/SEYCHELLES',
    },
    {
        emoji: '🇱🇰',
        nameKo: '스리랑카',
        nameEn: 'SRI LANKA',
        value: '🇱🇰/스리랑카/SRI LANKA',
    },
    {
        emoji: '🇸🇪',
        nameKo: '스웨덴',
        nameEn: 'SWEDEN',
        value: '🇸🇪/스웨덴/SWEDEN',
    },
    {
        emoji: '🇨🇭',
        nameKo: '스위스',
        nameEn: 'SWITZERLAND',
        value: '🇨🇭/스위스/SWITZERLAND',
    },
    {
        emoji: '🇪🇸',
        nameKo: '스페인',
        nameEn: 'SPAIN',
        value: '🇪🇸/스페인/SPAIN',
    },
    {
        emoji: '🇸🇬',
        nameKo: '싱가포르',
        nameEn: 'SINGAPORE',
        value: '🇸🇬/싱가포르/SINGAPORE',
    },
    {
        emoji: '🇦🇪',
        nameKo: '아랍에미리트',
        nameEn: 'UNITED ARAB EMIRATES',
        value: '🇦🇪/아랍에미리트/UNITED ARAB EMIRATES',
    },
    {
        emoji: '🇦🇷',
        nameKo: '아르헨티나',
        nameEn: 'ARGENTINA',
        value: '🇦🇷/아르헨티나/ARGENTINA',
    },
    {
        emoji: '🇮🇸',
        nameKo: '아이슬란드',
        nameEn: 'ICELAND',
        value: '🇮🇸/아이슬란드/ICELAND',
    },
    {
        emoji: '🇮🇪',
        nameKo: '아일랜드',
        nameEn: 'IRELAND',
        value: '🇮🇪/아일랜드/IRELAND',
    },
    {
        emoji: '🇩🇿',
        nameKo: '알제리',
        nameEn: 'ALGERIA',
        value: '🇩🇿/알제리/ALGERIA',
    },
    {
        emoji: '🇪🇪',
        nameKo: '에스토니아',
        nameEn: 'ESTONIA',
        value: '🇪🇪/에스토니아/ESTONIA',
    },
    {
        emoji: '🇪🇨',
        nameKo: '에콰도르',
        nameEn: 'ECUADOR',
        value: '🇪🇨/에콰도르/ECUADOR',
    },
    {
        emoji: '🇬🇧',
        nameKo: '영국',
        nameEn: 'UNITED KINGDOM',
        value: '🇬🇧/영국/UNITED KINGDOM',
    },
    {
        emoji: '🇴🇲',
        nameKo: '오만',
        nameEn: 'OMAN',
        value: '🇴🇲/오만/OMAN',
    },
    {
        emoji: '🇦🇺',
        nameKo: '오스트레일리아',
        nameEn: 'AUSTRALIA',
        value: '🇦🇺/오스트레일리아/AUSTRALIA',
    },
    {
        emoji: '🇦🇹',
        nameKo: '오스트리아',
        nameEn: 'AUSTRIA',
        value: '🇦🇹/오스트리아/AUSTRIA',
    },
    {
        emoji: '🇺🇾',
        nameKo: '우루과이',
        nameEn: 'URUGUAY',
        value: '🇺🇾/우루과이/URUGUAY',
    },
    {
        emoji: '🇺🇦',
        nameKo: '우크라이나',
        nameEn: 'UKRAINE',
        value: '🇺🇦/우크라이나/UKRAINE',
    },
    {
        emoji: '🇮🇶',
        nameKo: '이라크',
        nameEn: 'IRAQ',
        value: '🇮🇶/이라크/IRAQ',
    },
    {
        emoji: '🇮🇱',
        nameKo: '이스라엘',
        nameEn: 'ISRAEL',
        value: '🇮🇱/이스라엘/ISRAEL',
    },
    {
        emoji: '🇪🇬',
        nameKo: '이집트',
        nameEn: 'EGYPT',
        value: '🇪🇬/이집트/EGYPT',
    },
    {
        emoji: '🇮🇹',
        nameKo: '이탈리아',
        nameEn: 'ITALY',
        value: '🇮🇹/이탈리아/ITALY',
    },
    {
        emoji: '🇮🇳',
        nameKo: '인도',
        nameEn: 'INDIA',
        value: '🇮🇳/인도/INDIA',
    },
    {
        emoji: '🇮🇩',
        nameKo: '인도네시아',
        nameEn: 'INDONESIA',
        value: '🇮🇩/인도네시아/INDONESIA',
    },
    {
        emoji: '🇯🇵',
        nameKo: '일본',
        nameEn: 'JAPAN',
        value: '🇯🇵/일본/JAPAN',
    },
    {
        emoji: '🇯🇲',
        nameKo: '자메이카',
        nameEn: 'JAMAICA',
        value: '🇯🇲/자메이카/JAMAICA',
    },
    {
        emoji: '🇬🇪',
        nameKo: '조지아',
        nameEn: 'GEORGIA',
        value: '🇬🇪/조지아/GEORGIA',
    },
    {
        emoji: '🇨🇿',
        nameKo: '체코',
        nameEn: 'CZECH REPUBLIC',
        value: '🇨🇿/체코/CZECH REPUBLIC',
    },
    {
        emoji: '🇨🇱',
        nameKo: '칠레',
        nameEn: 'CHILE',
        value: '🇨🇱/칠레/CHILE',
    },
    {
        emoji: '🇨🇲',
        nameKo: '카메룬',
        nameEn: 'CAMEROON',
        value: '🇨🇲/카메룬/CAMEROON',
    },
    {
        emoji: '🇰🇿',
        nameKo: '카자흐스탄',
        nameEn: 'KAZAKHSTAN',
        value: '🇰🇿/카자흐스탄/KAZAKHSTAN',
    },
    {
        emoji: '🇶🇦',
        nameKo: '카타르',
        nameEn: 'QATAR',
        value: '🇶🇦/카타르/QATAR',
    },
    {
        emoji: '🇰🇭',
        nameKo: '캄보디아',
        nameEn: 'CAMBODIA',
        value: '🇰🇭/캄보디아/CAMBODIA',
    },
    {
        emoji: '🇨🇦',
        nameKo: '캐나다',
        nameEn: 'CANADA',
        value: '🇨🇦/캐나다/CANADA',
    },
    {
        emoji: '🇰🇪',
        nameKo: '케냐',
        nameEn: 'KENYA',
        value: '🇰🇪/케냐/KENYA',
    },
    {
        emoji: '🇨🇷',
        nameKo: '코스타리카',
        nameEn: 'COSTA RICA',
        value: '🇨🇷/코스타리카/COSTA RICA',
    },
    {
        emoji: '🇨🇴',
        nameKo: '콜롬비아',
        nameEn: 'COLOMBIA',
        value: '🇨🇴/콜롬비아/COLOMBIA',
    },
    {
        emoji: '🇰🇼',
        nameKo: '쿠웨이트',
        nameEn: 'KUWAIT',
        value: '🇰🇼/쿠웨이트/KUWAIT',
    },
    {
        emoji: '🇭🇷',
        nameKo: '크로아티아',
        nameEn: 'CROATIA',
        value: '🇭🇷/크로아티아/CROATIA',
    },
    {
        emoji: '🇹🇭',
        nameKo: '태국',
        nameEn: 'THAILAND',
        value: '🇹🇭/태국/THAILAND',
    },
    {
        emoji: '🇹🇷',
        nameKo: '터키',
        nameEn: 'TURKEY',
        value: '🇹🇷/터키/TURKEY',
    },
    {
        emoji: '🇵🇦',
        nameKo: '파나마',
        nameEn: 'PANAMA',
        value: '🇵🇦/파나마/PANAMA',
    },
    {
        emoji: '🇵🇾',
        nameKo: '파라과이',
        nameEn: 'PARAGUAY',
        value: '🇵🇾/파라과이/PARAGUAY',
    },
    {
        emoji: '🇵🇰',
        nameKo: '파키스탄',
        nameEn: 'PAKISTAN',
        value: '🇵🇰/파키스탄/PAKISTAN',
    },
    {
        emoji: '🇵🇪',
        nameKo: '페루',
        nameEn: 'PERU',
        value: '🇵🇪/페루/PERU',
    },
    {
        emoji: '🇵🇹',
        nameKo: '포르투갈',
        nameEn: 'PORTUGAL',
        value: '🇵🇹/포르투갈/PORTUGAL',
    },
    {
        emoji: '🇵🇱',
        nameKo: '폴란드',
        nameEn: 'POLAND',
        value: '🇵🇱/폴란드/POLAND',
    },
    {
        emoji: '🇫🇷',
        nameKo: '프랑스',
        nameEn: 'FRANCE',
        value: '🇫🇷/프랑스/FRANCE',
    },
    {
        emoji: '🇫🇮',
        nameKo: '핀란드',
        nameEn: 'FINLAND',
        value: '🇫🇮/핀란드/FINLAND',
    },
    {
        emoji: '🇵🇭',
        nameKo: '필리핀',
        nameEn: 'PHILIPPINES',
        value: '🇵🇭/필리핀/PHILIPPINES',
    },
    {
        emoji: '🇭🇺',
        nameKo: '헝가리',
        nameEn: 'HUNGARY',
        value: '🇭🇺/헝가리/HUNGARY',
    },
    {
        emoji: '🇭🇰',
        nameKo: '홍콩',
        nameEn: 'HONG KONG',
        value: '🇭🇰/홍콩/HONG KONG',
    },
];
