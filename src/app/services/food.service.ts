import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Food } from '../models/food';
import { AuthService } from './user/auth.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthGuard } from './user/auth.guard';
import { map } from 'rxjs/operators';
import { Recipe } from '../models/recipe';

/**
 * F O O D  -   S E R V I C E
 *
 * Description:
 * provides an observable foodList$ from firestore users foods
 * provides methods to CRUD foods in firestore
 * 
 */

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
  public readonly foodList$: Observable<Food[]> = this._foodList.asObservable();


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
    .onSnapshot({ includeMetadataChanges: false }, snapshot => {
      let foodsFromFirestore: Food[] = [];

      snapshot.forEach(food =>{
        let currentFood = food.data();
        
        let recipe: Recipe = {
          condiments: currentFood.condiments,
          preparation: currentFood.preparation,
          duration: currentFood.duration
        }

        let foodObject: Food = {
          id: food.id,
          title: currentFood.title,
          description: currentFood.description,
          owner: currentFood.owner,
          subscriber: currentFood.subscriber,
          category: currentFood.category,
          recipe
        };

        foodsFromFirestore.push(foodObject);
      });
      this._foodList.next(foodsFromFirestore);
      var source = snapshot.metadata.fromCache ? "local cache" : "server";
      console.log("CacheInfo: ",snapshot.metadata.fromCache + "\nData came from " + source);
    });
    }
    
  getLatestFoodList(){
    return this._foodList.getValue();
  }

  getFood(foodId: string):Observable<Food>{
    return this.foodList$.pipe(
      map(foodList => foodList.find( food => food.id === foodId))
    )
  }


  /*********** F I R E S T O R E     R E Q U E S T S ***********/

  // GET ALL FOOD - DOCS WHERE OWNER = USER
  private getMyFoodList(){
    return this.afFoodsCollectionRef.where('owner', '==', this.authService.getUserId());
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
      description: food.description,
      category: food.category,
      subscriber: food.subscriber,
      preparation: food.recipe.preparation,
      condiments: food.recipe.condiments,
      duration: food.recipe.duration
    });
  }

  // CREATE FOOD (by title only)
  createFoodByTitleOnly(foodTitle: string){
    const newFoodId = this.afFireStore.createId();
    console.log("created food id: ", newFoodId)
    let recipe: Recipe = {
      preparation: null,
      condiments: null,
      duration: null
    }

    let food: Food = {
      id: null,
      title: foodTitle,
      description: null,
      owner: this.authService.getUserId(),
      subscriber: null,
      category: null,
      recipe
    }

    return this.afFoodsCollectionRef.doc(newFoodId).set({    
      owner: food.owner,
      title: food.title,
      description: food.description,
      subscriber: food.subscriber,
      category: food.category,
      recipie: food.recipe,
      preparation: food.recipe.preparation,
      condiments: food.recipe.condiments,
      duration: food.recipe.duration
    });  
  }

  // DELETE FOOD
  deleteFood(foodId: string): Promise<void>{
    return this.afFoodsCollectionRef.doc(foodId).delete();
  }

  // UPDATE FOOD
  updateFood(food: Food):Promise<any>{
    console.log("update food: ",food);
    return this.afFoodsCollectionRef.doc(food.id).update({
      title: food.title,
      description: food.description,
      category: food.category,
      subscriber: food.subscriber,
      preparation: food.recipe.preparation,
      condiments: food.recipe.condiments,
      duration: food.recipe.duration
    });
  }

  // UDPATE TITLE OF FOOD
  updateFoodName(food: Food):Promise<any>{
    return this.afFireStore.collection('foods').doc(food.id).update({
      title: food.title
    })
  }

  // UPDATE FOOD CATEGORIES
  updateFoodCategories(food: Food):Promise<any>{
    return this.afFoodsCollectionRef.doc(food.id).update({
      category: food.category
    })
  }

  // UPDATE RECIPE
  updateRecipe(food:Food):Promise<any>{
    return this.afFoodsCollectionRef.doc(food.id).update({
      preparation: food.recipe.preparation,
      condiments: food.recipe.condiments,
      duration: food.recipe.duration
    })
  }

  // GET FOOD CATEGORIES
  getFoodCategories():Promise<any>{
    return this.afFireStore.collection('foodCategories').get().toPromise()     
  }
}