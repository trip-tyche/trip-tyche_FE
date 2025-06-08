# 레이어 기반 프론트엔드 아키텍처 설계

## 기존 방식의 문제점

프로젝트 초기에는 일반적인 방식으로 API 호출과 상태 관리를 했지만, 기능이 추가될수록 몇 가지 문제가 생겼습니다.

1. **컴포넌트에 비즈니스 로직이 뒤섞임** - UI 렌더링과 데이터 처리가 한 곳에 몰려있음
2. **에러 처리 방식이 컴포넌트마다 제각각** - 일관성 없는 사용자 경험
3. **API 엔드포인트가 여기저기 흩어져 있음** - 수정할 때 찾기 어려움
4. **같은 API 호출 로직을 여러 곳에서 중복 작성** - 유지보수성 저하

```tsx
// 기존 방식 - 컴포넌트에 모든 게 뒤섞여 있음
const TripList = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/v1/trips'); // API 호출이 컴포넌트에
                setTrips(response.data.trips);
            } catch (err) {
                setError('여행 목록을 불러오는데 실패했습니다'); // 에러 처리도 컴포넌트에
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;
    return <div>{/* UI 렌더링 */}</div>;
};
```

---

## 레이어 기반 아키텍처 도입

관심사 분리와 단일 책임 원칙을 적용해서 5개 레이어로 구조를 나눴습니다.

```text
UI 컴포넌트 ← React Query 훅 ← Result 변환 ← 도메인 API ← HTTP 클라이언트
```

### 1. API 클라이언트 레이어

기본 HTTP 요청 처리만 담당. 인터셉터, 토큰 관리 등 공통 로직 처리.

### 2. 도메인별 API 모듈

비즈니스 도메인별로 API 엔드포인트를 그룹화. 여행 관련은 `tripAPI`, 미디어 관련은 `mediaAPI` 등

```ts
export const tripAPI = {
    // 사용자의 전체 여행 티켓 목록 조회
    fetchTripTicketList: async (): Promise<ApiResponse<{ trips: Trip[] }>> => await apiClient.get(`/v1/trips`),

    // 특정 여행의 티켓 상세 정보 조회
    fetchTripTicketInfo: async (tripKey: string): Promise<ApiResponse<Trip>> =>
        await apiClient.get(`/v1/trips/${tripKey}`),

    // 여행 티켓 최종 등록
    finalizeTripTicket: async (tripKey: string): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/trips/${tripKey}/finalize`),
};
```

### 3. Result 패턴 변환 레이어

API 응답을 일관된 `Result<T>` 타입으로 변환. 성공/실패를 명시적으로 처리

```ts
export const toResult = async <T>(
    fn: () => Promise<ApiResponse<T>>,
    callback?: {
        onSuccess?: () => void;
        onError?: () => void;
        onFinally?: () => void;
    },
): Promise<Result<T>> => {
    const { onSuccess, onError, onFinally } = callback || {};

    try {
        const { data } = await fn();
        onSuccess?.();
        return { success: true, data };
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorResponse = error?.response?.data;
            onError?.();
            return { success: false, error: errorResponse.message };
        }
        return { success: false, error: MESSAGE.ERROR.UNKNOWN };
    } finally {
        onFinally?.();
    }
};
```

### 4. React Query 훅 레이어

데이터 페칭, 캐싱, 재시도, 백그라운드 갱신을 담당. 컴포넌트는 이 훅만 사용.

```ts
export const useTripTicketList = () => {
    return useQuery({
        queryKey: ['ticket-list'],
        queryFn: () => toResult(() => tripAPI.fetchTripTicketList()),
        select: (result) => {
            return result.success ? { ...result, data: result.data.trips } : result;
        },
    });
};
```

### 5. UI 컴포넌트 레이어

순수하게 데이터 표시와 사용자 인터랙션만 처리. 비즈니스 로직은 전혀 모름.

```ts
const TripList = () => {
    const showToast = useToastStore((state) => state.showToast);
    const { data: result, isLoading } = useTripTicketList();

    // 로딩 중 처리
    if (!result) return <LoadingSpinner />;

    // 에러 처리
    if (!result?.success) {
        showToast(result ? result?.error : MESSAGE.ERROR.UNKNOWN);
        return <ErrorFallback />;
    }

    // 데이터 사용
    const tripList = [...result.data].reverse();
    return <TripListUI trips={tripList} />;
};
```

---

## 각 레이어의 책임

```markdown
| 레이어          | 책임                    | 알고 있는 것                | 모르는 것                     |
| --------------- | ----------------------- | --------------------------- | ----------------------------- |
| UI 컴포넌트     | 렌더링, 사용자 인터랙션 | React, 상태                 | API 엔드포인트, 비즈니스 로직 |
| React Query 훅  | 데이터 페칭, 캐싱       | TanStack Query, Result 타입 | HTTP 통신, 서버 구조          |
| Result 변환     | 에러 처리, 타입 변환    | Result 패턴, 에러 타입      | 비즈니스 로직                 |
| 도메인 API      | 엔드포인트 정의         | REST API, 도메인 지식       | UI 상태, 캐싱                 |
| HTTP 클라이언트 | 네트워크 통신           | HTTP, 인증                  | 비즈니스 도메인               |
```

---

## 장점

### 관심사 분리

- 각 레이어가 하나의 책임만 가짐
- 수정할 때 해당 레이어만 건드리면 됨
- 테스트하기 쉬운 구조

### 재사용성

- 같은 API를 여러 컴포넌트에서 쉽게 사용
- 비즈니스 로직 변경 시 한 곳만 수정
- 새로운 기능 추가할 때 기존 레이어 활용

### 팀 협업

- 레이어별로 작업 분담 가능
- 신규 투입 개발자도 레이어 구조만 이해하면 바로 개발 가능
- 코드 리뷰할 때 해당 레이어의 책임에만 집중

### 유지보수성

- 버그 발생 시 어느 레이어에서 문제인지 빠르게 파악
- API 스펙 변경 시 도메인 API 레이어만 수정
- UI 변경 시 컴포넌트 레이어만 수정

---

## 데이터 플로우

```text
서버 API
    ↓
HTTP 클라이언트 (axios, 인터셉터)
    ↓
도메인 API 모듈 (tripAPI.fetchTripTicketList)
    ↓
Result 변환 레이어 (toResult)
    ↓
React Query 훅 (useTripTicketList)
    ↓
UI 컴포넌트 (TripList)
```

## 결과와 학습

레이어 구조 도입 후 코드의 예측 가능성이 크게 향상됐습니다. 어떤 기능을 수정해야 할 때 어느 파일을 봐야 하는지 바로 알 수 있게 됐고, 새로운 API를 추가할 때도 패턴이 정해져 있어서 개발 속도가 빨라졌습니다.
특히 팀원들과의 협업에서 큰 효과를 봤는데, 각자 담당 레이어에서 작업하다 보니 코드 충돌도 줄고, 코드 리뷰할 때도 해당 레이어의 책임에만 집중할 수 있어서 리뷰 품질이 올라갔습니다.
이 경험을 통해 단순히 기능을 구현하는 것을 넘어, 확장 가능하고 유지보수하기 쉬운 구조를 설계하는 것의 중요성을 배울 수 있었습니다.
