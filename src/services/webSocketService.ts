import { Client, IFrame, IMessage, StompSubscription } from '@stomp/stompjs';

import { useToastStore } from '@/stores/useToastStore';

interface NotificationMessage {
    recipientId: number | string;
    type?: 'SHARED_REQUEST' | 'SHARED_APPROVE' | 'SHARED_REJECTED';
    unreadCount?: number;
}

type MessageCallback = (data: NotificationMessage) => void;

// 싱글톤 방식으로 사용할 상태 객체
const state = {
    client: null as Client | null,
    userId: null as string | null,
    isConnected: false,
    subscriptions: {} as Record<string, StompSubscription>,
    onMessageCallbacks: {} as Record<string, MessageCallback>,
    unreadCountCallback: null as ((count: number) => void) | null,
};

// WebSocket 연결 상태 확인
// const isConnected = () => state.isConnected;

// WebSocket 연결 설정
const connect = (userId: string, serverUrl: string = 'http://43.200.110.25:80/ws'): Client | null => {
    if (state.isConnected && state.userId === userId) {
        console.log('이미 연결된 상태입니다.');
        return state.client;
    }

    state.userId = userId;

    // STOMP 클라이언트 설정
    state.client = new Client({
        brokerURL: serverUrl,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    // 연결 성공 시 콜백
    state.client.onConnect = () => {
        state.isConnected = true;
        console.log('WebSocket 연결 성공');

        // 사용자 ID에 대한 공유 알림 구독
        subscribeToShareNotifications(userId);
    };

    // 에러 발생 시 콜백
    state.client.onStompError = (frame: IFrame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        console.error('추가 정보:', frame.body);
    };

    // 연결 종료 시 콜백
    state.client.onWebSocketClose = () => {
        state.isConnected = false;
        console.log('WebSocket 연결 종료');
    };

    // 연결 시작
    state.client.activate();

    return state.client;
};

// 연결 종료
const disconnect = (): void => {
    if (state.client && state.isConnected) {
        // 모든 구독 해제
        unsubscribeAll();

        // 연결 종료
        state.client.deactivate();
        state.isConnected = false;
        console.log('WebSocket 연결 종료됨');
    }
};

// 공유 알림 구독
const subscribeToShareNotifications = (userId: string): StompSubscription | null => {
    if (!state.isConnected || !state.client) {
        console.error('WebSocket이 연결되지 않았습니다.');
        return null;
    }

    const topic = `/topic/share-notifications/${userId}`;

    // 구독 상태 출력
    // console.log('구독 상태:', {
    //     topic,
    //     isSubscribed: !!state.subscriptions[topic],
    //     allSubscriptions: Object.keys(state.subscriptions),
    // });

    // 이미 구독한 경우 기존 구독 반환
    if (state.subscriptions[topic]) {
        // console.log(`${topic}에 이미 구독되어 있습니다.`);
        return state.subscriptions[topic];
    }

    // 구독 설정
    const subscription = state.client.subscribe(topic, (message: IMessage) => {
        try {
            // console.log('메시지 도착! 원본 데이터:', message); // 원본 메시지 전체 출력
            const data = JSON.parse(message.body);
            // console.log('메시지 수신:', data);

            // const messageType = JSON.parse(data).type;
            if (data.unreadCount !== undefined && state.unreadCountCallback) {
                state.unreadCountCallback(data.unreadCount);
            }

            if (!data.type) return;
            const messageType = data.type;

            if (messageType === 'SHARED_REQUEST') {
                useToastStore.getState().showToast('새로운 공유 요청이 도착했습니다.');
                // 새 알림이 왔으므로 개수 업데이트 요청
                if (state.userId) requestNotificationCount(state.userId);
            } else if (messageType === 'SHARED_APPROVE') {
                useToastStore.getState().showToast('공유 요청이 승인되었습니다.');
            } else if (messageType === 'SHARED_REJECTED') {
                useToastStore.getState().showToast('공유 요청이 거절되었습니다.');
            }

            // 콜백 호출
            if (state.onMessageCallbacks[topic]) {
                state.onMessageCallbacks[topic](data);
            }
        } catch (error) {
            console.error('메시지 처리 오류:', error);
        }
    });

    // 구독 정보 저장
    state.subscriptions[topic] = subscription;
    // console.log(`${topic}에 구독 완료`);

    return subscription;
};

// 구독 해제
const unsubscribe = (topic: string): void => {
    if (state.subscriptions[topic]) {
        state.subscriptions[topic].unsubscribe();
        delete state.subscriptions[topic];
        // console.log(`${topic} 구독 해제됨`);
    }
};

// 모든 구독 해제
const unsubscribeAll = (): void => {
    Object.keys(state.subscriptions).forEach((topic) => {
        unsubscribe(topic);
    });
};

// 안 읽은 메시지 개수 요청
const requestNotificationCount = (userId: string): void => {
    if (!state.client || !state.isConnected) return;

    const payload = {
        recipientId: userId,
    };

    state.client.publish({
        destination: '/app/notification-count',
        body: JSON.stringify(payload),
    });
};

// 메시지 수신 콜백 설정
const setOnMessageCallback = (topic: string, callback: MessageCallback): void => {
    state.onMessageCallbacks[topic] = callback;
};

// 안 읽은 메시지 개수 콜백 설정
const setUnreadCountCallback = (callback: (count: number) => void): void => {
    state.unreadCountCallback = callback;
};

// 싱글톤 인스턴스로 내보내기
const webSocketService = {
    get connected() {
        return state.isConnected;
    },
    connect,
    disconnect,
    subscribeToShareNotifications,
    unsubscribe,
    unsubscribeAll,
    requestNotificationCount,
    setOnMessageCallback,
    setUnreadCountCallback,
};

export default webSocketService;
