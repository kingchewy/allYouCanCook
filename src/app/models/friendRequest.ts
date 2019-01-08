export class FriendRequest  {
    id?: string;
    fromUserName: string;
    fromUserId: string;
    toUserEmail: string;
    message: string;
    accepted: boolean;
    answered: boolean;
    dateOfRequest: string;
    toUserId?: string;
}