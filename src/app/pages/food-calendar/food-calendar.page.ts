import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/de';
import { AlertController, List, ModalController } from '@ionic/angular';
import { DateTimeService } from '../../services/date-time.service';
import { FoodCalendarService } from '../../services/food-calendar.service';
import { Subscription } from 'rxjs';
import { FoodDay } from '../../models/foodDay';
import { FoodSelectorPage } from '../food-selector/food-selector.page';
import { Food } from '../../models/food';

@Component({
  selector: 'app-food-calendar',
  templateUrl: './food-calendar.page.html',
  styleUrls: ['./food-calendar.page.scss'],
})
export class FoodCalendarPage implements OnInit {
  @ViewChild('slidingList') slidingList: List; // TEMP TO FIX SLIDING ITEM BUG

    // DATE PROPERTIES
    
    weeklist: FoodDay[];
    weeknumber;

    // MOMENTS
    currentMoment;

    //SUBSCRIPTIONS
    currentWeekListSub: Subscription;
    currentWeekNumberSub: Subscription;

  constructor(
    public alertCtrl: AlertController,
    public modalController: ModalController,
    public dateTimeService: DateTimeService,
    public foodCalendarService: FoodCalendarService
    ){
      this.currentMoment = this.dateTimeService.getMomentToday();
      this.subscribeCurrentWeekList();
      this.subscribeCurrentWeekNumber();
    }

  ngOnInit() {
    this.dateTimeService.refreshDateTimes();
  }


  subscribeCurrentWeekList(){
    this.currentWeekListSub = this.foodCalendarService.weekListToView
    .subscribe(newWeekList =>{
      this.weeklist = newWeekList;
      console.log("current list in subscription: ", this.weeklist)
      // dismiss loadin?
    })
  }

  subscribeCurrentWeekNumber(){
    this.currentWeekNumberSub = this.dateTimeService.activeWeekNumber
    .subscribe(newWeeknumber =>{
      this.weeknumber = newWeeknumber;
    })
  }
  
  getNextWeekList(){
    this.slidingList.closeSlidingItems();
    this.dateTimeService.nextMomentInWeekview();
  }

  getPreviousWeekList(){
    this.slidingList.closeSlidingItems();
    this.dateTimeService.previousMomentInWeekview();
  }

  async alertDeleteFood(day: FoodDay, food){
    this.slidingList.closeSlidingItems();

    const alert = await this.alertCtrl.create({
      header: 'ENTFERNEN: ',
      message: 'Soll "<strong>' + food.title + '</strong>" von gewähltem Tag entfernt werden?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Entfernen',
          handler: () => {
            this.deleteFoodFromCalendar(day, food);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async addFoodToCalendarDay(day: FoodDay){
    this.slidingList.closeSlidingItems();

    const modal = await this.modalController.create({
      component: FoodSelectorPage,
      componentProps: { day: day,  }
    });
    return await modal.present();
    //this.presentFoodSelectorModal(day);
  }

  async changeFoodOfCalendarDay(day: FoodDay, food: Food){
    this.slidingList.closeSlidingItems();

    const modal = await this.modalController.create({
      component: FoodSelectorPage,
      componentProps: { day: day,  food: food}
    });
    return await modal.present();
  }

  
  deleteFoodFromCalendar(day: FoodDay, food: Food){
    this.foodCalendarService.deleteFoodFromCalendar(day, food)
    .then((result) => {
      console.log("successfully deleted food from firestore")
    }). catch((error) => {
      console.log("error. somethin went wrong deleting the food. Error: ", error)
    })
  }

  // TEMP METHOD TO FIX BROKEN SLIDING ITEM BUG
  closeSlidingItems(){
    this.slidingList.closeSlidingItems();
  }

/*   async presentFoodSelectorModal(day: FoodDay) {
    console.log("day before sending to modal: ", day)
    const modal = await this.modalController.create({
      component: FoodSelectorPage,
      componentProps: { day: day,  }
    });
    return await modal.present();
  }

  async presentFoodSelectorModal(day: FoodDay, food: Food) {
    console.log("day before sending to modal: ", day)
    const modal = await this.modalController.create({
      component: FoodSelectorPage,
      componentProps: { day: day,  food: food}
    });
    return await modal.present();
  } */

    // Check if user has at least one food in his FoodList to add to the calendar
/*     alertAddFoodOnEmpty(){
      this.foodCalendarService.loadMyFoods().then((result) => {
  
        let foodsArray = this.foodCalendarService.getFoodsList();
        if (!foodsArray.length) {
          // If User has no Foods in his FoodsList that could be added in the calendar
          // the user will be alerted to maybe add some Food first
          this.promptToAddFood();
      }
      }, (error) => {
        console.log("ERROR: ", error);
      });
    }
 */
  async promptToAddFood(){
    console.log("foodlist is null/empty");
    
      let alert = await this.alertCtrl.create({
        header: 'Keine Speisen vorhanden!',
        message: 'Um mit der Wochenplanung beginnen zu können, musst du Speisen anlegen. Jetzt die erste Speise hinzufügen?',
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
            //  this.nav.push(FoodListPage);
              console.log('Agree clicked');
            }
          }
        ]
      });
  
      await alert.present();
    
  }

  ngOnDestroy(){
    if(this.currentWeekListSub){
      this.currentWeekListSub.unsubscribe();
    }
    if(this.currentWeekNumberSub){
      this.currentWeekNumberSub.unsubscribe();
    }
  }
}
