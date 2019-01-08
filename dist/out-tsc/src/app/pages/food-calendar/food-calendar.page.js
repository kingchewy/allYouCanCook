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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("moment/locale/de");
var angular_1 = require("@ionic/angular");
var date_time_service_1 = require("../../services/date-time.service");
var food_calendar_service_1 = require("../../services/food-calendar.service");
var food_selector_page_1 = require("../food-selector/food-selector.page");
var FoodCalendarPage = /** @class */ (function () {
    function FoodCalendarPage(alertCtrl, modalController, dateTimeService, foodCalendarService) {
        this.alertCtrl = alertCtrl;
        this.modalController = modalController;
        this.dateTimeService = dateTimeService;
        this.foodCalendarService = foodCalendarService;
        this.currentMoment = this.dateTimeService.getMomentToday();
        this.subscribeCurrentWeekList();
        this.subscribeCurrentWeekNumber();
    }
    FoodCalendarPage.prototype.ngOnInit = function () {
        this.dateTimeService.refreshDateTimes();
    };
    FoodCalendarPage.prototype.subscribeCurrentWeekList = function () {
        var _this = this;
        this.currentWeekListSub = this.foodCalendarService.weekListToView
            .subscribe(function (newWeekList) {
            _this.weeklist = newWeekList;
            //console.log("check metadata. from cache? => ")
            console.log("current list in subscription: ", _this.weeklist);
            // dismiss loadin?
        });
    };
    FoodCalendarPage.prototype.subscribeCurrentWeekNumber = function () {
        var _this = this;
        this.currentWeekNumberSub = this.dateTimeService.activeWeekNumber
            .subscribe(function (newWeeknumber) {
            _this.weeknumber = newWeeknumber;
        });
    };
    FoodCalendarPage.prototype.getNextWeekList = function () {
        this.slidingList.closeSlidingItems();
        this.dateTimeService.nextMomentInWeekview();
    };
    FoodCalendarPage.prototype.getPreviousWeekList = function () {
        this.slidingList.closeSlidingItems();
        this.dateTimeService.previousMomentInWeekview();
    };
    FoodCalendarPage.prototype.alertDeleteFood = function (day, food) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.slidingList.closeSlidingItems();
                        return [4 /*yield*/, this.alertCtrl.create({
                                header: 'ENTFERNEN: ',
                                message: 'Soll "<strong>' + food.title + '</strong>" von gewähltem Tag entfernt werden?',
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                        handler: function (blah) {
                                            console.log('Confirm Cancel: blah');
                                        }
                                    }, {
                                        text: 'Entfernen',
                                        handler: function () {
                                            _this.deleteFoodFromCalendar(day, food);
                                            console.log('Confirm Okay');
                                        }
                                    }
                                ]
                            })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FoodCalendarPage.prototype.addFoodToCalendarDay = function (day) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.slidingList.closeSlidingItems();
                        return [4 /*yield*/, this.modalController.create({
                                component: food_selector_page_1.FoodSelectorPage,
                                componentProps: { day: day, }
                            })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FoodCalendarPage.prototype.changeFoodOfCalendarDay = function (day, food) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.slidingList.closeSlidingItems();
                        return [4 /*yield*/, this.modalController.create({
                                component: food_selector_page_1.FoodSelectorPage,
                                componentProps: { day: day, food: food }
                            })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FoodCalendarPage.prototype.deleteFoodFromCalendar = function (day, food) {
        this.foodCalendarService.deleteFoodFromCalendar(day, food)
            .then(function (result) {
            console.log("successfully deleted food from firestore");
        }).catch(function (error) {
            console.log("error. somethin went wrong deleting the food. Error: ", error);
        });
    };
    // TEMP METHOD TO FIX BROKEN SLIDING ITEM BUG
    FoodCalendarPage.prototype.closeSlidingItems = function () {
        this.slidingList.closeSlidingItems();
    };
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
    FoodCalendarPage.prototype.promptToAddFood = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("foodlist is null/empty");
                        return [4 /*yield*/, this.alertCtrl.create({
                                header: 'Keine Speisen vorhanden!',
                                message: 'Um mit der Wochenplanung beginnen zu können, musst du Speisen anlegen. Jetzt die erste Speise hinzufügen?',
                                buttons: [
                                    {
                                        text: 'Nein',
                                        handler: function () {
                                            console.log('Disagree clicked');
                                        }
                                    },
                                    {
                                        text: 'Ja',
                                        handler: function () {
                                            //  this.nav.push(FoodListPage);
                                            console.log('Agree clicked');
                                        }
                                    }
                                ]
                            })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FoodCalendarPage.prototype.ngOnDestroy = function () {
        if (this.currentWeekListSub) {
            this.currentWeekListSub.unsubscribe();
        }
        if (this.currentWeekNumberSub) {
            this.currentWeekNumberSub.unsubscribe();
        }
    };
    __decorate([
        core_1.ViewChild('slidingList'),
        __metadata("design:type", angular_1.List)
    ], FoodCalendarPage.prototype, "slidingList", void 0);
    FoodCalendarPage = __decorate([
        core_1.Component({
            selector: 'app-food-calendar',
            templateUrl: './food-calendar.page.html',
            styleUrls: ['./food-calendar.page.scss'],
        }),
        __metadata("design:paramtypes", [angular_1.AlertController,
            angular_1.ModalController,
            date_time_service_1.DateTimeService,
            food_calendar_service_1.FoodCalendarService])
    ], FoodCalendarPage);
    return FoodCalendarPage;
}());
exports.FoodCalendarPage = FoodCalendarPage;
//# sourceMappingURL=food-calendar.page.js.map