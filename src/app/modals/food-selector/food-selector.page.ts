import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { FoodDay } from '../../models/foodDay';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/food';
import { FoodCalendarService } from '../../services/food-calendar.service';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';

/**
 * F O O D  S E L E C T O R   -    M O D A L
 * 
 * Description:
 * a food of users foodlist will be selected and added/changed for provided day
 * the day comes from navParams
 * in case of a change, the food comes also from navParams
 */

@Component({
  selector: 'app-food-selector',
  templateUrl: './food-selector.page.html',
  styleUrls: ['./food-selector.page.scss'],
})
export class FoodSelectorPage implements OnInit {
  selectedFood: Food;

  // the provided day a food will be added to, or changed
  foodDay: FoodDay;
  
  // observable foodlist from foodService
  foodList$: Observable<Food[]>;

  // trigger for providing methods/views to ADD or CHANGE a Food for selected day
  foodToChange: boolean = false;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private foodservice: FoodService,
    private foodcalendarservice: FoodCalendarService,
    private notificationService: NotificationService,
    private platform: Platform,
    ) { }

  ngOnInit() {
    if(this.navParams.get('food')){
      this.selectedFood = this.navParams.get('food');
      this.foodToChange = true;
    }
    this.foodDay = this.navParams.get('day');
    this.getFoodList();
  }

  // get an observable stream of a list of foods from foodservice
  // will be subscribed "async-pipe" in template
  getFoodList():void{
    this.foodList$ = this.foodservice.foodList$;
  }

  addFood():void{
    if(this.foodDay.foods == null)
    {
      this.foodDay.foods = [this.selectedFood];
      console.log("food added on empty Array in day: ", this.foodDay)
    } else 
    {
      this.foodDay.foods.push(this.selectedFood);
      console.log("foodDay after adding Food to existing array: ", this.foodDay)      
    }
    
    this.requestAddFoodToCalendar();
    this.modalController.dismiss();
  }
  
  
  // METHOD CALLED WHEN FOOD FOR SELECTED DAY ALREADY SET AND NEEDS TO BE CHANGED
  changeFood():void{
    let foodToChange = this.navParams.get('food');
    
    this.foodDay.foods.forEach((food, index) =>{
      if(food.id == foodToChange.id){
        this.foodDay.foods.splice(index, 1);
      }
    });
    
    this.foodDay.foods.push(this.selectedFood);
    
    this.requestAddFoodToCalendar();
    this.modalController.dismiss();
  }
  
  
  private requestAddFoodToCalendar():void{
    this.foodcalendarservice.addFoodToCalendar(this.foodDay)
    .then((result) =>{
      console.log("success adding food to firestore: ", result)
      if(this.platform.is('cordova')){
        this.notificationService.addFoodNotification(this.foodDay);
      }
    }).catch((error) =>{
      console.log("error. something went wrong adding the food. Error: ", error)
    });
  }
  
  closeSelector():void{
    this.modalController.dismiss();
  }

}
