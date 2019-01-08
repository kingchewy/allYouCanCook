import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { FoodService } from '../../services/food.service';
import { LoadingController, AlertController, ToastController, ItemSliding, List } from '@ionic/angular';
import { Food } from '../../models/food';

/**
 * F O O D L I S T    -    P A G E
 * 
 * Description:
 * Subscribes to users FoodList to show the list in the template
 * CRUD methods for Food
 * 
 * Food search function
 */

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.page.html',
  styleUrls: ['./food-list.page.scss'],
})
export class FoodListPage implements OnInit, OnDestroy {
  
  @ViewChild('slidingList') slidingList: List; // TEMP TO FIX SLIDING ITEM BUG
  
  order: string = 'title';  // OrderPipe Attribute in HTML (by title)
  
  public foodList: Food[];  

  //SUBSCRIPTIONS / Listeners
  getFoodsSub: Subscription;
  
  constructor(
    private foodService: FoodService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    ){     
   }
   
  ngOnInit() {
    this.getFoods();
  }

  
  /*  *******************    F O O D S E R V I C E    M E T H O D S    ******************** */

  private async getFoods():Promise<void>{
    const loading =  await this.loadingCtrl.create();
    await loading.present();

    this.getFoodsSub = this.foodService.foodList$.subscribe(list =>{      
      this.foodList = list;
      loading.dismiss();
    })
  }
  
  
  // ADD FOOD via FOODSERVICE
  private async addFoodByTitle(foodTitle):Promise<void>{
    const loading = await this.loadingCtrl.create();
    await loading.present();
    
    if (this.isFoodTwice(foodTitle) == false) {
      this.foodService.createFoodByTitleOnly(foodTitle)
      .then(function(data){
        console.log("Food successfully updated! => ", data);
        loading.dismiss();
      })
      .catch(function(error){
        console.log("Error updating food => ",error);
        loading.dismiss();
      });
    }  else {
      console.log("ist schon in der liste")
      loading.dismiss();
      this.presentToastItemTwice();
    }

  }

  // DELETE FOOD via FOODSERVICE
  private async deleteFood(foodId: string):Promise<void>{
    const loading = await this.loadingCtrl.create();
    
    this.foodService.deleteFood(foodId)
    .then(function() {
      console.log("Food successfully deleted!");
      loading.dismiss();
    }).catch(function(error){
      loading.dismiss();
      console.error("Error removing document: ", error);
    })
    
    await loading.present();
  }


  /*  ********************    A L E R T S    ********************* */
  // ADD new FOOD (called from tempalte)
  private async alertAddFood():Promise<void> {
    this.closeSlidingItems();
    
    let alert = await this.alertCtrl.create({
      header: 'Neue Speise hinzufügen',
      //message: 'Wie soll der Titel deiner neuen Speise lauten?',
      inputs: [
        {
          name: 'title',
          placeholder: 'Name'
        },
      ],
      buttons: [
        {
          text: 'Abbruch',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: food => {     // data = key/value -> title: foodname
            this.addFoodByTitle(food.title);
          }
        }
      ]
    });
    await alert.present();
  }
  
  // UPDATE FOOD (called from template)
  private async alertUpdateFood(slidingItem: ItemSliding, food):Promise<void> {
    //this.closeSlidingItems();
    let prompt = await this.alertCtrl.create({
      header: 'Bearbeite Name',
      inputs: [{
        name: 'title',
        value: food.title
      }],
      buttons: [
        {
          text: 'Abbrechen',
          handler: closeSlider => {
            slidingItem.close();
          }
        },
        {
          text: 'Speichern',
          handler: foodToUpdate => {
            food.title = foodToUpdate.title
            this.foodService.updateFoodName(food).then(() => {
              console.log("updated successfully")
            })
            //this.updateFoodTitle(food, foodToUpdate.title);
            slidingItem.close();    
          }
        }
      ]
    });    
    await prompt.present();
  }

      
  // DELETE FOOD (called from template)
  private async alertDeleteFood(slidingItem: ItemSliding, food):Promise<void> {
    let alert = await this.alertCtrl.create({
      header: 'Lösche Speise',
      message: 'Willst du wirklich die Speise permanent aus deiner Liste entfernen?',
      //enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Nein',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ja',
          handler: () => {
            slidingItem.close();
            this.deleteFood(food);
          }
        }
      ]
    });
    await alert.present();
  }
  

  
  /*  ********************    M E T H O D S     ********************* */
  
  // SEARCH - FUNCTION
  private searchFoods(ev: any):void{
    this.closeSlidingItems();
    this.foodList = this.foodService.getLatestFoodList();
    // set val to the value of the searchbar
    let searchValue = ev.target.value;
        
    // if the value is an empty string don't filter the items
    if(this.foodList){
      if (this.searchValueNotEmpty(searchValue)) {
        console.log("true -> in function")
        this.foodList = this.foodList.filter( food => {
          return food.title.toLowerCase().includes(searchValue.toLowerCase());
        })
      }
    }
  }

  // HELPER: checks if value is not empty
  private searchValueNotEmpty(value: string):boolean{
    return value && (value.trim() !== '')
  }
  
  // ADD FOOD HANDLER Method, to check if Food to Add is already in DB
  private isFoodTwice(foodTitle: string):boolean {
    let isTwice = false;
    
    this.foodList.forEach(element => {
      if (element.title == foodTitle) {
        isTwice = true;
      }
    });
    return isTwice;
  }
  
  // ADD FOOD HANDLER Method, to let User know that Food is already in List
  private async presentToastItemTwice():Promise<void> {
    let toast = await this.toastCtrl.create({
      message: 'Speise bereits in deiner Liste vorhanden!',
      duration: 2000,
      position: 'middle'
    });
    await toast.present();
  }

  // TEMP METHODS TO FIX BROKEN SLIDING ITEM BUG
  ionViewWillLeave(){
    if(this.slidingList){
      this.slidingList.closeSlidingItems().then(function(){
        console.log("successfully closed sliding items.")
      }).catch(function(error){
        console.log("Error while closing slidingItems:")
      });
    }
  }
  
  // TEMP METHOD TO FIX BROKEN SLIDING ITEM BUG
  closeSlidingItems(){
    if(this.slidingList){
      this.slidingList.closeSlidingItems();
    }
  }

  ngOnDestroy(): void {
    console.log("view destroyed")
    this.getFoodsSub.unsubscribe();
  }
}
