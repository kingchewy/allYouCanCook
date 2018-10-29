import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FoodDay } from '../../models/foodDay';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/food';
import { FoodCalendarService } from '../../services/food-calendar.service';

@Component({
  selector: 'app-food-selector',
  templateUrl: './food-selector.page.html',
  styleUrls: ['./food-selector.page.scss'],
})
export class FoodSelectorPage implements OnInit {
  selectedFood;
  day: FoodDay;
  foodList: Food[];

  foodToChange: boolean = false;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private foodservice: FoodService,
    private foodcalendarservice: FoodCalendarService
    ) { }

  ngOnInit() {
    if(this.navParams.get('food')){
      this.selectedFood = this.navParams.get('food');
      this.foodToChange = true;
    }
    this.day = this.navParams.get('day');
    console.log("day in modal: ",this.day);
    this.getFoodList();
  }

  getFoodList(){
    this.foodList = this.foodservice.getLatestFoodList();
  }

  closeSelector(){
    this.modalController.dismiss();
  }

  addFood(){
    if(!this.selectedFood){
      return this.promptNoFoodSelected();
    } else if(this.selectedFood && this.day.foods == null)
    {
      this.day.foods = [this.selectedFood];
      console.log("food added on empty Array in day: ", this.day)
    } else 
    {
      this.day.foods.push(this.selectedFood);
      console.log("foodDay after adding Food to existing array: ", this.day)      
    }
    
    this.addFoodToCalendar();
    this.modalController.dismiss();
  }

  changeFood(){
    let foodToChange = this.navParams.get('food');

    if(!this.selectedFood){
      return this.promptNoFoodSelected();
    }

    this.day.foods.forEach((food, index) =>{
      if(food.id == foodToChange.id){
        this.day.foods.splice(index, 1);
      }
    });
    this.day.foods.push(this.selectedFood);

    this.addFoodToCalendar();
    this.modalController.dismiss();
  }
  

  addFoodToCalendar(){
    this.foodcalendarservice.addFoodToCalendar(this.day)
    .then((result) =>{
      console.log("success adding food to firestore: ", result)
    }).catch((error) =>{
      console.log("error. something went wrong adding the food. Error: ", error)
    });
  }


  selectedFoodButton(){
    console.log("selected Food: ", this.selectedFood)
  }

  promptNoFoodSelected(){
    console.log("no food selected!")
  }
}
