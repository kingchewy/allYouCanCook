"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var owner_of_shoppinglist_pipe_1 = require("./owner-of-shoppinglist.pipe");
var shared_shoppinglist_pipe_1 = require("./shared-shoppinglist.pipe");
var uid_to_friends_name_pipe_1 = require("./uid-to-friends-name.pipe");
var PipesModule = /** @class */ (function () {
    function PipesModule() {
    }
    PipesModule = __decorate([
        core_1.NgModule({
            declarations: [
                owner_of_shoppinglist_pipe_1.OwnerOfShoppinglistPipe,
                shared_shoppinglist_pipe_1.SharedShoppinglistPipe,
                uid_to_friends_name_pipe_1.UidToFriendsNamePipe,
            ],
            imports: [],
            exports: [
                owner_of_shoppinglist_pipe_1.OwnerOfShoppinglistPipe,
                shared_shoppinglist_pipe_1.SharedShoppinglistPipe,
                uid_to_friends_name_pipe_1.UidToFriendsNamePipe
            ]
        })
    ], PipesModule);
    return PipesModule;
}());
exports.PipesModule = PipesModule;
//# sourceMappingURL=pipes.module.js.map