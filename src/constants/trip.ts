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

export const COUNTRY_OPTIONS = [
    { emoji: '🇰🇷', name: '대한민국' },
    { emoji: '🇹🇼', name: '대만' },
    { emoji: '🇯🇵', name: '일본' },
    { emoji: '🇺🇸', name: '미국' },
    { emoji: '🇨🇳', name: '중국' },
    { emoji: '🇮🇳', name: '인도' },
    { emoji: '🇬🇧', name: '영국' },
    { emoji: '🇩🇪', name: '독일' },
    { emoji: '🇫🇷', name: '프랑스' },
    { emoji: '🇮🇹', name: '이탈리아' },
    { emoji: '🇧🇷', name: '브라질' },
    { emoji: '🇷🇺', name: '러시아' },
    { emoji: '🇨🇦', name: '캐나다' },
    { emoji: '🇦🇺', name: '호주' },
    { emoji: '🇲🇽', name: '멕시코' },
    { emoji: '🇪🇸', name: '스페인' },
    { emoji: '🇦🇷', name: '아르헨티나' },
    { emoji: '🇿🇦', name: '남아프리카 공화국' },
    { emoji: '🇳🇬', name: '나이지리아' },
    { emoji: '🇸🇦', name: '사우디아라비아' },
    { emoji: '🇹🇷', name: '터키' },
    { emoji: '🇮🇩', name: '인도네시아' },
    { emoji: '🇹🇭', name: '태국' },
    { emoji: '🇻🇳', name: '베트남' },
    { emoji: '🇪🇬', name: '이집트' },
    { emoji: '🇵🇭', name: '필리핀' },
    { emoji: '🇵🇰', name: '파키스탄' },
    { emoji: '🇧🇩', name: '방글라데시' },
    { emoji: '🇵🇱', name: '폴란드' },
    { emoji: '🇳🇱', name: '네덜란드' },
    { emoji: '🇸🇪', name: '스웨덴' },
    { emoji: '🇨🇭', name: '스위스' },
    { emoji: '🇵🇹', name: '포르투갈' },
];

export const TRIP_FROM = {
    DATE: '여행 기간 *',
    COUNTRY: '여행 국가 *',
    COUNTRY_DEFAULT: '여행 국가를 선택해주세요',
    TITLE: '여행 제목 *',
    TITLE_PLACEHOLDER: '여행 제목을 입력해주세요',
    HASHTAG: '해시태그',
};

export const WELCOME_TICKET_DATA = {
    tripId: '',
    tripTitle: '첫 티켓이 발급되었습니다',
    country: '0000TRIP TYCHE',
    startDate: '2024.1.1',
    endDate: '2024.12.31',
    hashtags: ['패밀리', '버킷리스트', '계획무시'],
};
