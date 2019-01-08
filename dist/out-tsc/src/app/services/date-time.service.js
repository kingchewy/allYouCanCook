"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
require("moment/locale/de");
var rxjs_1 = require("rxjs");
var DateTimeService = /** @class */ (function () {
    function DateTimeService() {
        // saves the MOMENT(js) currently selected to view
        this._momentToView = new rxjs_1.BehaviorSubject(moment());
        // subscribe here to get the currently requested moment streamed
        this.momentToView = this._momentToView.asObservable();
        this._activeWeekNumber = new rxjs_1.BehaviorSubject(null);
        this.activeWeekNumber = this._activeWeekNumber.asObservable();
        moment.locale('de');
        this.momentToday = moment();
    }
    DateTimeService.prototype.refreshDateTimes = function () {
        this.momentToday = moment();
        this._momentToView.next(this.momentToday);
        this._activeWeekNumber.next(this.momentToday.isoWeek());
    };
    DateTimeService.prototype.getMomentToday = function () {
        return this.momentToday;
    };
    DateTimeService.prototype.getDayNameOfDate = function (YYYYMMDD) {
        var momentOfDate = moment(YYYYMMDD, "YYYYMMDD");
        return momentOfDate.format('dddd');
    };
    DateTimeService.prototype.getCurrentDate = function () {
        return moment().toISOString();
    };
    DateTimeService.prototype.getMomentOfFirstDayInWeek = function (moment) {
        return moment.startOf('isoWeek').add(0, 'days');
    };
    DateTimeService.prototype.formatDateForView = function (YYYYMMDD) {
        return moment(YYYYMMDD, "YYYYMMDD").format('DD.MM.YYYY');
    };
    DateTimeService.prototype.formatDateForDB = function (date) {
        return moment(date, 'DD.MM.YYYY').format('YYYYMMDD');
    };
    DateTimeService.prototype.getDateFormatedYYYYMMDD = function (moment) {
        return moment.format('YYYYMMDD');
    };
    DateTimeService.prototype.getDateByGivenMomentPlusDays = function (moment, days) {
        var requestedMoment = moment.startOf('isoWeek').add(days, 'days');
        return this.getDateFormatedYYYYMMDD(requestedMoment);
    };
    DateTimeService.prototype.nextMomentInWeekview = function () {
        var newMoment = this._momentToView.getValue().add(7, 'days');
        this._momentToView.next(newMoment);
        this._activeWeekNumber.next(newMoment.isoWeek());
    };
    DateTimeService.prototype.previousMomentInWeekview = function () {
        var newMoment = this._momentToView.getValue().add(-7, 'days');
        this._momentToView.next(newMoment);
        this._activeWeekNumber.next(newMoment.isoWeek());
    };
    DateTimeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], DateTimeService);
    return DateTimeService;
}());
exports.DateTimeService = DateTimeService;
//# sourceMappingURL=date-time.service.js.map