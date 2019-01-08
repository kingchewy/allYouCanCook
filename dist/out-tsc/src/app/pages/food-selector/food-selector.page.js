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
var angular_1 = require("@ionic/angular");
var food_service_1 = require("../../services/food.service");
var food_calendar_service_1 = require("../../services/food-calendar.service");
var FoodSelectorPage = /** @class */ (function () {
    function FoodSelectorPage(navParams, modalController, foodservice, foodcalendarservice) {
        this.navParams = navParams;
        this.modalController = modalController;
        this.foodservice = foodservice;
        this.foodcalendarservice = foodcalendarservice;
        this.foodToChange = false;
    }
    FoodSelectorPage.prototype.ngOnInit = function () {
        if (this.navParams.get('food')) {
            this.selectedFood = this.navParams.get('food');
            this.foodToChange = true;
        }
        this.day = this.navParams.get('day');
        console.log("day in modal: ", this.day);
        this.getFoodList();
    };
    FoodSelectorPage.prototype.getFoodList = function () {
        this.foodList = this.foodservice.getLatestFoodList();
    };
    FoodSelectorPage.prototype.closeSelector = function () {
        this.modalController.dismiss();
    };
    FoodSelectorPage.prototype.addFood = function () {
        if (this.day.foods == null) {
            this.day.foods = [this.selectedFood];
            console.log("food added on empty Array in day: ", this.day);
        }
        else {
            this.day.foods.push(this.selectedFood);
            console.log("foodDay after adding Food to existing array: ", this.day);
        }
        this.requestAddFoodToCalendar();
        this.modalController.dismiss();
    };
    FoodSelectorPage.prototype.changeFood = function () {
        var _this = this;
        var foodToChange = this.navParams.get('food');
        this.day.foods.forEach(function (food, index) {
            if (food.id == foodToChange.id) {
                _this.day.foods.splice(index, 1);
            }
        });
        this.day.foods.push(this.selectedFood);
        this.requestAddFoodToCalendar();
        this.modalController.dismiss();
    };
    FoodSelectorPage.prototype.requestAddFoodToCalendar = function () {
        this.foodcalendarservice.addFoodToCalendar(this.day)
            .then(function (result) {
            console.log("success adding food to firestore: ", result);
        }).catch(function (error) {
            console.log("error. something went wrong adding the food. Error: ", error);
        });
    };
    FoodSelectorPage.prototype.selectedFoodButton = function () {
        console.log("selected Food: ", this.selectedFood);
    };
    FoodSelectorPage.prototype.promptNoFoodSelected = function () {
        console.log("no food selected!");
    };
    FoodSelectorPage = __decorate([
        core_1.Component({
            selector: 'app-food-selector',
            templateUrl: './food-selector.page.html',
            styleUrls: ['./food-selector.page.scss'],
        }),
        __metadata("design:paramtypes", [angular_1.NavParams,
            angular_1.ModalController,
            food_service_1.FoodService,
            food_calendar_service_1.FoodCalendarService])
    ], FoodSelectorPage);
    return FoodSelectorPage;
}());
exports.FoodSelectorPage = FoodSelectorPage;
//# sourceMappingURL=food-selector.page.js.map