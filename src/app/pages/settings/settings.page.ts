import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { FoodCalendarService } from '../../services/food-calendar.service';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

/**
 * S E T T I N G S   -    P A G E
 * 
 * Description:
 * User and App Settings can be modified here
 * 
 * currently only local food notifications for the calendar can be activated/deactivate
 * 
 */

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  notifications: boolean = true;

  //SUBSCRIPTIONS
  private foodCalendarSub: Subscription;

  constructor(
    private notificationService: NotificationService,
    private foodCalendarService: FoodCalendarService,
    private platform: Platform
  ) { }

  ngOnInit() {
  }

  // Event from template on toggle the button
  // triggers to cancel or set notifications for foods in calendar
  onNotificationsChange(ev){
    if(this.notifications && this.platform.is('cordova')){
      this.setNotifications();
    } else if (this.platform.is('cordova')){
      this.notificationService.cancelAllFoodNotifications();
    }
  }
  
  // turn food notifications ON by calling the notification service
  private setNotifications():void{
    this.foodCalendarSub = this.foodCalendarService.foodCalendar$.subscribe( foodCalendar => {
      if(foodCalendar.length > 0){
        this.notificationService.setNotificationsForAllFoods(foodCalendar);
      }
    })
  }

  ngOnDestroy(){
    if(this.foodCalendarSub){
      this.foodCalendarSub.unsubscribe();
    }
  }

}
