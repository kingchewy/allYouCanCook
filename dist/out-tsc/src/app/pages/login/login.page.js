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
var forms_1 = require("@angular/forms");
var angular_1 = require("@ionic/angular");
var auth_service_1 = require("../../services/user/auth.service");
var router_1 = require("@angular/router");
var LoginPage = /** @class */ (function () {
    function LoginPage(loadingCtrl, alertCtrl, authService, router, formBuilder) {
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginForm = this.formBuilder.group({
            email: ['',
                forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.email])],
            password: [
                '',
                forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(6)]),
            ],
        });
    }
    LoginPage.prototype.ngOnInit = function () {
    };
    LoginPage.prototype.loginUser = function (loginForm) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!loginForm.valid) return [3 /*break*/, 1];
                        console.log('Form is not valid yet, current value:', loginForm.value);
                        return [3 /*break*/, 4];
                    case 1:
                        email = loginForm.value.email;
                        password = loginForm.value.password;
                        this.authService.loginUser(email, password).then(function () {
                            _this.loading.dismiss().then(function () {
                                _this.router.navigateByUrl('food-list');
                            });
                        }, function (error) {
                            _this.loading.dismiss().then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var alert;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.alertCtrl.create({
                                                message: error.message,
                                                buttons: [{ text: 'Ok', role: 'cancel' }],
                                            })];
                                        case 1:
                                            alert = _a.sent();
                                            return [4 /*yield*/, alert.present()];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                        _a = this;
                        return [4 /*yield*/, this.loadingCtrl.create()];
                    case 2:
                        _a.loading = _b.sent();
                        return [4 /*yield*/, this.loading.present()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LoginPage = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
        }),
        __metadata("design:paramtypes", [angular_1.LoadingController,
            angular_1.AlertController,
            auth_service_1.AuthService,
            router_1.Router,
            forms_1.FormBuilder])
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
//# sourceMappingURL=login.page.js.map