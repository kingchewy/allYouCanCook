import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/de';
import { AlertController, ModalController, List } from '@ionic/angular';
import { DateTimeService } from '../../services/date-time.service';
import { FoodCalendarService } from '../../services/food-calendar.service';
import { Subscription } from 'rxjs';
import { FoodDay } from '../../models/foodDay';
import { FoodSelectorPage } from '../../modals/food-selector/food-selector.page';
import { Food } from '../../models/food';
import { NotificationService } from '../../services/notification.service';

/**
 * F O O D C A L E N D A R   -    P A G E
 * 
 * Description:
 * holds a weeklist of users FoodCalendar, while the weeklist is observed from 
 * FoodCalendarService. Providing a moment(Js) to dateTimeService, the currentweeklist$
 * changes to the week of this moment.
 * 
 * 
 */

@Component({
  selector: 'app-food-calendar',
  templateUrl: './food-calendar.page.html',
  styleUrls: ['./food-calendar.page.scss'],
})
export class FoodCalendarPage implements OnInit {
  @ViewChild('slidingList') slidingList: List; // TEMP TO FIX SLIDING ITEM BUG
  
  weeklist: FoodDay[];

  // Weeknumber current    
  weeknumber: number;

  //SUBSCRIPTIONS
  currentWeekListSub: Subscription;
  currentWeekNumberSub: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private modalController: ModalController,
    private dateTimeService: DateTimeService,
    private foodCalendarService: FoodCalendarService,
    private notificationService: NotificationService,

    ){
      this.subscribeCurrentWeekList();
      this.subscribeCurrentWeekNumber();
    }

  ngOnInit() {
    // on init the view will refresh to current week by calling the datetimeservice
    this.dateTimeService.refreshDateTimes();
  }

  // subscribes the current weekList for the view
  private subscribeCurrentWeekList():void{
    this.currentWeekListSub = this.foodCalendarService.weekListToView$
    .subscribe(newWeekList =>{
      this.weeklist = newWeekList;
      console.log("currently selected weeklist: ", this.weeklist);
    })
  }

  // subscribes the current weeknumber for the view
  private subscribeCurrentWeekNumber():void{
    this.currentWeekNumberSub = this.dateTimeService.activeWeekNumber$
    .subscribe( newWeeknumber =>{
      this.weeknumber = newWeeknumber;
    })
  }
  
  // calls the datetimeserve to change the weekview-trigger( a moment ) to next week
  getNextWeekList():void{
    this.slidingList.closeSlidingItems();
    this.dateTimeService.setMomentToNextWeek();
  }

  // calls the datetimeserve to change the weekview-trigger( a moment ) to previous week
  getPreviousWeekList():void{
    this.slidingList.closeSlidingItems();
    this.dateTimeService.setMomentToPreviousWeek();
  }


  // ADD FOOD for that day
  // calls the FoodSelector Modal, providing the foodDay as argument
  async addFoodToCalendarDay(day: FoodDay):Promise<void>{
    this.slidingList.closeSlidingItems();

    const modal = await this.modalController.create({
      component: FoodSelectorPage,
      componentProps: { day: day,  }
    });
    return await modal.present();
  }

  // CHANGE SELECTED FOOD for that day
  // calls the FoodSelector Modal, proving foodDay and food (to change) as argument
  async changeFoodOfCalendarDay(day: FoodDay, food: Food):Promise<void>{
    this.slidingList.closeSlidingItems();

    const modal = await this.modalController.create({
      component: FoodSelectorPage,
      componentProps: { day: day,  food: food}
    });
    return await modal.present();
  }

  // Alert to delete Food from that day (sliding-item option)
  async alertDeleteFood(day: FoodDay, food):Promise<void>{
    this.slidingList.closeSlidingItems();

    const alert = await this.alertCtrl.create({
      header: 'ENTFERNEN: ',
      message: 'Soll "<strong>' + food.title + '</strong>" von gewähltem Tag entfernt werden?',
      buttons: [
        {
          text: 'abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled removing Food');
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

  // DELETE Food from that day
  private deleteFoodFromCalendar(day: FoodDay, food: Food):void{
    this.foodCalendarService.deleteFoodFromCalendar(day, food)
    .then((result) => {
      this.notificationService.onDeletedFoodUpdateFoodNotification(day, food);
      console.log("successfully deleted food from firestore", result)
    }). catch((error) => {
      console.log("error. somethin went wrong deleting the food. Error: ", error)
    })
  }
  

  // TEMP METHOD TO FIX BROKEN SLIDING ITEM BUG
  closeSlidingItems():void{
    this.slidingList.closeSlidingItems();
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
