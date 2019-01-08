"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var UidToFriendsNamePipe = /** @class */ (function () {
    function UidToFriendsNamePipe() {
    }
    UidToFriendsNamePipe.prototype.transform = function (value, userProfile) {
        return userProfile.friends[value];
    };
    UidToFriendsNamePipe = __decorate([
        core_1.Pipe({
            name: 'uidToFriendsName'
        })
    ], UidToFriendsNamePipe);
    return UidToFriendsNamePipe;
}());
exports.UidToFriendsNamePipe = UidToFriendsNamePipe;
//# sourceMappingURL=uid-to-friends-name.pipe.js.map