import { Component, OnInit } from '@angular/core';
import { FriendRequest } from '../../models/friendRequest';
import { Subscription } from 'rxjs';
import { FriendService } from '../../services/friend.service';
import { ProfileService } from '../../services/user/profile.service';
import { AlertController } from '@ionic/angular';
import { Friend } from '../../models/friend';
import { User } from '../../models/user';
import { DateTimeService } from '../../services/date-time.service';

/**
 * F R I E N D S   -    P A G E
 * 
 * Description:
 * Users can have friends in this app
 * Friendrequests can be sent to other users via email and message added
 * 
 * pending sent Friendrequest to other users are displayed by observing
 * friendServices unansweredRequests$
 * 
 * received unanswered Friendrequests from users are displayed by observing
 * friendServices pendingRequests$
 * 
 * a friendlist is diplayed by observing friendServices friends$
 */

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  //FIELDS  
  private friends: Friend[];
  private pendingRequests = null;
  private sentUnansweredRequests = null;

  private userProfile: User;

  //SUBSCRIPTIONS
  private pendingRequestSub: Subscription;
  private userProfileSub: Subscription;
  private sentUnansweredRequestsSub: Subscription;
  private friendsSub: Subscription;
  

  constructor(
    private friendService: FriendService,
    private profileService: ProfileService,
    private alertController: AlertController,
    private dateTimeService: DateTimeService
  ) {
   }

  ngOnInit() {
    this.subscribePendingRequests();
    this.subscribeSentUnansweredRequests();
    this.subscribeUserProfile();
    this.subscribeFriends();
  }

  // Subscription of ProfileServices userProfile$ to get userData to send with a FriendRequest
  private subscribeUserProfile():void{
    this.userProfileSub = this.profileService.userProfile$.subscribe( userProfile => {
      if(userProfile){
        this.userProfile = userProfile;
      }
    })
  }

  // subscribing pending requests the user has not answered yet
  private subscribePendingRequests():void{
    this.pendingRequestSub = this.friendService.pendingRequests$.subscribe( requests => {
      if(requests){
        this.pendingRequests = requests;
      }
    })
  }

  // subscribing users sent friendrequest, not answered by others yet
  private subscribeSentUnansweredRequests():void{
    this.sentUnansweredRequestsSub = this.friendService.unansweredRequests$.subscribe( requests => {
      if(requests){
        this.sentUnansweredRequests = requests;
      }
    })
  }

  // subscribing users friends
  private subscribeFriends():void{
    this.friendsSub = this.friendService.friends$.subscribe( friends => {
      if(friends){
        console.log("friends: ", this.friends);
        this.friends = friends;
      }
    })
  }

  // ALERT to add a new friend ( called from template)
  private async alertAddNewFriend():Promise<void>{
    const alert = await this.alertController.create({
      header: 'Freundschaftsanfrage:',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'email Adresse'
        },
        {
          name: 'message',
          type: 'text',
          placeholder: 'Nachricht'
        },
      ],
      buttons: [
        {
          text: 'abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Senden',
          handler: (data) => {
            this.sendFriendRequest(data.email, data.message);
          }
        }
      ]
    });

    await alert.present();
  }
  
  // send the new request by calling the friendservice
  private sendFriendRequest(toEmail: string, message: string):void{

    let newRequest: FriendRequest = {
      fromUserName: this.userProfile.nickname,
      fromUserId: this.userProfile.id,
      toUserEmail: toEmail,
      message: message,
      accepted: false,
      answered: false,
      dateOfRequest: this.dateTimeService.getCurrentDate(),
    };

    this.friendService.sendFriendRequest(newRequest).then( () => {
      console.log("Request sent")
    })
  }

  // accept a friendrequest ( called from template )
  private acceptFriendRequest(request:FriendRequest):void{
    this.friendService.acceptFriendRequest(request).then( () => {
      console.log("Request accepted")
    });
  }

  // deny a friendrequest ( called from template )
  private denyFriendRequest(request:FriendRequest):void{
    this.friendService.denyFriendRequest(request).then( () => {
      console.log("Request denied")
    })
  }

  // cancel an pending sent request ( call from template )
  private cancelFriendRequest(request:FriendRequest){
    this.friendService.deleteFriendRequest(request).then( () => {
      console.log("Request successfully canceled!")
    })
  }


  ngOnDestroy(){
    if(this.pendingRequestSub){
      this.pendingRequestSub.unsubscribe();
    }
    if(this.userProfileSub){
      this.userProfileSub.unsubscribe();
    }
    if(this.sentUnansweredRequestsSub){
      this.sentUnansweredRequestsSub.unsubscribe();
    }
    if(this.friendsSub){
      this.friendsSub.unsubscribe();
    }
  }
}
