import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Food } from '../models/food';
import { AuthService } from './user/auth.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthGuard } from './user/auth.guard';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  // FIRESTORE REFERENCES
  public afFoodsCollectionRef: firebase.firestore.CollectionReference;
  
  // FOODS
  private _foodList: BehaviorSubject<Food[]> = new BehaviorSubject([]);

  // use or subscribe this List in all components 
  // in the APP to get a stream of a users Foods
  public readonly foodList: Observable<Food[]> = this._foodList.asObservable();



  constructor(
    public afFireStore: AngularFirestore, 
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public authguard: AuthGuard
    ) {
      let firestore = firebase.firestore();
      let settings = {timestampsInSnapshots: true};
      firestore.settings(settings);
      
      this.afFoodsCollectionRef = firebase.firestore().collection('foods');
      this.loadInitialData();
    }

    
  loadInitialData(){    

    this.getMyFoodList()
    .onSnapshot(snapshot => {
      let foodsFromFirestore: Food[] = [];

      snapshot.forEach(food =>{
        let currentFood = food.data();
        
        let foodObject: Food = {
          id: food.id,
          title: currentFood.title,
          owner: currentFood.owner,
          subscriber: currentFood.subscriber,
          category: currentFood.category,
          recipie: currentFood.recipie
        };

        foodsFromFirestore.push(foodObject);
      });
      this._foodList.next(foodsFromFirestore);
    });
    }
    
  getLatestFoodList(){
    return this._foodList.getValue();
  }


  /*********** F I R E S T O R E     R E Q U E S T S ***********/

  // GET ALL FOOD - DOCS WHERE OWNER = USER
  private getMyFoodList(){
    return this.afFoodsCollectionRef.where('owner', '==', this.authguard.userId);
  }

  // GET SINGLE FOOD - DETAILS
  getFoodDetail(foodId: string){
    return this.afFoodsCollectionRef.doc(foodId);
  }

  // CREATE FOOD (all properties)
  createFood(food: Food): Promise<void> {
    //TODO
    const newFoodId = this.afFireStore.createId();
    
    
    return this.afFireStore.doc('foods/'+ newFoodId).set({      
      owner: food.owner,
      title: food.title,
      category: food.category,
      subscriber: food.subscriber,
      recipie: food.recipie
    });
  }

  // CREATE FOOD (by title only)
  createFoodByTitle(foodTitle: string){
    const newFoodId = this.afFireStore.createId();
    console.log("created food id: ", newFoodId)
    let food: Food = {
      id: null,
      title: foodTitle,
      owner: this.authguard.userId,
      subscriber: null,
      category: null,
      recipie: null
    }

    return this.afFoodsCollectionRef.doc(newFoodId).set({
    //return this.afFireStore.doc('foods/'+ newFoodId).set({      
      owner: food.owner,
      title: food.title,
      category: food.category,
      subscriber: food.subscriber,
      recipie: food.recipie
    });  
  }

  // DELETE FOOD
  deleteFood(foodId: string): Promise<void>{
    return this.afFoodsCollectionRef.doc(foodId).delete();
  }

  // UPDATE FOOD
  updateFood(food: Food, newFoodTitle: String):Promise<void>{
    const foodTitle: String = newFoodTitle;
    console.log("update food: ",food);
    return this.afFireStore.collection('foods').doc(food.id).update({
      title: foodTitle,
      category: food.category,
      subscriber: food.subscriber,
      recipie: food.recipie
    });
  }
      
}