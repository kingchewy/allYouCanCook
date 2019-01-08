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
var rxjs_1 = require("rxjs");
var firebase = require("firebase/app");
var firestore_1 = require("@angular/fire/firestore");
var auth_guard_1 = require("./user/auth.guard");
var auth_service_1 = require("./user/auth.service");
var auth_1 = require("@angular/fire/auth");
var operators_1 = require("rxjs/operators");
var ShoppinglistService = /** @class */ (function () {
    function ShoppinglistService(afFireStore, authService, afAuth, authguard) {
        this.afFireStore = afFireStore;
        this.authService = authService;
        this.afAuth = afAuth;
        this.authguard = authguard;
        this._shoppingLists = new rxjs_1.BehaviorSubject([]);
        this.shoppingLists$ = this._shoppingLists.asObservable();
        var firestore = firebase.firestore();
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        this.refShoppingLists = firebase.firestore().collection('shoppingLists');
        this.loadInitialShoppingLists();
    }
    ShoppinglistService.prototype.loadInitialShoppingLists = function () {
        var _this = this;
        // ROLES:
        // 1 = owner
        // 2 = read
        // 3 = write
        // request all shoppingLists(doc's), where userId has role 1, 2, or 3
        this.refShoppingLists.where('roles.' + this.authService.getUserId(), '<=', 3)
            .onSnapshot(function (snapshot) {
            var shoppingListsFromFirestore = [];
            snapshot.forEach(function (list) {
                var currentList = list.data();
                var shoppingListObject = {
                    id: list.id,
                    owner: currentList.owner,
                    title: currentList.title,
                    itemsUnchecked: currentList.itemsUnchecked,
                    itemsChecked: currentList.itemsChecked,
                    roles: currentList.roles
                };
                shoppingListsFromFirestore.push(shoppingListObject);
            });
            _this._shoppingLists.next(shoppingListsFromFirestore);
        });
    };
    ShoppinglistService.prototype.createShoppingList = function (title) {
        var userId = this.authService.getUserId();
        var roleObject = {};
        roleObject[userId] = 1; // 1 = "owner"
        //let newShoppingList = this.refShoppingLists.add();
        return this.refShoppingLists.add({
            owner: userId,
            title: title,
            roles: roleObject,
            itemsChecked: [],
            itemsUnchecked: []
        });
        /*     return firebase.firestore().collection('shoppingLists').doc().set({
              title: 'Merkur',
              roles: roleObject,
              itemsChecked: ['Seife', 'Apfel', 'Fleisch'],
              itemsUnchecked: ['Kaugummi', 'Zahnpasta']
            }) */
    };
    ShoppinglistService.prototype.shareShoppingListWithFriend = function (shoppingList, userId) {
        var shoppingListRef = this.refShoppingLists.doc(shoppingList.id);
        var roleObject = {};
        roleObject[userId] = 3;
        return shoppingListRef.update({
            roles: roleObject
        });
    };
    ShoppinglistService.prototype.getShoppingList = function (id) {
        return this.shoppingLists$.pipe(operators_1.map(function (shoppingListArray) { return shoppingListArray.find(function (list) { return list.id === id; }); }));
    };
    ShoppinglistService.prototype.deleteShoppingList = function (id) {
        return this.refShoppingLists.doc(id).delete();
    };
    ShoppinglistService.prototype.renameShoppingList = function (shoppingList) {
        console.log(shoppingList.title);
        var shoppingListRef = this.refShoppingLists.doc("" + shoppingList.id);
        return shoppingListRef.update({
            title: shoppingList.title
        });
    };
    ShoppinglistService.prototype.addItemToShoppingList = function (item, shoppingListId) {
        var shoppingListRef = this.refShoppingLists.doc("" + shoppingListId);
        return shoppingListRef.update({
            itemsUnchecked: firebase.firestore.FieldValue.arrayUnion("" + item)
        });
    };
    ShoppinglistService.prototype.removeCheckedItemFromShoppingList = function (item, shoppingList) {
        var shoppingListRef = this.refShoppingLists.doc("" + shoppingList.id);
        return shoppingListRef.update({
            itemsChecked: firebase.firestore.FieldValue.arrayRemove("" + item)
        });
    };
    ShoppinglistService.prototype.removeUncheckedItemFromShoppingList = function (item, shoppingList) {
        var shoppingListRef = this.refShoppingLists.doc("" + shoppingList.id);
        return shoppingListRef.update({
            itemsUnchecked: firebase.firestore.FieldValue.arrayRemove("" + item)
        });
    };
    ShoppinglistService.prototype.updateShoppingListItems = function (shoppingList) {
        var shoppingListRef = this.refShoppingLists.doc("" + shoppingList.id);
        return shoppingListRef.update({
            itemsUnchecked: shoppingList.itemsUnchecked,
            itemsChecked: shoppingList.itemsChecked
        });
    };
    ShoppinglistService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
        // S H O P P I N G L I S T S
        ,
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            auth_service_1.AuthService,
            auth_1.AngularFireAuth,
            auth_guard_1.AuthGuard])
    ], ShoppinglistService);
    return ShoppinglistService;
}());
exports.ShoppinglistService = ShoppinglistService;
//# sourceMappingURL=shoppinglist.service.js.map