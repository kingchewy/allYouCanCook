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
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var storage_1 = require("@angular/fire/storage");
var angular_1 = require("@ionic/angular");
var ngx_1 = require("@ionic-native/camera/ngx");
var firebase = require("firebase/app");
var FoodDetailsPage = /** @class */ (function () {
    function FoodDetailsPage(_location, route, foodService, storage, alertController, camera) {
        this._location = _location;
        this.route = route;
        this.foodService = foodService;
        this.storage = storage;
        this.alertController = alertController;
        this.camera = camera;
        this.preparationToEdit = null;
        this.condimentsToEdit = null;
        this.titleToEdit = null;
        this.subtitleToEdit = null;
        this.showEditPreparation = false;
        this.showEditCondiments = false;
        this.showEditTitleSubtitle = false;
        this.foodCategories = [];
        this.initializeData();
        this.storageRef = firebase.storage().ref();
    }
    FoodDetailsPage.prototype.ngOnInit = function () {
    };
    FoodDetailsPage.prototype.initializeData = function () {
        var foodId = this.route.snapshot.paramMap.get('id');
        this.subscribeFood(foodId);
        this.loadFoodsImage(foodId);
        this.getFoodCategories();
    };
    FoodDetailsPage.prototype.subscribeFood = function (foodId) {
        var _this = this;
        this.foodSub = this.foodService.getFood(foodId)
            .subscribe(function (food) {
            _this.food = food;
        });
    };
    FoodDetailsPage.prototype.loadFoodsImage = function (foodId) {
        var _this = this;
        var ref = this.storage.ref("foods/" + foodId + ".jpg");
        ref.getDownloadURL().subscribe(function (url) {
            _this.foodImagePath = url;
        });
    };
    FoodDetailsPage.prototype.getFoodCategories = function () {
        var _this = this;
        this.foodService.getFoodCategories().then(function (categories) {
            categories.forEach(function (category) {
                console.log(category.data());
                _this.foodCategories.push(category.data().name);
            });
        });
    };
    FoodDetailsPage.prototype.updateFoodData = function () {
        this.foodService.updateFood(this.food).then(function () {
            console.log("food successfully updated");
        });
    };
    FoodDetailsPage.prototype.isFoodChecked = function (category) {
        if (!this.food.category) {
            return false;
        }
        //console.log(this.food.category[category])
        return this.food.category.includes(category);
    };
    FoodDetailsPage.prototype.loadInputCategories = function () {
        var _this = this;
        var input = [];
        this.foodCategories.forEach(function (category) {
            var categoryObject = {
                name: category,
                type: 'checkbox',
                label: category,
                value: category,
                checked: _this.isFoodChecked(category)
            };
            input.push(categoryObject);
        });
        return input;
    };
    FoodDetailsPage.prototype.presentChooseCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Kategorien wählen',
                            inputs: this.loadInputCategories(),
                            buttons: [
                                {
                                    text: 'abbrechen',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function () {
                                        console.log('Confirm Cancel');
                                    }
                                }, {
                                    text: 'Ok',
                                    handler: function (selectedCategories) {
                                        _this.setCategories(selectedCategories);
                                        console.log('Confirm Ok, with data -> ', selectedCategories);
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
    FoodDetailsPage.prototype.editTitleSubtitle = function () {
        var title = this.food.title;
        this.titleToEdit = title;
        if (this.food.description) {
            var subtitle = this.food.description;
            this.subtitleToEdit = subtitle;
        }
        else {
            this.subtitleToEdit = "";
        }
        this.showEditTitleSubtitle = true;
    };
    FoodDetailsPage.prototype.saveTitleSubtitle = function () {
        this.food.title = this.titleToEdit;
        this.food.description = this.subtitleToEdit;
        this.updateFoodData();
        this.titleToEdit = null;
        this.subtitleToEdit = null;
        this.showEditTitleSubtitle = false;
    };
    FoodDetailsPage.prototype.cancelEditingTitleSubtitle = function () {
        this.subtitleToEdit = null;
        this.titleToEdit = null;
        this.showEditTitleSubtitle = false;
    };
    FoodDetailsPage.prototype.setCategories = function (selectedCategories) {
        this.food.category = selectedCategories;
        this.foodService.updateFoodCategories(this.food).then(function () {
            console.log("successfully updated categories!");
        });
    };
    FoodDetailsPage.prototype.editPreparation = function () {
        //console.log("edit preparation: ", this.food.recipe.preparation)
        if (this.food.recipe.preparation) {
            var preparation = this.food.recipe.preparation;
            this.preparationToEdit = preparation;
        }
        else {
            console.log("preparation = null");
            this.preparationToEdit = '';
        }
        this.showEditPreparation = true;
    };
    FoodDetailsPage.prototype.savePreparation = function () {
        this.food.recipe.preparation = this.preparationToEdit;
        //console.log(this.food.recipe.preparation)
        this.updateRecipe(this.food);
        this.preparationToEdit = null;
        this.showEditPreparation = false;
    };
    FoodDetailsPage.prototype.cancelEditingPreparation = function () {
        this.preparationToEdit = null;
        this.showEditPreparation = false;
    };
    FoodDetailsPage.prototype.editCondiments = function () {
        var _this = this;
        this.condimentsToEdit = [];
        if (this.food.recipe.condiments) {
            this.food.recipe.condiments.forEach(function (condiment) {
                _this.condimentsToEdit.push(condiment);
            });
        }
        else {
        }
        this.showEditCondiments = true;
    };
    FoodDetailsPage.prototype.saveCondiments = function () {
        this.food.recipe.condiments = this.condimentsToEdit;
        console.log(this.condimentsToEdit);
        this.updateRecipe(this.food);
        this.condimentsToEdit = null;
        this.showEditCondiments = false;
    };
    FoodDetailsPage.prototype.updateRecipe = function (food) {
        this.foodService.updateRecipe(this.food)
            .then(function () {
            console.log("Recipe successfully updated!");
        });
    };
    FoodDetailsPage.prototype.cancelEditingCondiments = function () {
        this.condimentsToEdit = null;
        this.showEditCondiments = false;
    };
    FoodDetailsPage.prototype.addCondiment = function () {
        this.condimentsToEdit.push("");
    };
    FoodDetailsPage.prototype.takePicture = function () {
        var _this = this;
        var foodsImageRef = this.storageRef.child("foods/" + this.food.id + ".jpg");
        var options = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            var base64imageData = 'data:image/jpeg;base64,' + imageData;
            foodsImageRef.putString(base64imageData, 'data_url').then(function (snapshot) {
                console.log("updloaded image");
            });
            _this.foodImagePath = 'data:image/jpeg;base64,' + imageData;
            console.log(imageData);
        }, function (err) {
            // Handle error
        });
    };
    FoodDetailsPage.prototype.trackByFn = function (index, item) {
        return index;
    };
    FoodDetailsPage.prototype.goBack = function () {
        if (this.foodSub) {
            this.foodSub.unsubscribe();
        }
        this._location.back();
    };
    FoodDetailsPage = __decorate([
        core_1.Component({
            selector: 'app-food-details',
            templateUrl: './food-details.page.html',
            styleUrls: ['./food-details.page.scss'],
        }),
        __metadata("design:paramtypes", [common_1.Location,
            router_1.ActivatedRoute,
            food_service_1.FoodService,
            storage_1.AngularFireStorage,
            angular_1.AlertController,
            ngx_1.Camera])
    ], FoodDetailsPage);
    return FoodDetailsPage;
}());
exports.FoodDetailsPage = FoodDetailsPage;
//# sourceMappingURL=food-details.page.js.map