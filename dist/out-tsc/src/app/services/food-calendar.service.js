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
var date_time_service_1 = require("./date-time.service");
var rxjs_1 = require("rxjs");
var firebase = require("firebase/app");
var food_service_1 = require("./food.service");
var auth_service_1 = require("./user/auth.service");
var FoodCalendarService = /** @class */ (function () {
    function FoodCalendarService(dateTimeService, foodservice, authService) {
        this.dateTimeService = dateTimeService;
        this.foodservice = foodservice;
        this.authService = authService;
        // FOODS
        this._foodCalendar = new rxjs_1.BehaviorSubject([]);
        // app components can subscribe for users complete foodCalendar
        this.foodCalendar = this._foodCalendar.asObservable();
        // currently requested/selected weeklist to view
        this._weekListToView = new rxjs_1.BehaviorSubject([]);
        // app components can subscribe for up to date weekList (foodCalendar for selected week)
        this.weekListToView = this._weekListToView.asObservable();
        var firestore = firebase.firestore();
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        this.afFoodCalendarColRef = firebase.firestore().collection('foodCalendars/' + this.authService.getUserId() + '/foodCalendar');
        this.loadInitialFoodCalendar();
        //this.createWeekListToView();    
    }
    FoodCalendarService.prototype.loadInitialFoodCalendar = function () {
        var that = this;
        this.afFoodCalendarColRef.onSnapshot({ includeMetadataChanges: false }, function (snapshot) {
            var fireFoodCalendar = [];
            snapshot.forEach(function (day) {
                var daysData = day.data();
                var dateOfDay = that.dateTimeService.formatDateForView(day.id);
                var daysNameOfWeek = that.dateTimeService.getDayNameOfDate(day.id);
                var foodsOfDay = that.getFoodsById(daysData.lunch);
                var foodDayObject = {
                    date: dateOfDay,
                    dayNameOfWeek: daysNameOfWeek,
                    foods: foodsOfDay
                };
                fireFoodCalendar[day.id] = foodDayObject;
                //fireFoodCalendar.push(foodDayObject);
                console.log("filling day by day => ", fireFoodCalendar, " + days ID = ", day.id.toString());
            });
            that._foodCalendar.next(fireFoodCalendar);
            //that._weekListToView.next(fireFoodCalendar);
            var source = snapshot.metadata.fromCache ? "local cache" : "server";
            console.log("CacheInfo: ", snapshot.metadata.fromCache + "\nData came from " + source);
            that.createWeekListToView();
        });
    };
    // Subscribes the active MOMENT from date-time-service
    // on every change of the MOMENT, the new foodCalendarWeekList 
    // will be created according to the new MOMENT
    FoodCalendarService.prototype.createWeekListToView = function () {
        var _this = this;
        this.momentForWeekListSub = this.dateTimeService.momentToView
            .subscribe(function (newMoment) {
            if (newMoment) {
                //get latest complete FoodCalendar from behaviours
                var latestFoodCalendar = _this._foodCalendar.getValue();
                var nextWeekList = [];
                var firstDayInWeek = _this.dateTimeService.getMomentOfFirstDayInWeek(newMoment);
                for (var i = 0; i < 7; i++) {
                    var dateYYYYMMDD = _this.dateTimeService.getDateByGivenMomentPlusDays(firstDayInWeek, i);
                    var foodDayObject = {
                        date: _this.dateTimeService.formatDateForView(dateYYYYMMDD),
                        dayNameOfWeek: _this.dateTimeService.getDayNameOfDate(dateYYYYMMDD),
                        foods: null
                    };
                    if (latestFoodCalendar[dateYYYYMMDD]) {
                        foodDayObject = latestFoodCalendar[dateYYYYMMDD];
                    }
                    nextWeekList.push(foodDayObject);
                    console.log("should display all foodDay Object for given week: ", latestFoodCalendar[dateYYYYMMDD]);
                }
                _this._weekListToView.next(nextWeekList);
            }
        });
    };
    FoodCalendarService.prototype.getFoodsById = function (listOfFoodsForLunch) {
        var _this = this;
        if (!listOfFoodsForLunch) {
            return null;
        }
        var listOfFoods = [];
        listOfFoodsForLunch.forEach(function (element) {
            var foodId = Object.keys(element).toString();
            _this.foodservice.getLatestFoodList().forEach(function (food) {
                if (food.id === foodId) {
                    listOfFoods.push(food);
                }
            });
        });
        return listOfFoods;
    };
    // ADD new doc or merge into existing
    FoodCalendarService.prototype.addFoodToCalendar = function (foodDayObject) {
        var doc = {
            lunch: []
        };
        foodDayObject.foods.forEach(function (food) {
            var id = food.id.toString();
            var title = food.title;
            var newFood = {};
            newFood[id] = title;
            doc.lunch.push(newFood);
        });
        var date = this.dateTimeService.formatDateForDB(foodDayObject.date);
        return this.afFoodCalendarColRef.doc(date).set(doc, { merge: true });
    };
    FoodCalendarService.prototype.deleteFoodFromCalendar = function (foodDayObject, foodToRemove) {
        var doc = {
            lunch: []
        };
        foodDayObject.foods.forEach(function (food) {
            var id = food.id.toString();
            var title = food.title;
            var newFood = {};
            newFood[id] = title;
            if (food.id != foodToRemove.id) {
                doc.lunch.push(newFood);
            }
        });
        var date = this.dateTimeService.formatDateForDB(foodDayObject.date);
        return this.afFoodCalendarColRef.doc(date).set(doc);
    };
    FoodCalendarService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [date_time_service_1.DateTimeService,
            food_service_1.FoodService,
            auth_service_1.AuthService])
    ], FoodCalendarService);
    return FoodCalendarService;
}());
exports.FoodCalendarService = FoodCalendarService;
//# sourceMappingURL=food-calendar.service.js.map