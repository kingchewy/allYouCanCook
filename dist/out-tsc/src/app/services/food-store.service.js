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
var food_service_1 = require("./food.service");
var rxjs_1 = require("rxjs");
var FoodStoreService = /** @class */ (function () {
    function FoodStoreService(foodservice) {
        this.foodservice = foodservice;
        this._foodList = new rxjs_1.BehaviorSubject([]);
        // use or subscribe this List in all components 
        // in the APP to get a stream of a users Foods
        this.foodList = this._foodList.asObservable();
        //this.loadInitialData();
    }
    FoodStoreService.prototype.loadInitialData = function () {
        var _this = this;
        this.foodservice.getMyFoodList()
            .onSnapshot(function (snapshot) {
            var foodsFromFirestore = [];
            snapshot.forEach(function (food) {
                var currentFood = food.data();
                var foodObject = {
                    id: food.id,
                    title: currentFood.title,
                    owner: currentFood.owner,
                    subscriber: currentFood.subscriber,
                    category: currentFood.category,
                    recipie: currentFood.recipie
                };
                foodsFromFirestore.push(foodObject);
            });
            _this._foodList.next(foodsFromFirestore);
        });
    };
    FoodStoreService.prototype.getLatestFoodList = function () {
        return this._foodList.getValue();
    };
    FoodStoreService.prototype.createFood = function (food) {
        var observer = new rxjs_1.Observable(function (observer) {
        });
        var obs = this.foodservice.createFood(food)
            .then(function () {
            return new rxjs_1.Observable(function (observer) { observer.next('Food successfully written!'); });
        })
            .catch(function () {
        });
        return observer;
    };
    FoodStoreService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [food_service_1.FoodService])
    ], FoodStoreService);
    return FoodStoreService;
}());
exports.FoodStoreService = FoodStoreService;
//# sourceMappingURL=food-store.service.js.map