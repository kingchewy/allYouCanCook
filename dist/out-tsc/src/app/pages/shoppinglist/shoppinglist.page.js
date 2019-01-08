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
var router_1 = require("@angular/router");
var shoppinglist_service_1 = require("../../services/shoppinglist.service");
var common_1 = require("@angular/common");
var angular_1 = require("@ionic/angular");
var ShoppinglistPage = /** @class */ (function () {
    function ShoppinglistPage(_location, route, shoppingListService, toastController) {
        this._location = _location;
        this.route = route;
        this.shoppingListService = shoppingListService;
        this.toastController = toastController;
        this.newShoppingItem = "";
        this.reorder = false;
        this.reorderedItemsUnsaved = false;
    }
    ShoppinglistPage.prototype.ngOnInit = function () {
        this.subscribeShoppingList();
    };
    ShoppinglistPage.prototype.subscribeShoppingList = function () {
        var _this = this;
        var shoppingListId = this.route.snapshot.paramMap.get('id');
        this.shoppingListSub = this.shoppingListService.getShoppingList(shoppingListId)
            .subscribe(function (shoppingList) {
            _this.shoppingList = shoppingList;
            console.log("interessant wirds jetzt: ", shoppingList);
        });
    };
    ShoppinglistPage.prototype.addShoppingListItem = function () {
        var _this = this;
        this.shoppingListService.addItemToShoppingList(this.newShoppingItem, this.shoppingList.id)
            .then(function () {
            _this.newShoppingItem = "";
            console.log("Item successfully added to ShoppingList ", _this.shoppingList.title, "!");
        })
            .catch(function (error) {
            console.log("Error adding Item to ShoppingList: ", error);
        });
    };
    ShoppinglistPage.prototype.updateShoppingListItems = function () {
        this.shoppingListService.updateShoppingListItems(this.shoppingList)
            .then(function (result) {
            console.log("ShoppingListItems successfully updated!");
        })
            .catch(function (error) {
            //TODO inform user about error.
            // option what to do?
            console.log("Error updating ShoppingListItems!");
        });
    };
    ShoppinglistPage.prototype.deleteUncheckedShoppingItem = function (item) {
        var _this = this;
        this.shoppingListService.removeUncheckedItemFromShoppingList(item, this.shoppingList)
            .then(function () {
            console.log("Successfully deleted UncheckedItem from ShoppingList ", _this.shoppingList.title, "!");
        })
            .catch(function (error) {
            console.log("Error deleting UncheckedItem from ShoppingList: ", error);
        });
    };
    ShoppinglistPage.prototype.deleteCheckedShoppingItem = function (item) {
        var _this = this;
        this.shoppingListService.removeCheckedItemFromShoppingList(item, this.shoppingList)
            .then(function () {
            console.log("Successfully deleted CheckedItem from ShoppingList ", _this.shoppingList.title, "!");
        })
            .catch(function (error) {
            console.log("Error deleting CheckedItem from ShoppingList: ", error);
        });
    };
    ShoppinglistPage.prototype.validateAndAddItem = function () {
        if (!this.isTwice()) {
            this.addShoppingListItem();
        }
        else {
            this.presentToastItemTwice();
            console.log("is twice");
        }
    };
    ShoppinglistPage.prototype.moveToDone = function (item, itemIndex) {
        this.shoppingList.itemsUnchecked.splice(itemIndex, 1);
        this.shoppingList.itemsChecked.push(item);
        this.updateShoppingListItems();
    };
    ShoppinglistPage.prototype.moveToUndone = function (item, itemIndex) {
        this.shoppingList.itemsChecked.splice(itemIndex, 1);
        this.shoppingList.itemsUnchecked.push(item);
        this.updateShoppingListItems();
    };
    ShoppinglistPage.prototype.isTwice = function () {
        if (this.getCheckedItem() || this.getUncheckedItem()) {
            return true;
        }
        return false;
    };
    ShoppinglistPage.prototype.getUncheckedItem = function () {
        var _this = this;
        return this.shoppingList.itemsUnchecked.find(function (item) { return _this.newShoppingItem == item; });
    };
    ShoppinglistPage.prototype.getCheckedItem = function () {
        var _this = this;
        return this.shoppingList.itemsChecked.find(function (item) { return _this.newShoppingItem == item; });
    };
    ShoppinglistPage.prototype.presentToastItemTwice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: this.newShoppingItem + " bereits in der Einkaufsliste.",
                            duration: 2000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShoppinglistPage.prototype.toggleReOrder = function () {
        this.reorderedItemsUnsaved = !this.reorderedItemsUnsaved;
        this.htmlReorderGroup.disabled = !this.htmlReorderGroup.disabled;
    };
    ShoppinglistPage.prototype.reorderUncheckedItems = function (ev) {
        this.reorderedItemsUnsaved = true;
        var itemToMove = this.shoppingList.itemsUnchecked.splice(ev.detail.from, 1)[0];
        this.shoppingList.itemsUnchecked.splice(ev.detail.to, 0, itemToMove);
    };
    // MAYBE DISABLE LATER
    ShoppinglistPage.prototype.reorderCheckedItems = function (ev) {
        //this.reorderedItemsUnsaved = true;
        var itemToMove = this.shoppingList.itemsChecked.splice(ev.detail.from, 1)[0];
        this.shoppingList.itemsChecked.splice(ev.detail.to, 0, itemToMove);
    };
    ShoppinglistPage.prototype.saveItemsOnReorder = function () {
        this.updateShoppingListItems();
        this.reorderedItemsUnsaved = false;
        this.htmlReorderGroup.disabled = true;
    };
    ShoppinglistPage.prototype.goBack = function () {
        if (this.shoppingListSub) {
            this.shoppingListSub.unsubscribe();
        }
        this._location.back();
    };
    ShoppinglistPage.prototype.ngOnDestroy = function () {
        if (this.shoppingListSub) {
            this.shoppingListSub.unsubscribe();
        }
    };
    __decorate([
        core_1.ViewChild('reorderGroup'),
        __metadata("design:type", angular_1.ReorderGroup)
    ], ShoppinglistPage.prototype, "htmlReorderGroup", void 0);
    ShoppinglistPage = __decorate([
        core_1.Component({
            selector: 'app-shoppinglist',
            templateUrl: './shoppinglist.page.html',
            styleUrls: ['./shoppinglist.page.scss'],
        }),
        __metadata("design:paramtypes", [common_1.Location,
            router_1.ActivatedRoute,
            shoppinglist_service_1.ShoppinglistService,
            angular_1.ToastController])
    ], ShoppinglistPage);
    return ShoppinglistPage;
}());
exports.ShoppinglistPage = ShoppinglistPage;
//# sourceMappingURL=shoppinglist.page.js.map