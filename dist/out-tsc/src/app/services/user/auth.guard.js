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
var router_1 = require("@angular/router");
var firebase = require("firebase/app");
require("firebase/auth");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(router) {
        this.router = router;
        console.log("2. Guard");
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    _this.userId = user.uid;
                    console.log("AuthGUARD: User logged in! Able to access further components! \n UID = ", user.uid);
                    resolve(true);
                }
                else {
                    console.log('User is not logged in');
                    _this.router.navigate(['/login']);
                    resolve(false);
                }
            });
        });
    };
    AuthGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map