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
var rxjs_1 = require("rxjs");
var AuthService = /** @class */ (function () {
    function AuthService(firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
        this._userId = new rxjs_1.BehaviorSubject(null);
        this.userId$ = this._userId.asObservable();
        console.log("1. AuthService");
        var firestore = firebase.firestore();
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        this.initializeUserId();
    }
    AuthService.prototype.initializeUserId = function () {
        var _this = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                _this._userId.next(user.uid);
            }
        });
    };
    AuthService.prototype.setUserId = function (userId) {
        this._userId.next(userId);
    };
    /*   get UserId():Observable<string>{
        return this._userId.asObservable();
      } */
    AuthService.prototype.getUserId = function () {
        return this._userId.getValue();
    };
    AuthService.prototype.signupUser = function (newUser, password) {
        var _this = this;
        return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, password)
            .then(function (newUserCredential) {
            console.log("User successfully created", newUserCredential);
            _this.setUserId(newUserCredential.user.uid);
            firebase
                .firestore()
                .doc("/users/" + newUserCredential.user.uid)
                .set(newUser);
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