import { Injectable } from '@angular/core';
import { DateTimeService } from './date-time.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FoodDay } from '../models/foodDay';
import * as firebase from 'firebase/app';
import { AuthGuard } from './user/auth.guard';
import { Food } from '../models/food';
import { FoodService } from './food.service';


@Injectable({
  providedIn: 'root'
})
export class FoodCalendarService {

  // FIRESTORE REFERENCES
  public afFoodCalendarColRef: firebase.firestore.CollectionReference;

  // FOODS
  private _foodCalendar: BehaviorSubject<FoodDay[]> = new BehaviorSubject([]);

  // app components can subscribe for users complete foodCalendar
  public readonly foodCalendar: Observable<FoodDay[]> = this._foodCalendar.asObservable();

  // currently requested/selected weeklist to view
  private _weekListToView: BehaviorSubject<FoodDay[]> = new BehaviorSubject([]);
  // app components can subscribe for up to date weekList (foodCalendar for selected week)
  public readonly weekListToView: Observable<FoodDay[]> = this._weekListToView.asObservable();
  

  //SUBSCRIPTIONS
  momentForWeekListSub: Subscription;


  constructor(
    private dateTimeService: DateTimeService,
    private foodservice: FoodService,
    private authguard: AuthGuard,

  ) {
    let firestore = firebase.firestore();
    let settings = {timestampsInSnapshots: true};
    firestore.settings(settings);

    this.afFoodCalendarColRef = firebase.firestore().collection('foodCalendars/' + this.authguard.userId + '/foodCalendar');
    this.loadInitialFoodCalendar();
    //this.createWeekListToView();    
   }


  loadInitialFoodCalendar(){
    let that = this;
    
    this.afFoodCalendarColRef.onSnapshot(function(days){

      let fireFoodCalendar: any[] = [];
    
      days.forEach(day =>  {
        let daysData = day.data();
        
        let dateOfDay = that.dateTimeService.formatDateForView(day.id);
        let daysNameOfWeek = that.dateTimeService.getDayNameOfDate(day.id);
        let foodsOfDay: Food[] = that.getFoodsById(daysData.lunch);

        let foodDayObject: FoodDay = {
          date: dateOfDay,
          dayNameOfWeek: daysNameOfWeek,
          foods: foodsOfDay
        };
        fireFoodCalendar[day.id] = foodDayObject;
        //fireFoodCalendar.push(foodDayObject);
        console.log("filling day by day => ", fireFoodCalendar, " + days ID = ",day.id.toString())
      });
      that._foodCalendar.next(fireFoodCalendar);
      //that._weekListToView.next(fireFoodCalendar);
      that.createWeekListToView();
    });
  }

  // Subscribes the active MOMENT from date-time-service
  // on every change of the MOMENT, the new foodCalendarWeekList 
  // will be created according to the new MOMENT
  createWeekListToView(){
    this.momentForWeekListSub = this.dateTimeService.momentToView
    .subscribe(newMoment => {
      if(newMoment){
        //get latest complete FoodCalendar from behaviours
        let latestFoodCalendar: FoodDay[] = this._foodCalendar.getValue();
        let nextWeekList: FoodDay[] = [];
        let firstDayInWeek = this.dateTimeService.getMomentOfFirstDayInWeek(newMoment);
                
        for (var i = 0; i < 7; i++){
          let dateYYYYMMDD = this.dateTimeService.getDateByGivenMomentPlusDays(firstDayInWeek, i);

          let foodDayObject: FoodDay = {            
            date: this.dateTimeService.formatDateForView(dateYYYYMMDD),
            dayNameOfWeek: this.dateTimeService.getDayNameOfDate(dateYYYYMMDD),
            foods: null
          };

          if(latestFoodCalendar[dateYYYYMMDD]){
            foodDayObject = latestFoodCalendar[dateYYYYMMDD];
          }

          nextWeekList.push(foodDayObject);
          console.log("should display all foodDay Object for given week: ", latestFoodCalendar[dateYYYYMMDD])
        }

        this._weekListToView.next(nextWeekList);
      }
    })
  }

  getFoodsById(listOfFoodsForLunch): Food[]{
    if(!listOfFoodsForLunch){
      return null;
    }

    let listOfFoods: Food[] = [];
    
    listOfFoodsForLunch.forEach(element => {
      let foodId: string = Object.keys(element).toString();      

      this.foodservice.getLatestFoodList().forEach(food =>{
        if(food.id === foodId){
          listOfFoods.push(food);
        }
      });
    });
    return listOfFoods
  }

  // ADD new doc or merge into existing
  addFoodToCalendar(foodDayObject: FoodDay): Promise<any>{
    let doc = {
      lunch: []
    }
    
    foodDayObject.foods.forEach(food =>{
      let id = food.id.toString();
      let title = food.title;
      
      let newFood= {};
      newFood[id] = title;
       
      doc.lunch.push(newFood);
    });

    let date = this.dateTimeService.formatDateForDB(foodDayObject.date);
    
    return this.afFoodCalendarColRef.doc(date).set(doc, {merge: true})
  }

  deleteFoodFromCalendar(foodDayObject: FoodDay, foodToRemove: Food): Promise<any>{
    let doc = {
      lunch: []
    }

    foodDayObject.foods.forEach(food =>{
      let id = food.id.toString();
      let title = food.title;
      
      let newFood= {};
      newFood[id] = title;
      
      if(food.id != foodToRemove.id){
        doc.lunch.push(newFood);
      }
    });

    let date = this.dateTimeService.formatDateForDB(foodDayObject.date);

    return this.afFoodCalendarColRef.doc(date).set(doc)
  }

}
