type NotificationMessage = 'SHARED_REQUEST' | 'SHARED_APPROVE' | 'SHARED_REJECTED';
type NotificationStatus = 'READ' | 'UNREAD';

export interface Notification {
    notificationId: number;
    referenceId: number;
    message: NotificationMessage;
    status: NotificationStatus;
    senderNickname: string;
    createdAt: string;
}
