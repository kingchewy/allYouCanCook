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
var firebase = require("firebase/app");
var firestore_1 = require("@angular/fire/firestore");
var profile_service_1 = require("./user/profile.service");
var rxjs_1 = require("rxjs");
var FriendService = /** @class */ (function () {
    function FriendService(afFireStore, userProfileService) {
        var _this = this;
        this.afFireStore = afFireStore;
        this.userProfileService = userProfileService;
        this._pendingRequests = new rxjs_1.BehaviorSubject(null);
        this.pendingRequests$ = this._pendingRequests.asObservable();
        console.log("hello friend.service");
        this.friendRequestsRef = firebase.firestore().collection('friendRequests');
        setTimeout(function () {
            _this.loadMyUnaccpetedRequests();
        }, 1000);
    }
    FriendService.prototype.subscribeUserProfile = function () { };
    FriendService.prototype.loadMyUnaccpetedRequests = function () {
        var _this = this;
        return this.friendRequestsRef.where('toUserEmail', '==', "" + this.userProfileService.getEmailAddress())
            .where('accepted', '==', false)
            .onSnapshot(function (snapshot) {
            var snappedPendingRequests = [];
            snapshot.forEach(function (request) {
                var requestData = request.data();
                console.log("requests: ", requestData);
                var requestObject = {
                    id: request.id,
                    fromUserId: requestData.fromUserId,
                    fromUserName: requestData.fromUserName,
                    toUserEmail: requestData.toUserEmail,
                    message: requestData.message,
                    accepted: requestData.accepted,
                    toUserId: requestData.toUserId
                };
                snappedPendingRequests.push(requestObject);
            });
            _this._pendingRequests.next(snappedPendingRequests);
        });
    };
    FriendService.prototype.sendFriendRequest = function (request) {
        return this.friendRequestsRef.add({
            fromUserName: request.fromUserName,
            fromUserId: request.fromUserId,
            toUserEmail: request.toUserEmail,
            message: request.message,
            accepted: false,
        });
    };
    FriendService.prototype.acceptFriendRequest = function (request) {
        return this.friendRequestsRef.doc(request.id).update({
            accepted: true
        });
    };
    FriendService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            profile_service_1.ProfileService])
    ], FriendService);
    return FriendService;
}());
exports.FriendService = FriendService;
//# sourceMappingURL=friend.service.js.map