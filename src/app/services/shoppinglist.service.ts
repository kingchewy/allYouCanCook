import { Injectable } from '@angular/core';
import { ShoppingList } from '../models/shoppingList';
import { BehaviorSubject, Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthGuard } from './user/auth.guard';
import { AuthService } from './user/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ShoppinglistService {

  private afShoppingLists: AngularFirestoreCollection;

  private _shoppingLists: BehaviorSubject<ShoppingList[]> = new BehaviorSubject(null);
  public $shoppingLists: Observable<ShoppingList[]> = this._shoppingLists.asObservable();
  
  constructor(
    
  public afFireStore: AngularFirestore, 
  public authService: AuthService,
  public afAuth: AngularFireAuth,
  public authguard: AuthGuard
  ) {
    let firestore = firebase.firestore();
    let settings = {timestampsInSnapshots: true};
    firestore.settings(settings);

    this.afShoppingLists = this.afFireStore.collection('shoppingLists');
    
    //this.afFoodsCollectionRef = firebase.firestore().collection('foods');
    this.loadInitialShoppingLists();
  }

  loadInitialShoppingLists(){    
    firebase.firestore().collection('shoppingLists').get().then(data =>{
      data.forEach(doc =>{
        console.log('shoppinglists: ', doc.data());
      })
    }).catch(error =>{

    })

    
  }

  getMyShoppingLists(){
    return this.afFireStore.collection('shoppingLists', ref => ref.where('roles', 'array-contains', this.authguard.userId))
  }
}