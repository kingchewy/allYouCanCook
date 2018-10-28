"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_guard_1 = require("./services/user/auth.guard");
var routes = [
    { path: '', redirectTo: 'food-list', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomePageModule' },
    { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
    { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
    { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
    {
        path: 'food-list',
        loadChildren: './pages/food-list/food-list.module#FoodListPageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    {
        path: 'food-calendar',
        loadChildren: './pages/food-calendar/food-calendar.module#FoodCalendarPageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    {
        path: 'food-selector',
        loadChildren: './pages/food-selector/food-selector.module#FoodSelectorPageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    {
        path: 'food-create',
        loadChildren: './pages/food-create/food-create.module#FoodCreatePageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    {
        path: 'shoppinglists',
        loadChildren: './pages/shoppinglists/shoppinglists.module#ShoppinglistsPageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    {
        path: 'food-details/:id',
        loadChildren: './pages/food-details/food-details.module#FoodDetailsPageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    {
        path: 'settings',
        loadChildren: './pages/settings/settings.module#SettingsPageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    { path: 'profile',
        loadChildren: './pages/profile/profile.module#ProfilePageModule',
        canActivate: [auth_guard_1.AuthGuard],
    },
    { path: 'splash', loadChildren: './pages/splash/splash.module#SplashPageModule' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map