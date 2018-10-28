import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subscription,  } from 'rxjs';
import { FoodService } from '../../services/food.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, ItemSliding, List } from '@ionic/angular';
import { Food } from '../../models/food';


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
    console.log("onInit");
    this.getFoods();
  }

  
  /*  *******************    F O O D S E R V I C E    M E T H O D S    ******************** */

  async getFoods(){
    const loading =  await this.loadingCtrl.create();
    await loading.present();

    this.getFoodsSub = this.foodService.foodList.subscribe(list =>{      
      this.foodList = list;
      loading.dismiss();
      console.log("food-subscription! => ", list)
    })
  }
  
  
  // ADD FOOD via FOODSERVICE
  async addFoodByTitle(foodTitle){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    
    if (this.isFoodTwice(foodTitle) == false) {
      this.foodService.createFoodByTitle(foodTitle)
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


  // UPDATE FOOD via FOODSERVICE
  async updateFoodTitle(food, newFoodTitle){
    const loading = await this.loadingCtrl.create();
    
    this.foodService.updateFood(food, newFoodTitle)
    .then(function(data){
      console.log("Food successfully updated! => ", data);
      loading.dismiss();
    })
    .catch(function(error){
      console.log("Error updating food => ",error);
      loading.dismiss();
    });
    
    await loading.present();
  }

  // DELETE FOOD via FOODSERVICE
  async deleteFood(foodId: string){
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
  // ADD new FOOD
  async alertAddFood() {
    this.slidingList.closeSlidingItems();
    
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
  
  // UPDATE FOOD
  async alertUpdateFood(slidingItem: ItemSliding, food) {
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
            slidingItem.close();       
            this.updateFoodTitle(food, foodToUpdate.title);
          }
        }
      ]
    });    
    await prompt.present();
  }

      
  // DELETE FOOD
  async alertDeleteFood(slidingItem: ItemSliding, food) {
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
  searchFoods(ev: any){
    this.foodList = this.foodService.getLatestFoodList();
    // set val to the value of the searchbar
    let val = ev.target.value;
        
    // if the value is an empty string don't filter the items
    if(this.foodList){
      if (val && val.trim() !== '') {
        this.foodList = this.foodList.filter(function (food) {
          console.log(food);
          return food.title.toLowerCase().includes(val.toLowerCase());
        });
      }
    }
  }
  
  // ADD FOOD HANDLER Method, to check if Food to Add is already in DB
  isFoodTwice(foodTitle: string) {
    let isTwice = false;
    
    this.foodList.forEach(element => {
      if (element.title == foodTitle) {
        isTwice = true;
      }
    });
    return isTwice;
  }
  
  // ADD FOOD HANDLER Method, to let User know that Food is already in List
  async presentToastItemTwice() {
    let toast = await this.toastCtrl.create({
      message: 'Speise bereits in deiner Liste vorhanden!',
      duration: 2000,
      position: 'middle'
    });
    await toast.present();
  }


  // TEMP METHODS TO FIX BROKEN SLIDING ITEM BUG
  ionViewWillLeave(){
    console.log("view leave")
    this.slidingList.closeSlidingItems().then(function(){
      console.log("successfully closed sliding items.")
    }).catch(function(error){
      console.log("Error while closing slidingItems:")
    });
  }
  
  // TEMP METHOD TO FIX BROKEN SLIDING ITEM BUG
  closeSlidingItems(){
    this.slidingList.closeSlidingItems();
  }

  ngOnDestroy(): void {
    console.log("view destroyed")
    this.getFoodsSub.unsubscribe();
  }
}
