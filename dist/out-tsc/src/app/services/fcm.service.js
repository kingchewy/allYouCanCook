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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var messaging_1 = require("@angular/fire/messaging");
var functions_1 = require("@angular/fire/functions");
var operators_1 = require("rxjs/operators");
var firebase = require("firebase/app");
var auth_service_1 = require("./user/auth.service");
var ngx_1 = require("@ionic-native/firebase/ngx");
/* import * as app from 'firebase';
const _messaging = firebase.messaging();
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        _messaging.onMessage = _messaging.onMessage.bind(_messaging); */
var FcmService = /** @class */ (function () {
    function FcmService(firebaseNative, afMessaging, authService, fun, toastController, platform) {
        this.firebaseNative = firebaseNative;
        this.afMessaging = afMessaging;
        this.authService = authService;
        this.fun = fun;
        this.toastController = toastController;
        this.platform = platform;
        var firestore = firebase.firestore();
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        this.afMessaging.messaging.subscribe(function (_messaging) {
            _messaging.onMessage = _messaging.onMessage.bind(_messaging);
            _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        });
    }
    FcmService.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.platform.is('android')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.firebaseNative.getToken()
                            // TODO on tokenrefresh
                        ];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.platform.is('ios')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.firebaseNative.getToken()];
                    case 3:
                        token = _a.sent();
                        return [4 /*yield*/, this.firebaseNative.grantPermission()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        // all other platforms (Web, Win,....)
                        if (!this.platform.is('cordova')) {
                            console.log("Platform is Web");
                            return [2 /*return*/, this.refreshAndSaveToken()];
                            /*  return this.afMessaging.requestToken.subscribe(
                               token => { console.log("got token for cordova: ",token); this.saveTokenToFirestore(token)},
                               error => {}
                             ) */
                        }
                        console.log("???? await?????");
                        return [2 /*return*/, this.saveTokenToFirestore(token)];
                }
            });
        });
    };
    FcmService.prototype.refreshAndSaveToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.afMessaging.getToken
                            .pipe(operators_1.mergeMap(function (token) { return _this.afMessaging.deleteToken(token); }))
                            .subscribe(function (token) {
                            console.log("Token deleted!: ", token);
                        })];
                    case 1:
                        test = _a.sent();
                        console.log("after token deleted -> start requesting new token:");
                        return [4 /*yield*/, this.afMessaging.requestToken.subscribe(function (token) {
                                console.log("new token is: \n", token);
                                _this.saveTokenToFirestore(token);
                            }, function (error) { })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcmService.prototype.saveTokenToFirestore = function (token) {
        var _this = this;
        console.log("saveTokenMethod.................");
        if (!token)
            return;
        var subscription = this.authService.userId$.subscribe(function (userId) {
            console.log("?", userId);
            if (userId) {
                _this.updateToken(userId, token);
                if (subscription) {
                    subscription.unsubscribe();
                }
            }
        });
    };
    FcmService.prototype.updateToken = function (userId, token) {
        var userRef = firebase.firestore().doc("users/" + userId);
        console.log("vor update firestore: \nUserId:", userId, "\nuserRef: ", userRef);
        userRef.set({
            token: token
        }, { merge: true })
            .then(function () {
            console.log("Token successfully updated!");
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    // Foreground notifications for iOS/Android
    FcmService.prototype.listenToNotificationsOnNative = function () {
        var _this = this;
        //TODO based on platform return notificationtype
        return this.firebaseNative.onNotificationOpen().pipe(operators_1.tap(function (msg) {
            _this.makeToast(msg.body);
        }));
    };
    // Foreground notifications for Web
    FcmService.prototype.listenToNotificationsOnWeb = function () {
        var _this = this;
        return this.afMessaging.messages.pipe(operators_1.tap(function (msg) {
            var body = msg.notification.body;
            _this.makeToast(body);
        }));
    };
    /*
    getPermissionNonNative(): Observable<any>  {
      return this.afMessaging.requestToken.pipe(
        tap(token => {console.log('token request: ', token); (this.token = token)})
        );
      } */
    FcmService.prototype.makeToast = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: message,
                            duration: 5000,
                            position: 'top',
                            showCloseButton: true,
                            closeButtonText: 'schließen'
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcmService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [ngx_1.Firebase,
            messaging_1.AngularFireMessaging,
            auth_service_1.AuthService,
            functions_1.AngularFireFunctions,
            angular_1.ToastController,
            angular_1.Platform])
    ], FcmService);
    return FcmService;
}());
exports.FcmService = FcmService;
//# sourceMappingURL=fcm.service.js.map