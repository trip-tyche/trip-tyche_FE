// NativeWebSocketService.ts
class NativeWebSocketService {
    private socket: WebSocket | null = null;
    private userId: string | null = null;
    private isConnected: boolean = false;
    private messageHandlers: Record<string, (data: any) => void> = {};

    // WebSocket 연결 상태 확인
    get connected(): boolean {
        return this.isConnected;
    }

    // WebSocket 연결 설정
    connect(userId: string, serverUrl: string = 'ws://43.200.110.25:8080/ws'): WebSocket | null {
        this.userId = userId;

        try {
            // WebSocket 인스턴스 생성
            this.socket = new WebSocket(serverUrl);

            // 연결 이벤트 설정
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
            this.socket.onerror = this.handleError.bind(this);

            return this.socket;
        } catch (error) {
            console.error('WebSocket 연결 실패:', error);
            return null;
        }
    }

    // 연결 성공 핸들러
    private handleOpen(event: Event): void {
        this.isConnected = true;
        console.log('WebSocket 연결 성공:', event);

        // 자동 구독 설정
        this.subscribeToTopic(`/topic/share-notifications/${this.userId}`);
    }

    // 메시지 수신 핸들러
    private handleMessage(event: MessageEvent): void {
        try {
            const data = JSON.parse(event.data);
            console.log('WebSocket 메시지 수신:', data);

            // topic 속성이 있다면 해당 토픽에 등록된 핸들러 호출
            if (data.topic && this.messageHandlers[data.topic]) {
                this.messageHandlers[data.topic](data);
            }

            // 토픽이 없는 경우 메시지 타입별 처리
            if (data.type === 'SHARED_REQUEST') {
                console.log('공유 요청 알림 수신');
                // 토스트 표시 등의 처리
            } else if (data.type === 'SHARED_APPROVE') {
                console.log('공유 승인 알림 수신');
                // 토스트 표시 등의 처리
            } else if ('unreadCount' in data) {
                console.log('안 읽은 메시지 개수:', data.unreadCount);
                // 개수 업데이트 처리
            }
        } catch (error) {
            console.error('메시지 처리 오류:', error);
        }
    }

    // 연결 종료 핸들러
    private handleClose(event: CloseEvent): void {
        this.isConnected = false;
        console.log('WebSocket 연결 종료:', event);
    }

    // 오류 핸들러
    private handleError(event: Event): void {
        console.error('WebSocket 오류 발생:', event);
    }

    // 연결 종료
    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // 토픽 구독 (서버 구현에 따라 달라질 수 있음)
    subscribeToTopic(topic: string): void {
        if (!this.isConnected || !this.socket) {
            console.error('WebSocket이 연결되지 않았습니다.');
            return;
        }

        // 구독 메시지 전송 (서버 프로토콜에 맞게 조정 필요)
        const subscribeMessage = {
            action: 'SUBSCRIBE',
            topic,
        };

        this.socket.send(JSON.stringify(subscribeMessage));
        console.log(`${topic} 구독 요청 전송`);
    }

    // 메시지 핸들러 등록
    setMessageHandler(topic: string, handler: (data: any) => void): void {
        this.messageHandlers[topic] = handler;
    }

    // 안 읽은 메시지 개수 요청
    requestNotificationCount(userId: string): void {
        if (!this.isConnected || !this.socket) {
            console.error('WebSocket이 연결되지 않았습니다.');
            return;
        }

        // 알림 개수 요청 메시지 (서버 프로토콜에 맞게 조정 필요)
        const countRequestMessage = {
            action: 'GET_NOTIFICATION_COUNT',
            destination: '/app/notification-count',
            data: {
                recipientId: userId,
            },
        };

        this.socket.send(JSON.stringify(countRequestMessage));
        console.log(`사용자 ${userId}의 안 읽은 메시지 개수 요청 전송`);
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
const nativeWebSocketService = new NativeWebSocketService();
export default nativeWebSocketService;
