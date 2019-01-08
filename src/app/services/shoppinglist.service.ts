import { Injectable } from '@angular/core';
import { ShoppingList } from '../models/shoppingList';
import { BehaviorSubject, Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthGuard } from './user/auth.guard';
import { AuthService } from './user/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Friend } from '../models/friend';

/**
 * S H O P P I N G L I S T   -    S E R V I C E
 *
 * Description:
 * This service provides a list of ShoppingLists the user owning or has a shared role
 * 
 * CRUD ShoppingLists to/from Firestore
 * CRUD Items of single Shoppinglists to/from Firestore
 *
 * provides methods to share a list with friends
 * to share a users list, "ROLES" are used on that list!
 *   possible ROLES:
 *    1 = owner
 *    2 = read
 *    3 = write
 * 
 */

@Injectable({
  providedIn: 'root'
})

      
export class ShoppinglistService {

  private refShoppingLists: firebase.firestore.CollectionReference;

  // observable array of all shoppinglists the user is owner of or has a shared role 
  private _shoppingLists: BehaviorSubject<ShoppingList[]> = new BehaviorSubject([]);
  public shoppingLists$: Observable<ShoppingList[]> = this._shoppingLists.asObservable();
  
  constructor(
    public afFireStore: AngularFirestore, 
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public authguard: AuthGuard
    ) {
      let firestore = firebase.firestore();
      let settings = {timestampsInSnapshots: true};
      firestore.settings(settings);

      this.refShoppingLists = firebase.firestore().collection('shoppingLists');
      this.loadInitialShoppingLists();    
  }

  loadInitialShoppingLists(){
    // ROLES:
    // 1 = owner
    // 2 = read
    // 3 = write
    // request all shoppingLists(doc's), where userId has role 1, 2, or 3
    this.refShoppingLists.where('roles.' + this.authService.getUserId(), '<=', 3)
    .onSnapshot(snapshot =>{

      const shoppingLists: ShoppingList[] = [];

      snapshot.forEach(list =>{
        let currentList = list.data();

        let shoppingListObject: ShoppingList = {
          id: list.id,
          owner: currentList.owner,
          title: currentList.title,
          itemsUnchecked: currentList.itemsUnchecked,
          itemsChecked: currentList.itemsChecked,
          roles: currentList.roles
        }

        shoppingLists.push(shoppingListObject);
        
      });
      this._shoppingLists.next(shoppingLists)
    }); 
  }

  // C R U D   S H O P P I N G L I S T S
  createShoppingList(title: string):Promise<any>{
    let userId = this.authService.getUserId();

    let roleObject = {};
    roleObject[userId] = 1; // 1 = "owner"

    //let newShoppingList = this.refShoppingLists.add();

    return this.refShoppingLists.add({
      owner: userId,
      title,
      roles: roleObject,
      itemsChecked: [],
      itemsUnchecked: []
    });
  }

  getShoppingList(id: string):Observable<ShoppingList>{
      return this.shoppingLists$.pipe(
        map(shoppingListArray => shoppingListArray.find( list => list.id === id))
      )
  }

  deleteShoppingList(id: string):Promise<any>{
    return this.refShoppingLists.doc(id).delete();
  }
  
  renameShoppingList(shoppingList: ShoppingList){
    console.log(shoppingList.title)
    let shoppingListRef = this.refShoppingLists.doc(`${shoppingList.id}`);

    return shoppingListRef.update({
      title: shoppingList.title
    });
  }

  // C R U D   S H O P P I N G L I S T    I T E M S 
  addItemToShoppingList(item: string, shoppingListId: string):Promise<any>{
    let shoppingListRef = this.refShoppingLists.doc(`${shoppingListId}`);

    return shoppingListRef.update({
      itemsUnchecked: firebase.firestore.FieldValue.arrayUnion(`${item}`)
    });
  }

  removeCheckedItemFromShoppingList(item: string, shoppingList: ShoppingList):Promise<any>{
    let shoppingListRef = this.refShoppingLists.doc(`${shoppingList.id}`);
    return shoppingListRef.update({
      itemsChecked: firebase.firestore.FieldValue.arrayRemove(`${item}`)
    });
  }

  removeUncheckedItemFromShoppingList(item: string, shoppingList: ShoppingList):Promise<any>{
    let shoppingListRef = this.refShoppingLists.doc(`${shoppingList.id}`);
    return shoppingListRef.update({
      itemsUnchecked: firebase.firestore.FieldValue.arrayRemove(`${item}`)
    });
  }

  updateShoppingListItems(shoppingList: ShoppingList):Promise<any>{
    let shoppingListRef = this.refShoppingLists.doc(`${shoppingList.id}`);
    return shoppingListRef.update({
      itemsUnchecked: shoppingList.itemsUnchecked,
      itemsChecked: shoppingList.itemsChecked
    })
  }


  // S H A R I N G    W I T H   F R I E N D S
  shareShoppingListWithFriend(shoppingList: ShoppingList, userId: string, role: number){
    //add new role of user to the lists "Roles"
    shoppingList.roles[userId] = role;

    let shoppingListRef = this.refShoppingLists.doc(shoppingList.id);

    return shoppingListRef.update({
      roles: shoppingList.roles
    })
  }
  
  stopSharingShoppingListWithFriend(shoppingList: ShoppingList, friend: Friend){
    delete shoppingList.roles[friend.id];

    let shoppingListRef = this.refShoppingLists.doc(`${shoppingList.id}`);
    return shoppingListRef.update({
      roles: shoppingList.roles
    })
  }
}