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
var firestore_1 = require("@angular/fire/firestore");
var auth_service_1 = require("./user/auth.service");
var firebase = require("firebase/app");
var auth_1 = require("@angular/fire/auth");
var rxjs_1 = require("rxjs");
var auth_guard_1 = require("./user/auth.guard");
var FoodService = /** @class */ (function () {
    function FoodService(afFireStore, authService, afAuth, authguard) {
        this.afFireStore = afFireStore;
        this.authService = authService;
        this.afAuth = afAuth;
        this.authguard = authguard;
        // FOODS
        this._foodList = new rxjs_1.BehaviorSubject([]);
        // use or subscribe this List in all components 
        // in the APP to get a stream of a users Foods
        this.foodList = this._foodList.asObservable();
        var firestore = firebase.firestore();
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        this.afFoodsCollectionRef = firebase.firestore().collection('foods');
        this.loadInitialData();
    }
    FoodService.prototype.loadInitialData = function () {
        var _this = this;
        this.getMyFoodList()
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
    FoodService.prototype.getLatestFoodList = function () {
        return this._foodList.getValue();
    };
    /*********** F I R E S T O R E     R E Q U E S T S ***********/
    // GET ALL FOOD - DOCS WHERE OWNER = USER
    FoodService.prototype.getMyFoodList = function () {
        return this.afFoodsCollectionRef.where('owner', '==', this.authguard.userId);
    };
    // GET SINGLE FOOD - DETAILS
    FoodService.prototype.getFoodDetail = function (foodId) {
        return this.afFoodsCollectionRef.doc(foodId);
    };
    // CREATE FOOD
    FoodService.prototype.createFood = function (food) {
        //TODO
        var newFoodId = this.afFireStore.createId();
        return this.afFireStore.doc('foods/' + newFoodId).set({
            owner: food.owner,
            title: food.title,
            category: food.category,
            subscriber: food.subscriber,
            recipie: food.recipie
        });
    };
    // DELETE FOOD
    FoodService.prototype.deleteFood = function (foodId) {
        return this.afFoodsCollectionRef.doc(foodId).delete();
    };
    // UPDATE FOOD
    FoodService.prototype.updateFood = function (food, newFoodTitle) {
        var foodTitle = newFoodTitle;
        console.log("update food: ", food);
        return this.afFireStore.collection('foods').doc(food.id).update({
            title: foodTitle,
            category: food.category,
            subscriber: food.subscriber,
            recipie: food.recipie
        });
    };
    FoodService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            auth_service_1.AuthService,
            auth_1.AngularFireAuth,
            auth_guard_1.AuthGuard])
    ], FoodService);
    return FoodService;
}());
exports.FoodService = FoodService;
//# sourceMappingURL=food.service.js.map