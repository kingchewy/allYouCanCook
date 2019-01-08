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
var auth_service_1 = require("./auth.service");
var ProfileService = /** @class */ (function () {
    function ProfileService(firebaseAuth, authService) {
        this.firebaseAuth = firebaseAuth;
        this.authService = authService;
        this._userProfile = new rxjs_1.BehaviorSubject(null);
        this.userProfile$ = this._userProfile.asObservable();
        console.log("profileService");
        var firestore = firebase.firestore();
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        this.refUsers = firebase.firestore().collection('users');
        this.loadInitialUserProfile();
    }
    ProfileService.prototype.getEmailAddress = function () {
        return this._userProfile.getValue().email;
    };
    ProfileService.prototype.loadInitialUserProfile = function () {
        var _this = this;
        this.refUsers.doc(this.authService.getUserId())
            .onSnapshot(function (snapshot) {
            var userFromFirestore = snapshot.data();
            var userProfile = {
                id: snapshot.id,
                email: userFromFirestore.email,
                firstname: userFromFirestore.firstname,
                lastname: userFromFirestore.lastname,
                nickname: userFromFirestore.nickname,
                birthdate: userFromFirestore.born,
                friends: userFromFirestore.friends,
                token: userFromFirestore.token,
                createdAt: userFromFirestore.createdAt,
            };
            console.log("vor wertzuweisung next");
            _this._userProfile.next(userProfile);
            console.log("initial loaded userProfile from behaviourSubject: ", _this._userProfile.getValue());
        });
    };
    /*
      getFriendsNameByUID2(userId: string):string{
        console.log("in method getFriendsNameByUID. Value of userProfile -> ",this._userProfile.getValue())
        return this._userProfile.getValue().friends[userId];
      }
    
      getFriendsNameByUID(): Promise<User>{
        console.log("in method getFriendsNameByUID. Value of userProfile -> ",this._userProfile.getValue())
        return this.userProfile$.toPromise();
      } */
    /*   refreshUserId(userId: string){
        this._userId.next(userId);
      }
    
      getUserId(){
        return this._userId.getValue();
      } */
    ProfileService.prototype.filterUserName = function (userId) {
        return;
    };
    ProfileService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [auth_1.AngularFireAuth,
            auth_service_1.AuthService])
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map