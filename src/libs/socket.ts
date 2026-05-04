import { Client } from '@stomp/stompjs';

import { useShareModalStore } from '@/domains/share/stores/useShareModalStore';
import { SOCKET_URL } from '@/shared/constants/socket';
import { queryClient } from '@/shared/providers/TanStackProvider';
import { useToastStore } from '@/shared/stores/useToastStore';

const state = {
    userId: null as string | null,
    client: null as Client | null,
    isConnected: false,
    unReadNotificationCount: null as number | null,
};

const connect = (userId: string) => {
    if (state.client && state.isConnected && state.userId === userId) {
        return state.client;
    }
    state.userId = userId;

    const client = new Client({
        brokerURL: `${SOCKET_URL.BASE}`,
        reconnectDelay: 5000,
        heartbeatIncoming: 25000,
        heartbeatOutgoing: 25000,
    });

    client.onConnect = () => {
        state.isConnected = true;
        subscribeToShareNotifications(userId);
    };

    client.onStompError = (frame) => {
        console.error('ws-stomp-error', frame.headers['message']);
    };

    client.onWebSocketClose = () => {
        state.isConnected = false;
    };

    state.client = client;
    client.activate();
};

const disconnect = (): void => {
    if (state.client) {
        if (state.client.active) {
            state.client.deactivate();
        }
        state.client = null;
    }
    state.isConnected = false;
    state.userId = null;
};

const subscribeToShareNotifications = (userId: string) => {
    if (!state.client) return;

    state.client.subscribe(SOCKET_URL.TOPIC.REQUEST(userId), async (message) => {
        const { showToast } = useToastStore.getState();
        const { queueOrOpen } = useShareModalStore.getState();

        try {
            const subscribedMessage = JSON.parse(message.body);
            const messageType = subscribedMessage.type;

            if (messageType === 'SHARED_REQUEST') {
                queueOrOpen(subscribedMessage.senderNickname, `${subscribedMessage.tripTitle} 여행에 초대합니다!`);
                // summary/notification 즉시 무효화 생략 — 모달보다 벨이 먼저 켜지는 것 방지
                // GlobalShareModal 닫힐 때 무효화됨
            } else {
                if (messageType === 'SHARED_APPROVE') {
                    showToast('친구와 여행 메이트가 됐어요! 🎉');
                    queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
                } else if (messageType === 'SHARED_REJECTED') {
                    showToast('친구가 공유 요청을 거절했어요 ✈️');
                } else if (messageType === 'TRIP_UPDATED') {
                    showToast('친구가 여행 정보를 수정했어요 🧳');
                } else if (messageType === 'TRIP_DELETED') {
                    showToast('친구가 공유한 여행를 삭제했어요 🧳');
                } else if (messageType === 'MEDIA_FILE_UPDATED') {
                    showToast('친구가 여행의 사진을 수정했어요 📷');
                } else if (messageType === 'MEDIA_FILE_ADDED') {
                    showToast('친구가 여행의 사진을 추가했어요 📷');
                } else if (messageType === 'MEDIA_FILE_DELETED') {
                    showToast('친구가 여행의 사진을 삭제했어요 📷');
                }

                queryClient.invalidateQueries({ queryKey: ['summary'] });
                queryClient.invalidateQueries({ queryKey: ['notification'] });

                if (messageType.startsWith('TRIP')) {
                    await queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
                    await queryClient.invalidateQueries({ queryKey: ['ticket-info'] });
                }

                if (messageType.startsWith('MEDIA')) {
                    queryClient.invalidateQueries({ queryKey: ['trip-images', subscribedMessage.tripKey] });
                }
            }
        } catch (error) {
            console.error('메시지 처리 오류:', error);
        }
    });
};

// const requestUnReadNotificationCount = (userId: string) => {
//     if (!state.client || !state.isConnected) return;

//     state.client.publish({
//         destination: SOCKET_URL.TOPIC.UNREAD,
//         body: JSON.stringify({
//             recipientId: userId,
//         }),
//     });
// };

export const socket = {
    get isConnected() {
        return state.isConnected;
    },
    connect,
    disconnect,
};
