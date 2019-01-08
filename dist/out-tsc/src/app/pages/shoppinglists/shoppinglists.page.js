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
var shoppinglist_service_1 = require("../../services/shoppinglist.service");
var angular_1 = require("@ionic/angular");
var auth_service_1 = require("../../services/user/auth.service");
var profile_service_1 = require("../../services/user/profile.service");
var ShoppinglistsPage = /** @class */ (function () {
    function ShoppinglistsPage(shoppingListService, alertController, authService, userProfileService) {
        this.shoppingListService = shoppingListService;
        this.alertController = alertController;
        this.authService = authService;
        this.userProfileService = userProfileService;
    }
    ShoppinglistsPage.prototype.ngOnInit = function () {
        this.subscribeShoppingLists();
        this.subscribeUserProfile();
        this.userId = this.authService.getUserId();
    };
    ShoppinglistsPage.prototype.subscribeShoppingLists = function () {
        var _this = this;
        this.shoppingListSub = this.shoppingListService.shoppingLists$.subscribe(function (shoppingList$) {
            _this.shoppingLists = shoppingList$;
            console.log("shoppinglists from subcription: ", shoppingList$);
        });
    };
    ShoppinglistsPage.prototype.subscribeUserProfile = function () {
        var _this = this;
        this.userProfileSubscription = this.userProfileService.userProfile$
            .subscribe(function (userProfile) {
            console.log("subscription in ts: ", userProfile);
            if (userProfile !== null) {
                _this.userProfile = userProfile;
            }
        });
    };
    ShoppinglistsPage.prototype.createShoppingList = function (title) {
        this.closeSliders();
        this.shoppingListService.createShoppingList(title).then(function (data) {
            console.log("new shoppinglist created: ", data.id);
        }).catch(function (error) {
            console.log("error creating new shoppinglist: ", error);
        });
    };
    ShoppinglistsPage.prototype.deleteShoppingList = function (id) {
        this.shoppingListService.deleteShoppingList(id)
            .then(function () {
            console.log("Successfully deleted ShoppingList!");
        })
            .catch(function (error) {
            console.log("Error deleting ShoppingList: ", error);
        });
    };
    ShoppinglistsPage.prototype.renameShoppingList = function (shoppingList) {
        this.shoppingListService.renameShoppingList(shoppingList)
            .then(function () {
            console.log("Successfully renamed ShoppingList!");
        })
            .catch(function (error) {
            console.log("Error renaming ShoppingList: ", error);
        });
    };
    ShoppinglistsPage.prototype.alertAddShoppingList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.closeSliders();
                        return [4 /*yield*/, this.alertController.create({
                                header: 'Neue Einkaufsliste!',
                                inputs: [
                                    {
                                        name: 'shoppingListName',
                                        type: 'text',
                                        placeholder: 'Name'
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Abbrechen',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function () {
                                            console.log('Confirm Cancel');
                                        }
                                    }, {
                                        text: 'Ok',
                                        handler: function (input) {
                                            _this.createShoppingList(input.shoppingListName);
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
    ShoppinglistsPage.prototype.alertDeleteShoppingList = function (shoppingList) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.closeSliders();
                        return [4 /*yield*/, this.alertController.create({
                                header: 'Löschen!',
                                message: "Einkaufsliste <strong>" + shoppingList.title + "</strong> wirklich l\u00F6schen?",
                                buttons: [
                                    {
                                        text: 'Nein',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function () {
                                            console.log('Confirm Cancel');
                                        }
                                    }, {
                                        text: 'JA',
                                        handler: function () {
                                            _this.deleteShoppingList(shoppingList.id);
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
    ShoppinglistsPage.prototype.alertRenameShoppingList = function (shoppingList) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.closeSliders();
                        return [4 /*yield*/, this.alertController.create({
                                header: 'Neue Einkaufsliste!',
                                inputs: [
                                    {
                                        name: 'shoppingListName',
                                        type: 'text',
                                        placeholder: 'Name',
                                        value: shoppingList.title
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Abbrechen',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function () {
                                            console.log('Confirm Cancel');
                                        }
                                    }, {
                                        text: 'Ok',
                                        handler: function (input) {
                                            shoppingList.title = input.shoppingListName;
                                            _this.renameShoppingList(shoppingList);
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
    ShoppinglistsPage.prototype.addItemToShoppingList = function (inputField) {
        this.closeSliders();
        console.log("selected shoppinglist: ", this.selectedShoppingList);
        console.log("selected Item to Add: ", inputField);
        this.shoppingListService.addItemToShoppingList(inputField.value, this.selectedShoppingList.id)
            .then(function () {
            console.log("Item successfully added to shoppingList");
            inputField.value = null;
        })
            .catch(function (error) {
            console.log("Something went wrong adding Item to ShoppingList: ", error);
        });
    };
    ShoppinglistsPage.prototype.share = function (item) {
        this.closeSliders();
    };
    ShoppinglistsPage.prototype.closeSliders = function () {
        this.slidingList.closeSlidingItems();
    };
    ShoppinglistsPage.prototype.ionViewWillLeave = function () {
        console.log("view leave");
        this.slidingList.closeSlidingItems().then(function () {
            console.log("successfully closed sliding items.");
        }).catch(function (error) {
            console.log("Error while closing slidingItems:");
        });
    };
    ShoppinglistsPage.prototype.ngOnDestroy = function () {
        if (this.shoppingListSub) {
            this.shoppingListSub.unsubscribe();
        }
    };
    __decorate([
        core_1.ViewChild('slidingList'),
        __metadata("design:type", angular_1.List)
    ], ShoppinglistsPage.prototype, "slidingList", void 0);
    ShoppinglistsPage = __decorate([
        core_1.Component({
            selector: 'app-shoppinglists',
            templateUrl: './shoppinglists.page.html',
            styleUrls: ['./shoppinglists.page.scss'],
        }),
        __metadata("design:paramtypes", [shoppinglist_service_1.ShoppinglistService,
            angular_1.AlertController,
            auth_service_1.AuthService,
            profile_service_1.ProfileService])
    ], ShoppinglistsPage);
    return ShoppinglistsPage;
}());
exports.ShoppinglistsPage = ShoppinglistsPage;
//# sourceMappingURL=shoppinglists.page.js.map