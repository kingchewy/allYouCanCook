import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FriendRequest } from '../models/friendRequest';
import { BehaviorSubject, Observable } from 'rxjs';
import { Friend } from '../models/friend';
import { AuthService } from './user/auth.service';

/**
 * F R I E N D   -    S E R V I C E
 *
 * Description:
 * provides observable lists of friends & unanswered friendrequests (sent, received)
 *
 */

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private friendRequestsRef = firebase.firestore().collection('friendRequests');
  private userRef = firebase.firestore().collection('users');

  // RECEIVED FRIENDREQUESTS (not answered yet)
  private _pendingRequests: BehaviorSubject<FriendRequest[]> = new BehaviorSubject(null);
  public readonly pendingRequests$: Observable<FriendRequest[]> = this._pendingRequests.asObservable();

  // SENT FRIENDREQUESTS (requested user did not answer yet)
  private _unansweredRequests: BehaviorSubject<FriendRequest[]> = new BehaviorSubject(null);
  public readonly unansweredRequests$: Observable<FriendRequest[]> = this._unansweredRequests.asObservable();

  // LIST OF ALL FRIENDS
  private _friends: BehaviorSubject<Friend[]> = new BehaviorSubject(null);
  public readonly friends$: Observable<Friend[]> = this._friends.asObservable();
  

  constructor(
    private authService: AuthService
  ) { 

    this.loadReceivedUnansweredRequests();
    this.loadSentRequestsWithoutReply();
    this.loadFriends();
    
  }
  

  private loadReceivedUnansweredRequests(){

   return this.friendRequestsRef.where('toUserEmail', '==', `${ this.authService.getEmail() }`)
      .where('accepted', '==', false)
      .where('answered', '==', false)
      .onSnapshot( snapshot => {

        let snappedPendingRequests: FriendRequest[] = [];
        snapshot.forEach( request => {
          let requestData = request.data();
          console.log("requests: ", requestData)
          let friendRequestObject: FriendRequest = {
            id: request.id,
            fromUserId: requestData.fromUserId,
            fromUserName: requestData.fromUserName,
            toUserEmail: requestData.toUserEmail,
            message: requestData.message,
            accepted: requestData.accepted,
            answered: requestData.answered,
            dateOfRequest: requestData.dateOfRequest,
            toUserId: requestData.toUserId
          }
          snappedPendingRequests.push(friendRequestObject)
        })
        this._pendingRequests.next(snappedPendingRequests);
      })
  }

  private loadSentRequestsWithoutReply(): () => void{
    return this.friendRequestsRef.where('fromUserId', '==', `${ this.authService.getUserId()}`)
      .where('answered', '==', false)
      .onSnapshot( snapshot => {
        
        let snappedPendingRequests: FriendRequest[] = [];
        snapshot.forEach( request => {
          let requestData = request.data();
          console.log("requests: ", requestData)
          let friendRequestObject: FriendRequest = {
            id: request.id,
            fromUserId: requestData.fromUserId,
            fromUserName: requestData.fromUserName,
            toUserEmail: requestData.toUserEmail,
            message: requestData.message,
            accepted: requestData.accepted,
            answered: requestData.answered,
            dateOfRequest: requestData.dateOfRequest,
            toUserId: requestData.toUserId
          }
          snappedPendingRequests.push(friendRequestObject)
        })
        this._unansweredRequests.next(snappedPendingRequests);
      })
    }

  private loadFriends():void{
    this.userRef.where('friends', 'array-contains', this.authService.getUserId())
    .onSnapshot( friends => {
      const friendList: Friend[] = [];
      friends.forEach( friend => {
        const friendData = friend.data();
        const friendObject: Friend = {
          id: friend.id,
          firstname: friendData.firstname,
          lastname: friendData.lastname,
          nickname: friendData.nickname,
          email: friendData.email,
          birthdate: friendData.birthdate,
        }

        friendList.push(friendObject);
      })
      this._friends.next(friendList);
    })
  }

  
  sendFriendRequest(request: FriendRequest):Promise<any>{
    return this.friendRequestsRef.add(request)
  }

  acceptFriendRequest(request: FriendRequest):Promise<any>{
    return this.friendRequestsRef.doc(request.id).update({
      accepted: true,
      answered: true
    })
  }

  denyFriendRequest(request: FriendRequest):Promise<any>{
    return this.friendRequestsRef.doc(request.id).update({
      accepted: false,
      answered: true
    })
  }

  deleteFriendRequest(request: FriendRequest):Promise<any>{
    return this.friendRequestsRef.doc(request.id).delete()
  }

}