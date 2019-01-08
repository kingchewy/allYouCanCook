import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Food } from '../models/food';
import { DateTimeService } from './date-time.service';
import { FoodDay } from '../models/foodDay';
import { AlertController } from '@ionic/angular';

/**
 * N O T I F I C A T I O N   -    S E R V I C E
 *
 * Description:
 * Local Notifications are handled here.
 * e.g. FOOD notifications for menu of the day (from foodcalendar)
 * provides methods to add/remove single food notifications
 * provides methods to cancel all notifications, or set notifications for all foods in 
 * future daily menus (e.g. after reactivating "local food notifications in settings-page")
 *
 */

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private localNotifications: LocalNotifications,
    private dateTimeService: DateTimeService,
    private alertController: AlertController
  ) { }

  // called from app, to manage/cancel old and create/add new notifications
  addFoodNotification(foodDay: FoodDay):void{
    const notificationId = +this.dateTimeService.formatDateForDB(foodDay.date);

    this.localNotifications.isPresent(notificationId).then( isPresent => {
      if(isPresent){
        this.localNotifications.cancel(notificationId).then( () => {
          this.createNewFoodNotification(foodDay, notificationId);
        })
      } else {
        this.createNewFoodNotification(foodDay, notificationId);
      }
    })
  }
  
  // creates a new Food Notification for given foodDay and adds it to the schedule
  private createNewFoodNotification(foodDay: FoodDay, notificationId: number):void{    
    let strOfFoods = this.getStringOfFoods(foodDay);

    // create date/time for the trigger of this notification
    let date = this.getDateForTrigger(foodDay.date);
      
    if(foodDay.foods.length > 0){
      this.localNotifications.schedule(
        {
          id: notificationId,
          title: 'Heute am Speiseplan:',
          text: strOfFoods,
          trigger: {at: date}
        }
      ) 
    }
  }

  // creates a comma-separated string of all Food Names from THAT day
  private getStringOfFoods(foodDay: FoodDay):string{
    let strOfFoods = '';
    
    foodDay.foods.forEach( food => {
      strOfFoods += `${food.title}, `;
    })
    return strOfFoods
  }

  // creates a DateObject necessary for Local Notification Trigger
  // triggers on foods scheduled day -> time set to 7:30 AM
  private getDateForTrigger( stringDate: string):Date{
    let date = this.dateTimeService.getDateObjectByString(stringDate);    
    date.setHours(7);
    date.setMinutes(30);
    return date
  }

  // updates the local notification of a single foodDay
  // after a food has been removed from that days schedule
  onDeletedFoodUpdateFoodNotification(foodDay: FoodDay, deletedFood: Food):void{
    const notificationId = +this.dateTimeService.formatDateForDB(foodDay.date);

    // removing deleted Food from foodDays FoodArray, before creating new notification
    foodDay.foods = foodDay.foods.filter( food => food !== deletedFood)

    this.localNotifications.isPresent(notificationId).then( isPresent => {
      if(isPresent){
        this.localNotifications.cancel(notificationId).then( () => {
          this.createNewFoodNotification(foodDay, notificationId);
        })
      }
    })
  }

  // SET NOTIFICATIONS FOR ALL UPCOMING DAYS/WEEKS WHERE FOOD IS CHOSEN
  // e.g. user has re-Activated to get notified with daily foodplan
  setNotificationsForAllFoods(foodDays: FoodDay[]){
    this.localNotifications.cancelAll().then( () => {

       const futureFoodDays: FoodDay[] = this.getAllFutureFoodDays(foodDays);

       const notifications:any[] = [];

       if(futureFoodDays.length > 0){

         futureFoodDays.forEach( foodDay => {
          const notificationId = +this.dateTimeService.formatDateForDB(foodDay.date);
          const strOfFoods = this.getStringOfFoods(foodDay);
          const date = this.getDateForTrigger(foodDay.date);
  
          const notification = {
            id: notificationId,
            title: 'Heute am Speiseplan:',
            text: strOfFoods,
            trigger: {at: date}
          }          
          
          notifications.push(notification);         
        })
      }

      //   UNCOMMENT TO GET IMMEDIATELY TRIGGERED NOTIFICATION EXAMPLE IN APP
/*       this.localNotifications.schedule(
        {
          id: 99,
          title: 'Heute am Speiseplan:',
          text: 'Fritattensuppe, Spaghetti'
        }
      ); */

      this.localNotifications.schedule(notifications); 

    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Returns all future FoodDays (from today on)
  private getAllFutureFoodDays(foodDays: FoodDay[]):FoodDay[]{
    //console.log("current foodcalendar: ", foodDays)    
    return foodDays.filter( foodDay => this.dateTimeService.dateIsInFuture(foodDay.date) )    
  }

  // cancels ALL local Food Notifications
  cancelAllFoodNotifications(){
    this.localNotifications.cancelAll().then( () => {
      console.log("all notifications canceled");
    })
  }
}
