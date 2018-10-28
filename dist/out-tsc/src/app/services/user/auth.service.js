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
var auth_1 = require("@angular/fire/auth");
var firebase = require("firebase/app");
var AuthService = /** @class */ (function () {
    function AuthService(firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
        console.log("1. AuthService");
    }
    AuthService.prototype.getUserId = function () {
    };
    AuthService.prototype.signupUser = function (email, password) {
        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(function (newUserCredential) {
            firebase
                .firestore()
                .doc("/userProfile/" + newUserCredential.user.uid)
                .set({ email: email });
        })
            .catch(function (error) {
            console.error(error);
            throw new Error(error);
        });
    };
    AuthService.prototype.loginUser = function (email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    };
    AuthService.prototype.logoutUser = function () {
        return firebase.auth().signOut();
    };
    AuthService.prototype.resetPassword = function (email) {
        return firebase.auth().sendPasswordResetEmail(email);
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [auth_1.AngularFireAuth])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map