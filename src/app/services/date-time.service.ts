import { Injectable } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/de';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * D A T E / T I M E   -   S E R V I C E
 *
 * Description:
 * MOMENT JS as library to manipulate/modify Date and Time within the App
 * 
 */

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  // saves the MOMENT(js) of current day
  private momentToday: moment.Moment;

  // saves the MOMENT(js) currently selected to view
  private _momentToView: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
  // subscribe here to get the currently requested moment streamed
  public readonly momentToView$: Observable<moment.Moment> = this._momentToView.asObservable();

  // current active weeknumber
  private _activeWeekNumber: BehaviorSubject<number> = new BehaviorSubject(null);
  // stream of current active weeknumber
  public readonly activeWeekNumber$: Observable<number> = this._activeWeekNumber.asObservable();

  constructor() {
    moment.locale('de'); // set local time to "DE"
    this.momentToday = moment();
   }
   
  refreshDateTimes():void{
    this.momentToday = moment();
    this._momentToView.next(this.momentToday);
    this._activeWeekNumber.next(this.momentToday.isoWeek());
  }

  getMomentToday():moment.Moment{
    return this.momentToday;
  }

  getDayNameOfDate(YYYYMMDD):string{
    let momentOfDate = moment(YYYYMMDD, "YYYYMMDD");
    return momentOfDate.format('dddd')
  }

  getCurrentDate():string{
    return moment().toISOString()
  }

  getMomentOfFirstDayInWeek(moment):moment.Moment{
    return moment.startOf('isoWeek').add(0, 'days')
  }

  formatDateForView(YYYYMMDD):string{
    return moment(YYYYMMDD, "YYYYMMDD").format('DD.MM.YYYY')
  }

  formatDateForDB(date):string{
    return moment(date, 'DD.MM.YYYY').format('YYYYMMDD')
  }

  getDateFormatedYYYYMMDD(moment):string{
    return moment.format('YYYYMMDD')
  }

  getDateByGivenMomentPlusDays(moment, days):string{
    let requestedMoment = moment.startOf('isoWeek').add(days, 'days');
    return this.getDateFormatedYYYYMMDD(requestedMoment)
  }

  getDateObjectByString(DDMMYYYY: string):Date{
    return moment(DDMMYYYY, 'DD.MM.YYYY').toDate()
  }

  dateIsInFuture(date):boolean{
    let dateToCompare = moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
    return moment(dateToCompare).isAfter(this.momentToday)
  }

  setMomentToNextWeek():void{
    let newMoment = this._momentToView.getValue().add(7, 'days');
    this._momentToView.next(newMoment);
    this._activeWeekNumber.next(newMoment.isoWeek());
  }

  setMomentToPreviousWeek():void{
    let newMoment = this._momentToView.getValue().add(-7, 'days');
    this._momentToView.next(newMoment);
    this._activeWeekNumber.next(newMoment.isoWeek());
  }

}
