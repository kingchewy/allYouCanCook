import { Injectable } from '@angular/core';
import { DateTimeService } from './date-time.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FoodDay } from '../models/foodDay';
import * as firebase from 'firebase/app';
import { Food } from '../models/food';
import { FoodService } from './food.service';
import { AuthService } from './user/auth.service';

/**
 * F O O D C A L E N D A R   -   S E R V I C E
 *
 * Description:
 * provides a FoodCalendar and possibility to add/remove Foods from firestore
 * provides an observable weeklist refreshing with DateTimeServices's "momentToView$"
 * 
 */

@Injectable({
  providedIn: 'root'
})
export class FoodCalendarService {

  // FIRESTORE REFERENCES
  public afFoodCalendarColRef: firebase.firestore.CollectionReference;

  // FOODS
  private _foodCalendar: BehaviorSubject<FoodDay[]> = new BehaviorSubject([]);

  // app components can subscribe for users complete foodCalendar
  public readonly foodCalendar$: Observable<FoodDay[]> = this._foodCalendar.asObservable();

  // currently requested/selected weeklist to view
  private _weekListToView: BehaviorSubject<FoodDay[]> = new BehaviorSubject([]);
  // app components can subscribe for up to date weekList (foodCalendar for selected week)
  public readonly weekListToView$: Observable<FoodDay[]> = this._weekListToView.asObservable();
  

  //SUBSCRIPTIONS
  momentForWeekListSub: Subscription;


  constructor(
    private dateTimeService: DateTimeService,
    private foodservice: FoodService,
    private authService: AuthService,

  ) {
    let firestore = firebase.firestore();
    let settings = {timestampsInSnapshots: true};
    firestore.settings(settings);

    this.afFoodCalendarColRef = firebase.firestore().collection('foodCalendars/' + this.authService.getUserId() + '/foodCalendar');
    this.loadInitialFoodCalendar();  
   }


  loadInitialFoodCalendar(){
    let that = this;
    
    this.afFoodCalendarColRef.onSnapshot({ includeMetadataChanges: false }, foodDays => {

      let fireFoodCalendar: any[] = [];
    
      foodDays.forEach( foodDay =>  {
        let foodDayData = foodDay.data();
        
        let dateOfDay = that.dateTimeService.formatDateForView(foodDay.id);
        let daysNameOfWeek = that.dateTimeService.getDayNameOfDate(foodDay.id);
        let foodsOfDay: Food[] = that.getFoodsById(foodDayData.lunch);

        let foodDayObject: FoodDay = {
          date: dateOfDay,
          dayNameOfWeek: daysNameOfWeek,
          foods: foodsOfDay
        };
        fireFoodCalendar[foodDay.id] = foodDayObject;
        
      });
      that._foodCalendar.next(fireFoodCalendar);

/*       var source = foodDays.metadata.fromCache ? "local cache" : "server";
      console.log("CacheInfo: ",foodDays.metadata.fromCache + "\nData came from " + source); */
      that.createWeekListToView();
    });
  }

  // Subscribes the active MOMENT from date-time-service
  // on every change of the MOMENT, the new foodCalendarWeekList 
  // will be created according to the new MOMENT
  createWeekListToView(){
    this.momentForWeekListSub = this.dateTimeService.momentToView$
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


  // TAKES: a map of key/value pairs <string, string> as Argument:
  // key == foodId / value == foodName

  // RETURNS: an array of "Food" Object by given keys(foodId)
  private getFoodsById(mapOfFoods: Map<string,string>): Food[]{
    if(!mapOfFoods){
      return null;
    }

    const listOfFoods: Food[] = [];
    mapOfFoods.forEach( foodMap => {
      let foodId: string = Object.keys(foodMap).toString();      

      this.foodservice.getLatestFoodList().forEach(food =>{
        if(food.id === foodId){
          listOfFoods.push(food);
        }
      });
    });
    return listOfFoods
  }


  // FIRESTORE
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

  // FIRESTORE
  // Delete Food from calendar
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
