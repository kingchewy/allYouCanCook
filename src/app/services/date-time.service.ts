import { Injectable } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/de';
import { formatDate } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  // saves the MOMEMENT(js) of current day
  private momentToday: moment.Moment;

  // saves the MOMENT(js) currently selected to view
  private _momentToView: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());

  // subscribe here to get the currently requested moment streamed
  public readonly momentToView: Observable<moment.Moment> = this._momentToView.asObservable();

  
  private _activeWeekNumber: BehaviorSubject<number> = new BehaviorSubject(null);

  public readonly activeWeekNumber: Observable<number> = this._activeWeekNumber.asObservable();

  constructor() {
    moment.locale('de');
    this.momentToday = moment();
   }
   
  refreshDateTimes(){
    this.momentToday = moment();
    this._momentToView.next(this.momentToday);
    this._activeWeekNumber.next(this.momentToday.isoWeek());
  }

  getMomentToday(){
    return this.momentToday;
  }

  getDayNameOfDate(YYYYMMDD){
    let momentOfDate = moment(YYYYMMDD, "YYYYMMDD");
    return momentOfDate.format('dddd')
  }

  getMomentOfFirstDayInWeek(moment){
    return moment.startOf('isoWeek').add(0, 'days')
  }

  formatDateForView(YYYYMMDD){
    return moment(YYYYMMDD, "YYYYMMDD").format('DD.MM.YYYY')
  }

  formatDateForDB(date){
    return moment(date, 'DD.MM.YYYY').format('YYYYMMDD')
  }

  getDateFormatedYYYYMMDD(moment){
    return moment.format('YYYYMMDD')
  }

  getDateByGivenMomentPlusDays(moment, days){
    let requestedMoment = moment.startOf('isoWeek').add(days, 'days');
    return this.getDateFormatedYYYYMMDD(requestedMoment)
  }

  nextMomentInWeekview(){
    let newMoment = this._momentToView.getValue().add(7, 'days');
    this._momentToView.next(newMoment);
    this._activeWeekNumber.next(newMoment.isoWeek());
  }

  previousMomentInWeekview(){
    let newMoment = this._momentToView.getValue().add(-7, 'days');
    this._momentToView.next(newMoment);
    this._activeWeekNumber.next(newMoment.isoWeek());
  }

}
