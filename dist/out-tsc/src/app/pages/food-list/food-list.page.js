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
var food_service_1 = require("../../services/food.service");
var angular_1 = require("@ionic/angular");
var auth_guard_1 = require("../../services/user/auth.guard");
var FoodListPage = /** @class */ (function () {
    function FoodListPage(foodService, authguard, loadingCtrl, alertCtrl, toastCtrl) {
        this.foodService = foodService;
        this.authguard = authguard;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.order = 'title'; // OrderPipe Attribute in HTML (by title)
    }
    FoodListPage.prototype.ngOnInit = function () {
        console.log("onInit");
        this.getFoods();
    };
    /*  *******************    F O O D S E R V I C E    M E T H O D S    ******************** */
    FoodListPage.prototype.getFoods = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loading;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create()];
                    case 1:
                        loading = _a.sent();
                        this.getFoodsSub = this.foodService.foodList.subscribe(function (list) {
                            _this.foodList = list;
                            loading.dismiss();
                        });
                        return [4 /*yield*/, loading.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ADD FOOD via FOODSERVICE
    FoodListPage.prototype.addFoodByTitle = function (food) {
        return __awaiter(this, void 0, void 0, function () {
            var loading, newFood;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create()];
                    case 1:
                        loading = _a.sent();
                        if (this.isFoodTwice(food) == false) {
                            newFood = {
                                id: null,
                                title: food.title,
                                owner: this.authguard.userId,
                                subscriber: null,
                                category: null,
                                recipie: null
                            };
                            this.foodService.createFood(newFood)
                                .then(function (data) {
                                console.log("Food successfully updated! => ", data);
                                loading.dismiss();
                            })
                                .catch(function (error) {
                                console.log("Error updating food => ", error);
                                loading.dismiss();
                            });
                        }
                        else {
                            console.log("ist schon in der liste");
                            this.presentToastItemTwice();
                        }
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // UPDATE FOOD via FOODSERVICE
    FoodListPage.prototype.updateFoodTitle = function (food, newFoodTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var loading;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create()];
                    case 1:
                        loading = _a.sent();
                        this.foodService.updateFood(food, newFoodTitle)
                            .then(function (data) {
                            console.log("Food successfully updated! => ", data);
                            loading.dismiss();
                        })
                            .catch(function (error) {
                            console.log("Error updating food => ", error);
                            loading.dismiss();
                        });
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // DELETE FOOD via FOODSERVICE
    FoodListPage.prototype.deleteFood = function (food) {
        return __awaiter(this, void 0, void 0, function () {
            var loading;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create()];
                    case 1:
                        loading = _a.sent();
                        this.foodService.deleteFood(food)
                            .then(function () {
                            console.log("Food successfully deleted!");
                            loading.dismiss();
                        }).catch(function (error) {
                            loading.dismiss();
                            console.error("Error removing document: ", error);
                        });
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*  ********************    A L E R T S    ********************* */
    // ADD new FOOD
    FoodListPage.prototype.alertAddFood = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.slidingList.closeSlidingItems();
                        return [4 /*yield*/, this.alertCtrl.create({
                                header: 'Neue Speise hinzufügen',
                                //message: 'Wie soll der Titel deiner neuen Speise lauten?',
                                inputs: [
                                    {
                                        name: 'title',
                                        placeholder: 'Name'
                                    },
                                ],
                                buttons: [
                                    {
                                        text: 'Abbruch',
                                        handler: function () {
                                            console.log('Cancel clicked');
                                        }
                                    },
                                    {
                                        text: 'OK',
                                        handler: function (food) {
                                            _this.addFoodByTitle(food);
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
    // UPDATE FOOD
    FoodListPage.prototype.alertUpdateFood = function (slidingItem, food) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: 'Bearbeite Name',
                            inputs: [{
                                    name: 'title',
                                    value: food.title
                                }],
                            buttons: [
                                {
                                    text: 'Abbrechen',
                                    handler: function (closeSlider) {
                                        slidingItem.close();
                                    }
                                },
                                {
                                    text: 'Speichern',
                                    handler: function (foodToUpdate) {
                                        slidingItem.close();
                                        _this.updateFoodTitle(food, foodToUpdate.title);
                                    }
                                }
                            ]
                        })];
                    case 1:
                        prompt = _a.sent();
                        return [4 /*yield*/, prompt.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // DELETE FOOD
    FoodListPage.prototype.alertDeleteFood = function (slidingItem, food) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: 'Lösche Speise',
                            message: 'Willst du wirklich die Speise permanent aus deiner Liste entfernen?',
                            //enableBackdropDismiss: false,
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
                                        slidingItem.close();
                                        _this.deleteFood(food);
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
    /*  ********************    M E T H O D S     ********************* */
    // SEARCH - FUNCTION
    FoodListPage.prototype.searchFoods = function (ev) {
        var _this = this;
        if (this.foodList.length > 0) {
            this.slidingList.closeSlidingItems();
        }
        this.foodService.getMyFoodList().onSnapshot(function (snapshot) {
            _this.foodList = [];
            snapshot.forEach(function (doc) {
                var docData = doc.data();
                var food = {
                    id: doc.id,
                    title: docData.title,
                    owner: docData.owner,
                    subscriber: docData.subscriber,
                    category: docData.category,
                    recipie: docData.recipie
                };
                _this.foodList.push(food);
                console.log("getFoods methode. pushed Food = ", food);
                // set val to the value of the searchbar
                var val = ev.target.value;
                // if the value is an empty string don't filter the items
                if (_this.foodList) {
                    if (val && val.trim() !== '') {
                        _this.foodList = _this.foodList.filter(function (food) {
                            console.log(food);
                            return food.title.toLowerCase().includes(val.toLowerCase());
                        });
                    }
                }
            });
        });
    };
    FoodListPage.prototype.searchFoods2 = function (ev) {
        this.foodList = this.foodService.getLatestFoodList();
        // set val to the value of the searchbar
        var val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (this.foodList) {
            if (val && val.trim() !== '') {
                this.foodList = this.foodList.filter(function (food) {
                    console.log(food);
                    return food.title.toLowerCase().includes(val.toLowerCase());
                });
            }
        }
    };
    // ADD FOOD HANDLER Method, to check if Food to Add is already in DB
    FoodListPage.prototype.isFoodTwice = function (food) {
        var isTwice = false;
        this.foodList.forEach(function (element) {
            if (element.title == food.title) {
                isTwice = true;
            }
        });
        return isTwice;
    };
    // ADD FOOD HANDLER Method, to let User know that Food is already in List
    FoodListPage.prototype.presentToastItemTwice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastCtrl.create({
                            message: 'Speise bereits in deiner Liste vorhanden!',
                            duration: 2000,
                            position: 'middle'
                        })];
                    case 1:
                        toast = _a.sent();
                        return [4 /*yield*/, toast.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // TEMP METHODS TO FIX BROKEN SLIDING ITEM BUG
    FoodListPage.prototype.ionViewWillLeave = function () {
        console.log("view leave");
        this.slidingList.closeSlidingItems().then(function () {
            console.log("successfully closed sliding items.");
        }).catch(function (error) {
            console.log("Error while closing slidingItems:");
        });
    };
    // TEMP METHOD TO FIX BROKEN SLIDING ITEM BUG
    FoodListPage.prototype.closeSlidingItems = function () {
        this.slidingList.closeSlidingItems();
    };
    FoodListPage.prototype.ngOnDestroy = function () {
        console.log("view destroyed");
        this.getFoodsSub.unsubscribe();
    };
    __decorate([
        core_1.ViewChild('slidingList'),
        __metadata("design:type", angular_1.List)
    ], FoodListPage.prototype, "slidingList", void 0);
    FoodListPage = __decorate([
        core_1.Component({
            selector: 'app-food-list',
            templateUrl: './food-list.page.html',
            styleUrls: ['./food-list.page.scss'],
        }),
        __metadata("design:paramtypes", [food_service_1.FoodService,
            auth_guard_1.AuthGuard,
            angular_1.LoadingController,
            angular_1.AlertController,
            angular_1.ToastController])
    ], FoodListPage);
    return FoodListPage;
}());
exports.FoodListPage = FoodListPage;
//# sourceMappingURL=food-list.page.js.map