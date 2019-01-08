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
var operators_1 = require("rxjs/operators");
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
        this.foodList$ = this._foodList.asObservable();
        var firestore = firebase.firestore();
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        this.afFoodsCollectionRef = firebase.firestore().collection('foods');
        this.loadInitialData();
    }
    FoodService.prototype.loadInitialData = function () {
        var _this = this;
        this.getMyFoodList()
            .onSnapshot({ includeMetadataChanges: false }, function (snapshot) {
            var foodsFromFirestore = [];
            snapshot.forEach(function (food) {
                var currentFood = food.data();
                var recipe = {
                    condiments: currentFood.condiments,
                    preparation: currentFood.preparation,
                    duration: currentFood.duration
                };
                var foodObject = {
                    id: food.id,
                    title: currentFood.title,
                    description: currentFood.description,
                    owner: currentFood.owner,
                    subscriber: currentFood.subscriber,
                    category: currentFood.category,
                    recipe: recipe
                };
                foodsFromFirestore.push(foodObject);
            });
            _this._foodList.next(foodsFromFirestore);
            var source = snapshot.metadata.fromCache ? "local cache" : "server";
            console.log("CacheInfo: ", snapshot.metadata.fromCache + "\nData came from " + source);
        });
    };
    FoodService.prototype.getLatestFoodList = function () {
        return this._foodList.getValue();
    };
    FoodService.prototype.getFood = function (foodId) {
        return this.foodList$.pipe(operators_1.map(function (foodList) { return foodList.find(function (food) { return food.id === foodId; }); }));
    };
    /*********** F I R E S T O R E     R E Q U E S T S ***********/
    // GET ALL FOOD - DOCS WHERE OWNER = USER
    FoodService.prototype.getMyFoodList = function () {
        return this.afFoodsCollectionRef.where('owner', '==', this.authService.getUserId());
    };
    // GET SINGLE FOOD - DETAILS
    FoodService.prototype.getFoodDetail = function (foodId) {
        return this.afFoodsCollectionRef.doc(foodId);
    };
    // CREATE FOOD (all properties)
    FoodService.prototype.createFood = function (food) {
        //TODO
        var newFoodId = this.afFireStore.createId();
        return this.afFireStore.doc('foods/' + newFoodId).set({
            owner: food.owner,
            title: food.title,
            description: food.description,
            category: food.category,
            subscriber: food.subscriber,
            preparation: food.recipe.preparation,
            condiments: food.recipe.condiments,
            duration: food.recipe.duration
        });
    };
    // CREATE FOOD (by title only)
    FoodService.prototype.createFoodByTitleOnly = function (foodTitle) {
        var newFoodId = this.afFireStore.createId();
        console.log("created food id: ", newFoodId);
        var recipe = {
            preparation: null,
            condiments: null,
            duration: null
        };
        var food = {
            id: null,
            title: foodTitle,
            description: null,
            owner: this.authService.getUserId(),
            subscriber: null,
            category: null,
            recipe: recipe
        };
        return this.afFoodsCollectionRef.doc(newFoodId).set({
            //return this.afFireStore.doc('foods/'+ newFoodId).set({      
            owner: food.owner,
            title: food.title,
            description: food.description,
            subscriber: food.subscriber,
            category: food.category,
            recipie: food.recipe,
            preparation: food.recipe.preparation,
            condiments: food.recipe.condiments,
            duration: food.recipe.duration
        });
    };
    // DELETE FOOD
    FoodService.prototype.deleteFood = function (foodId) {
        return this.afFoodsCollectionRef.doc(foodId).delete();
    };
    // UPDATE FOOD
    FoodService.prototype.updateFood = function (food) {
        console.log("update food: ", food);
        return this.afFoodsCollectionRef.doc(food.id).update({
            title: food.title,
            description: food.description,
            category: food.category,
            subscriber: food.subscriber,
            preparation: food.recipe.preparation,
            condiments: food.recipe.condiments,
            duration: food.recipe.duration
        });
    };
    // UDPATE TITLE OF FOOD
    FoodService.prototype.updateFoodName = function (food) {
        return this.afFireStore.collection('foods').doc(food.id).update({
            title: food.title
        });
    };
    FoodService.prototype.updateFoodCategories = function (food) {
        return this.afFoodsCollectionRef.doc(food.id).update({
            category: food.category
        });
    };
    FoodService.prototype.updateRecipe = function (food) {
        return this.afFoodsCollectionRef.doc(food.id).update({
            preparation: food.recipe.preparation,
            condiments: food.recipe.condiments,
            duration: food.recipe.duration
        });
    };
    FoodService.prototype.getFoodCategories = function () {
        return this.afFireStore.collection('foodCategories').get().toPromise();
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