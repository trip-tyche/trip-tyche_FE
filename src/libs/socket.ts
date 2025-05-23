import { Client } from '@stomp/stompjs';

import { SOCKET_URL } from '@/shared/constants/socket';
import { queryClient } from '@/shared/providers/TanStackProvider';
import { useModalStore } from '@/shared/stores/useModalStore';
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
        heartbeatIncoming: 50000,
        heartbeatOutgoing: 50000,
    });

    client.onConnect = () => {
        console.log('ws-conneted');
        state.isConnected = true;

        subscribeToShareNotifications(userId);
    };

    client.onStompError = () => {
        console.error('ws-conneted-error');
        state.client = null;

        reconnect();
    };

    state.client = client;
    client.activate();
};

const reconnect = () => {
    disconnect();
    if (state.userId) {
        const { userId } = state;
        setTimeout(() => {
            connect(userId);
        }, 500);
    }
};

const disconnect = (): void => {
    console.log('ws-disconneted');
    if (state.client && state.isConnected) {
        if (state.client.active) {
            state.client.deactivate();
        }
        state.client = null;
    }
    state.isConnected = false;
};

const subscribeToShareNotifications = (userId: string) => {
    if (!state.isConnected || !state.client) {
        connect(userId);
        return null;
    }

    state.client.subscribe(SOCKET_URL.TOPIC.REQUEST(userId), (message) => {
        const { showToast } = useToastStore.getState();
        const { openModal } = useModalStore.getState();

        try {
            const subscribedMessage = JSON.parse(JSON.parse(message.body));
            console.log(subscribedMessage);
            const messageType = subscribedMessage.type;

            if (messageType === 'SHARED_REQUEST') {
                // requestUnReadNotificationCount(userId);
                openModal(subscribedMessage.senderNickname, `${subscribedMessage.tripTitle} 여행에 초대합니다!`);
            } else if (messageType === 'SHARED_APPROVE') {
                showToast('공유 요청이 승인되었습니다');
                queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
            } else if (messageType === 'SHARED_REJECTED') {
                showToast('공유 요청이 거절되었습니다');
            } else if (messageType === 'TRIP_UPDATED') {
                openModal(
                    subscribedMessage.senderNickname,
                    `${subscribedMessage.tripTitle} 여행의 정보를 수정했습니다!`,
                );
                queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
            } else if (messageType === 'TRIP_DELETED') {
                openModal(subscribedMessage.senderNickname, `${subscribedMessage.tripTitle} 여행을 삭제했습니다!`);
                queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
            } else if (messageType === 'MEDIA_FILE_UPDATED') {
                openModal(
                    subscribedMessage.senderNickname,
                    `${subscribedMessage.tripTitle} 여행의 사진을 수정했습니다!`,
                );
                queryClient.invalidateQueries({ queryKey: ['trip-images', subscribedMessage.tripKey] });
            } else if (messageType === 'MEDIA_FILE_ADDED') {
                openModal(
                    subscribedMessage.senderNickname,
                    `${subscribedMessage.tripTitle} 여행에 사진을 추가했습니다!`,
                );
                queryClient.invalidateQueries({ queryKey: ['trip-images', subscribedMessage.tripKey] });
            } else if (messageType === 'MEDIA_FILE_DELETE') {
                openModal(
                    subscribedMessage.senderNickname,
                    `${subscribedMessage.tripTitle} 여행의 사진을 삭제했습니다!`,
                );
                queryClient.invalidateQueries({ queryKey: ['trip-images', subscribedMessage.tripKey] });
            }

            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['notification'] });
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
