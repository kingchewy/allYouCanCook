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
var friend_service_1 = require("../../services/friend.service");
var profile_service_1 = require("../../services/user/profile.service");
var auth_service_1 = require("../../services/user/auth.service");
var ProfilePage = /** @class */ (function () {
    function ProfilePage(friendService, profileService, authService) {
        this.friendService = friendService;
        this.profileService = profileService;
        this.authService = authService;
        this.pendingRequests = null;
        this.newRequest = {
            fromUserName: null,
            fromUserId: null,
            toUserEmail: '',
            message: '',
            accepted: false
        };
    }
    ProfilePage.prototype.ngOnInit = function () {
        this.subscribePendingRequests();
        this.subscribeUserProfile();
    };
    ProfilePage.prototype.subscribeUserProfile = function () {
        var _this = this;
        this.userProfileSub = this.profileService.userProfile$.subscribe(function (userProfile) {
            if (!userProfile) {
                _this.newRequest.fromUserName = userProfile.nickname;
                _this.newRequest.fromUserId = userProfile.id;
            }
        });
    };
    ProfilePage.prototype.subscribePendingRequests = function () {
        var _this = this;
        this.pendingRequestSub = this.friendService.pendingRequests$.subscribe(function (requests) {
            if (requests) {
                _this.pendingRequests = requests;
                console.log(requests);
            }
        });
    };
    ProfilePage.prototype.acceptFriendRequest = function (request) {
        this.friendService.acceptFriendRequest(request);
    };
    ProfilePage.prototype.sendFriendRequest = function () {
        this.friendService.sendFriendRequest(this.newRequest);
    };
    ProfilePage.prototype.ngOnDestroy = function () {
        if (this.pendingRequestSub) {
            this.pendingRequestSub.unsubscribe();
        }
        if (this.userProfileSub) {
            this.userProfileSub.unsubscribe();
        }
    };
    ProfilePage = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.page.html',
            styleUrls: ['./profile.page.scss'],
        }),
        __metadata("design:paramtypes", [friend_service_1.FriendService,
            profile_service_1.ProfileService,
            auth_service_1.AuthService])
    ], ProfilePage);
    return ProfilePage;
}());
exports.ProfilePage = ProfilePage;
//# sourceMappingURL=profile.page.js.map