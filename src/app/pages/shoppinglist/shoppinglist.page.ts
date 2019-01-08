import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ShoppingList } from '../../models/shoppingList';
import { ActivatedRoute } from '@angular/router';
import { ShoppinglistService } from '../../services/shoppinglist.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ReorderGroup, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';

/**
 * S H O P P I N G L I S T   -    P A G E
 * 
 * Description:
 * observes the ShoppingList from shoppingListService that comes via ID with the route
 * Items can be added via the input field in the toolbar, after validation
 * 
 * sort/reordering function on all unchecked items available
 * checking an item, moves it to the "done-list" and vice versa
 * 
 * for shared shoppinglist with readonly permission to a user, several modify options
 * are disabled/removed
 */
@Component({
  selector: 'app-shoppinglist',
  templateUrl: './shoppinglist.page.html',
  styleUrls: ['./shoppinglist.page.scss'],
})
export class ShoppinglistPage implements OnInit, OnDestroy{
  @ViewChild('reorderGroup') htmlReorderGroup: ReorderGroup;
  
  private shoppingList: ShoppingList;

  // 2 way binded ngModel for new ShoppingItem Input
  private newShoppingItem: string = "";

  // trigger for displaying modify option to user
  readonly:boolean = false;

  // trigger to toggle reordering on item list
  reorder:boolean = false;

  // trigger for unsaved changes on reordering
  reorderedItemsUnsaved: boolean = false;

  // SUBSCRIPTIONS
  private shoppingListSub: Subscription;

  constructor( 
    private _location: Location,
    private route: ActivatedRoute,
    private shoppingListService: ShoppinglistService,
    private toastController: ToastController,
    private authService: AuthService,
    ) { }

  ngOnInit() {
    this.subscribeShoppingList();
  }

  // subscribes the shoppinglist that comes with navParams
  private subscribeShoppingList():void{
    let shoppingListId = this.route.snapshot.paramMap.get('id');

    this.shoppingListSub = this.shoppingListService.getShoppingList(shoppingListId)
    .subscribe(shoppingList =>{
      this.shoppingList = shoppingList;
      
      let userId = this.authService.getUserId();
      if(shoppingList && shoppingList.roles[userId] === 2){
        this.readonly = true;
      }
    })
  }
  
  // ADD new shoppingItem to the list by calling the shoppingListService (FIRESTORE)
  private addShoppingListItem():void{
    this.shoppingListService.addItemToShoppingList(this.newShoppingItem, this.shoppingList.id)
    .then(()=>{
      this.newShoppingItem = ""
      console.log("Item successfully added to ShoppingList ", this.shoppingList.title, "!")
    })
    .catch(error=>{
      console.log("Error adding Item to ShoppingList: ", error)
    })
  }
  
  // UPDATES the shoppingListItems on changes. Calls shoppinglistService (FIRESTORE)
  private updateShoppingListItems():void{
    this.shoppingListService.updateShoppingListItems(this.shoppingList)
    .then(result =>{      
      console.log("ShoppingListItems successfully updated!")
    })
    .catch(error =>{
      console.log("Error updating ShoppingListItems!")
    })
  } 

  // DELETES an Item from the unchecked list and call the shoppingListService
  private deleteUncheckedShoppingItem(item: string):void{
    this.shoppingListService.removeUncheckedItemFromShoppingList(item, this.shoppingList)
    .then(() => {
      console.log("Successfully deleted UncheckedItem from ShoppingList ", this.shoppingList.title, "!")
    })
    .catch(error =>{
      console.log("Error deleting UncheckedItem from ShoppingList: ", error)
    })
  }
  
  // DELETES an Item from the checked list. calls the shoppinglistservice
  private deleteCheckedShoppingItem(item: string):void{
    this.shoppingListService.removeCheckedItemFromShoppingList(item, this.shoppingList)
    .then(() => {
      console.log("Successfully deleted CheckedItem from ShoppingList ", this.shoppingList.title, "!")
    })
    .catch(error =>{
      console.log("Error deleting CheckedItem from ShoppingList: ", error)
    })
  }

  // adding a new item from input ( called in template )
  private validateAndAddItem():void{    
    if(!this.isTwice()){
      this.addShoppingListItem();
    } else{
      this.presentToastItemTwice();
    }
  }

  // helper method to check if new input/item is already in list
  private isTwice():boolean{
    if(this.getCheckedItem() || this.getUncheckedItem()){
      return true;
    }
    return false
  }

  // helper method returns true if new shoppingitem is in unchecked item list
  private getUncheckedItem():string{
    return this.shoppingList.itemsUnchecked.find( item => this.newShoppingItem == item );
  }

  // helper method returns true if new shoppingitem is in checked item list
  private getCheckedItem():string{
    return this.shoppingList.itemsChecked.find( item => this.newShoppingItem == item );
  }
  
  // moves an item from open to done ( called from template )
  private moveToDone(item: string, itemIndex: number):void{
    if(!this.readonly){
      this.shoppingList.itemsUnchecked.splice(itemIndex, 1);
      this.shoppingList.itemsChecked.push(item);
      this.updateShoppingListItems();
    }
  }
  
    // moves an item from done to open ( called from template )
  private moveToUndone(item: string, itemIndex: number):void{
    if(!this.readonly){
      this.shoppingList.itemsChecked.splice(itemIndex, 1);
      this.shoppingList.itemsUnchecked.push(item);
      this.updateShoppingListItems();    
    }
  }
  
  // TOAST that will dislay if an item is already in list
  private async presentToastItemTwice():Promise<void> {
    const toast = await this.toastController.create({
      message: `${this.newShoppingItem} bereits in der Einkaufsliste.`,
      duration: 2000
    });
    toast.present();
  }

  // toggles reorder true/false (called from template)
  private toggleReOrder():void{
    this.reorderedItemsUnsaved = !this.reorderedItemsUnsaved;
    this.htmlReorderGroup.disabled = !this.htmlReorderGroup.disabled;
  }
  
  // ionItemReorder Event from template, fires on reordering
  // moves an item to another index
  reorderUncheckedItems(ev){
    this.reorderedItemsUnsaved = true;
    let itemToMove = this.shoppingList.itemsUnchecked.splice(ev.detail.from, 1)[0];
    this.shoppingList.itemsUnchecked.splice(ev.detail.to, 0, itemToMove);    
  }
  
  // Not used at the moment
/*   reorderCheckedItems(ev){
    let itemToMove = this.shoppingList.itemsChecked.splice(ev.detail.from, 1)[0];
    this.shoppingList.itemsChecked.splice(ev.detail.to, 0, itemToMove);
  } */
  
  // saves the reordered items (called from tempalte)
  private saveItemsOnReorder():void{
    this.updateShoppingListItems();
    this.reorderedItemsUnsaved = false;
    this.htmlReorderGroup.disabled = true;
  }
  
  goBack(){
    if(this.shoppingListSub){
      this.shoppingListSub.unsubscribe();
    }
    this._location.back();
  }

  ngOnDestroy(){
    if(this.shoppingListSub){
      this.shoppingListSub.unsubscribe();
    }
  }
}
