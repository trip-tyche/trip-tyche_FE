# Result 패턴으로 에러 핸들링 개선하기

## 기존 방식의 문제점

처음에는 일반적인 try-catch로 에러를 처리했지만, 프로젝트가 커지면서 몇 가지 문제가 생겼습니다.

1. 불필요한 곳에서도 try-catch 구문을 사용함
2. 컴포넌트마다 다른 에러 처리 방식으로 일관성 없어짐
3. `catch` 블록에서 `error가` `unknown` 타입이라 처리하기 애매함
4. 계층이 깊어질수록 에러 처리를 깜빡하는 경우가 종종 발생함

```ts
// 기존 try-catch 방식
const fetchTripTicketList = async (tripKey: string) => {
    try {
        const response = await tripAPI.fetchTripTicketList(tripKey);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // 상위로 에러를 또 던져야 할까?
    }
};
```

---

## Result 패턴 도입

Rust, Go 등에서 쓰는 방식을 참고해서 성공/실패를 명시적으로 표현하는 Result 패턴을 도입했습니다.

### 타입 정의

```ts
type Result<T> = { success: true; data: T } | { success: false; error: string };
```

### toResult 유틸함수

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

---

## 실제 사용 예시

- 데이터 캐싱이 필요한 요청의 경우 TanStack Query `useQuery`과 연동해서 사용
- 일반적으로는 비즈니스 로직에서 바로 사용

###

```ts
// TanStack Query 훅과 연동
export const useTripTicketList = () => {
    return useQuery({
        queryKey: ['ticket-list'],
        queryFn: () => toResult(() => tripAPI.fetchTripTicketList()),
        select: (result) => {
            return result.success ? { ...result, data: result.data.trips } : result;
        },
    });
};

// 비즈니스 로직에서 사용
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImages = event.target.files;
    // 이미지 업로드 로직
    const result = await toResult(async () => await mediaAPI.updateTripStatus(tripKey));
    if (!result.success) {
        showToast(result.error);
    }
};
```

## 장점

### 타입 안전성

- 에러 처리를 하지 않으면 TypeScript가 바로 알려줌
- `success` 체크 후, `data` 타입이 정확하게 추론됨

### 일관된 에러 처리

- 모든 API 호출이 동일한 Result 타입으로 반환됨
- 새로 투입된 팀원도 패턴만 알면 바로 적용 가능
- 통일된 에러 메시지와 로딩 상태 제공

### 실수 방지

- 예외 던지기/받기 과정에서 생기는 처리 로직 누락이 없어짐
- 에러 메시지도 서버에서 오는 그대로 쉽게 표시 가능
- 일관된 패턴으로 코드 작성 속도 증가

---

## 데이터 플로우

```
서버 → API 클라이언트 → 도메인 API 모듈 → Result 패턴 변환 → TanStack Query 훅 → UI 컴포넌트
```

---

## 결과

도입 후 **런타임에서 발생하는 예상치 못한 에러가 확실히 줄었습니다.** 특히 API 호출 관련 에러는 거의 사라졌고, 새로운 기능 개발할 때도 에러 처리 고민하는 시간이 많이 단축됐습니다.

또한 TanStack Query랑도 잘 맞아서 **UI 컴포넌트에서 로딩/에러 상태 관리가 훨씬 깔끔해졌습니다.** 이 경험을 통해 개발 생산성을 높힐 수 있는 설계의 중요성을 배울 수 있었습니다.
