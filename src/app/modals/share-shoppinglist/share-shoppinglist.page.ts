import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ShoppingList } from '../../models/shoppingList';
import { Friend } from '../../models/friend';
import { FriendService } from '../../services/friend.service';
import { ShoppinglistService } from '../../services/shoppinglist.service';

/**
 * S H A R E   S H O P P I N G L I S T   -    M O D A L
 * 
 * Description:
 * For a provided ShoppingList (comes from navParams), a friend can be selected
 * to share this list. next a role (read/write) has to be chosen for sharing.
 * 
 * friends the list is shared with can be removed
 */

@Component({
  selector: 'app-share-shoppinglist',
  templateUrl: './share-shoppinglist.page.html',
  styleUrls: ['./share-shoppinglist.page.scss'],
})
export class ShareShoppinglistPage implements OnInit {

  shoppingList: ShoppingList;
  friends: Friend[];
  // possible permisssions for the shared friends that can be chosen
  roles = {
    read: 2,
    write: 3
  }

  // SELECT in Modal
  selectedFriend: Friend;
  selectedRole: number;

  // list of friends that shoppinglist is shared with
  friendsTheListIsSharedWith: Friend[] = [];


  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private friendService: FriendService,
    private shoppingListService: ShoppinglistService,
  ) { }

  ngOnInit() {
    if(this.navParams.get('shoppingList')){
      this.shoppingList = this.navParams.get('shoppingList');
    }
    this.getFriends();
  }

  // get all friends for selection and all friends the list is shared with
  private getFriends():void{
    this.friendService.friends$.subscribe( friends => {
      console.log("friends: ", friends)
      if(friends != null){
        this.friends = friends;
        this.getFriendsSharedInThisList(friends);
      }
    })
  }
  
  private getFriendsSharedInThisList(friends: Friend[]):void{
    friends.forEach( friend => {
      if(this.shoppingList.roles[friend.id]){
        this.friendsTheListIsSharedWith.push(friend);
      }
    });    
  }

  // Share this List with selected Data (called from template)
  private share():void{
    this.shoppingList.roles[this.selectedFriend.id] = this.selectedRole;
    this.shoppingListService.shareShoppingListWithFriend(this.shoppingList, this.selectedFriend.id, this.selectedRole);
    this.closeModal();
  }

  // Stop sharing this list with specified friend (called from template)
  private stopSharingWithThisFriend(friend: Friend):void{
    this.removeFriendFromThisList(friend);
    this.shoppingListService.stopSharingShoppingListWithFriend(this.shoppingList, friend)
    .then( () => {
      console.log('successfully removed friend from sharing in this list')
    })
  }
  
  // helper method to remove the user immediatley from view
  private removeFriendFromThisList(friend: Friend):void{
    this.friendsTheListIsSharedWith.forEach((element, index) => {
      if(this.friendsTheListIsSharedWith[index].id === friend.id){
        this.friendsTheListIsSharedWith.splice(index, 1);
      }
    });
  }

  private closeModal():void{
    this.modalController.dismiss();
  }
  
}
