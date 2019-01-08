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
var angular_1 = require("@ionic/angular");
var ngx_1 = require("@ionic-native/splash-screen/ngx");
var ngx_2 = require("@ionic-native/status-bar/ngx");
var auth_service_1 = require("./services/user/auth.service");
var fcm_service_1 = require("./services/fcm.service");
var messaging_1 = require("@angular/fire/messaging");
var rxjs_1 = require("rxjs");
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, authService, fcmService, afMessaging) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.authService = authService;
        this.fcmService = fcmService;
        this.afMessaging = afMessaging;
        this.appPages = [
            {
                title: 'Speisen',
                url: '',
                icon: 'pizza'
            },
            {
                title: 'Speise-Kalender',
                url: '/food-calendar',
                icon: 'calendar'
            },
            {
                title: 'Einkaufslisten',
                url: '/shoppinglists',
                icon: 'basket'
            },
            {
                title: 'Benutzer-Profil',
                url: '/profile',
                icon: 'person'
            },
            {
                title: 'Einstellungen',
                url: '/settings',
                icon: 'settings'
            }
        ];
        this.showSplash = true;
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        console.log("initialized app");
        //firebase.initializeApp(environment.firebase);
        /*
            firebase.firestore().enablePersistence().catch(function(err) {
              if (err.code == 'failed-precondition') {
                  // Multiple tabs open, persistence can only be enabled
                  // in one tab at a a time.
                  // ...
              } else if (err.code == 'unimplemented') {
                  // The current browser does not support all of the
                  // features required to enable persistence
                  // ...
              }
            }); */
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.statusBar.overlaysWebView(false);
            // this.statusBar.backgroundColorByHexString('#ffffff');
            _this.splashScreen.hide();
            var timerSub = rxjs_1.timer(4000).subscribe(function () {
                _this.showSplash = false;
                timerSub.unsubscribe();
            });
        });
        this.fcmService.getToken();
        // listen to notifications if user on ios or android
        if (this.platform.is('android') || this.platform.is('ios')) {
            this.listenToNotificationsOnNativebSub = this.fcmService.listenToNotificationsOnNative().subscribe();
        }
        // listen to notifications if user on web
        if (!this.platform.is('cordova')) {
            this.listenToNotificationsOnWebSub = this.fcmService.listenToNotificationsOnWeb().subscribe();
        }
    };
    AppComponent.prototype.logout = function () {
        this.authService.logoutUser();
        if (this.listenToNotificationsOnNativebSub) {
            this.listenToNotificationsOnNativebSub.unsubscribe();
        }
        if (this.listenToNotificationsOnWebSub) {
            this.listenToNotificationsOnWebSub.unsubscribe();
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        __metadata("design:paramtypes", [angular_1.Platform,
            ngx_1.SplashScreen,
            ngx_2.StatusBar,
            auth_service_1.AuthService,
            fcm_service_1.FcmService,
            messaging_1.AngularFireMessaging])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map