import { Component, OnInit, ViewChild } from '@angular/core';
import { ShoppingList } from '../../models/shoppingList';
import { ShoppinglistService } from '../../services/shoppinglist.service';
import { Subscription } from 'rxjs';
import { List, AlertController, Input, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { User } from '../../models/user';
import { ShareShoppinglistPage } from '../../modals/share-shoppinglist/share-shoppinglist.page';

/**
 * S H O P P I N G L I S T S    -    P A G E
 * 
 * Description:
 * Users can create shoppingLists that will be subscribed from
 * shoppinglistService. The observable shoppingLists$ stream includes
 * all shoppinglists the user owns and also lists for which the user has
 * a shared role, granted by friends on their own lists
 * 
 * A user can share Shoppinglists, rename or delete them
 * 
 * From this shoppinglists overview a user can add an shoppingitem directly
 * to a selected list, without navigating into the list itself
 * 
 */
@Component({
  selector: 'app-shoppinglists',
  templateUrl: './shoppinglists.page.html',
  styleUrls: ['./shoppinglists.page.scss'],
})
export class ShoppinglistsPage implements OnInit {
  @ViewChild('slidingList') slidingList: List;  // TEMP IONIC BUGFIX

  // Array of the ShoppingLists for the page to display
  myShoppingLists: ShoppingList[];
  sharedShoppingLists: ShoppingList[];

  // selected list to add a new item into it
  selectedShoppingList: ShoppingList;

  userId: string;

  // Object used in template, to translate a users role (e.g. 2, or 3) to 
  // readable string -> lesen, schreiben
  roles: any = { 2: 'lesen', 3: 'schreiben'}

  //SUBSCRIPTIONS:
  private shoppingListSub: Subscription;
  private userProfileSubscription: Subscription;

  constructor(
    private shoppingListService: ShoppinglistService,
    private alertController: AlertController,
    private authService: AuthService,
    public modalController: ModalController,
  ) {  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.subscribeShoppingLists();
  }

  // SUBSCRIBE all ShoppingLists from shoppingListService
  subscribeShoppingLists(){
    this.shoppingListSub = this.shoppingListService.shoppingLists$.subscribe( shoppingLists => {
      this.myShoppingLists = shoppingLists.filter( list => list.owner == this.userId);
      this.sharedShoppingLists = shoppingLists.filter( list => list.roles[this.userId] > 1);
    })
  }
  
  // CREATE ShoppingList by calling the ShoppingListService
  private createShoppingList(title: string):void{
    this.closeSliders();
    this.shoppingListService.createShoppingList(title).then(data =>{
      console.log("new shoppinglist created: ", data.id)
    }).catch(error =>{
      console.log("error creating new shoppinglist: ", error)
    })
  }

  // DELETE ShoppingList by calling the ShoppingListService
  private deleteShoppingList(id: string):void{
    this.shoppingListService.deleteShoppingList(id)
    .then(() => {
      console.log("Successfully deleted ShoppingList!")
    })
    .catch(error =>{
      console.log("Error deleting ShoppingList: ", error)
    })
  }

  // RENAME ShoppingList by calling the ShoppingListService
  private renameShoppingList(shoppingList: ShoppingList):void{
    this.shoppingListService.renameShoppingList(shoppingList)
    .then(() => {
      console.log("Successfully renamed ShoppingList!")
    })
    .catch(error =>{
      console.log("Error renaming ShoppingList: ", error)
    })
  }

  // MODAL for Sharing this ShoppingList, passing the shoppingList as argument ( from template )
  private async shareShoppingListWithFriendModal(list: ShoppingList):Promise<void>{
    this.closeSliders();

    const modal = await this.modalController.create({
      component: ShareShoppinglistPage,
      componentProps: { shoppingList: list  }
    });
    return await modal.present();
  }

  // ALERT to add a new shoppingList ( called from template )
  private async alertAddShoppingList():Promise<void> {
    this.closeSliders();
    const alert = await this.alertController.create({
      header: 'Neue Einkaufsliste!',
      inputs: [
        {
          name: 'shoppingListName',
          type: 'text',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: input => {
            this.createShoppingList(input.shoppingListName);
          }
        }
      ]
    });
    await alert.present();
  }

  // ALERT to delete a shoppingList (called in template)
  private async alertDeleteShoppingList(shoppingList: ShoppingList):Promise<void> {
    this.closeSliders();
    const alert = await this.alertController.create({
      header: 'Löschen!',
      message: `Einkaufsliste <strong>${shoppingList.title}</strong> wirklich löschen?`,
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'JA',
          handler: () => {
            this.deleteShoppingList(shoppingList.id);
          }
        }
      ]
    });
    await alert.present();
  }

  // ALERT to rename ShoppingList ( called in template )
  private async alertRenameShoppingList(shoppingList: ShoppingList):Promise<void>{
    this.closeSliders();
    const alert = await this.alertController.create({
      header: 'Neue Einkaufsliste anlegen',
      inputs: [
        {
          name: 'shoppingListName',
          type: 'text',
          placeholder: 'Name',
          value: shoppingList.title
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: input => {
            shoppingList.title = input.shoppingListName;
            this.renameShoppingList(shoppingList);
          }
        }
      ]
    });
    await alert.present();
  }

  // ADD Items to selected ShoppingList calls ShoppingListservice (from template)
  private addItemToShoppingList(inputField: Input):void{
    this.closeSliders();
    this.shoppingListService.addItemToShoppingList(inputField.value, this.selectedShoppingList.id)
    .then( () => {
      console.log("Item successfully added to shoppingList");
      inputField.value = null;
    })
    .catch( error => {
      console.log("Something went wrong adding Item to ShoppingList: ", error)
    })
  }

  // TEMP BUGFIX FOR IONIC SLIDING ITEMS
  closeSliders(){
    if(this.slidingList){
      this.slidingList.closeSlidingItems();
    }
  }

  // TEMP BUGFIX FOR IONIC SLIDING ITEMS
  ionViewWillLeave(){
    this.slidingList.closeSlidingItems().then(function(){
      console.log("successfully closed sliding items.")
    }).catch(function(error){
      console.log("Error while closing slidingItems:")
    });
  }

  ngOnDestroy(){
    if(this.shoppingListSub){
      this.shoppingListSub.unsubscribe();
    }
    if(this.userProfileSubscription){
      this.userProfileSubscription.unsubscribe();
    }
  }
}
