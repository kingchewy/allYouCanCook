"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var angular_1 = require("@ionic/angular");
var shoppinglists_page_1 = require("./shoppinglists.page");
var pipes_module_1 = require("../../pipes/pipes.module");
var routes = [
    {
        path: '',
        component: shoppinglists_page_1.ShoppinglistsPage
    }
];
var ShoppinglistsPageModule = /** @class */ (function () {
    function ShoppinglistsPageModule() {
    }
    ShoppinglistsPageModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                angular_1.IonicModule,
                router_1.RouterModule.forChild(routes),
                pipes_module_1.PipesModule
            ],
            declarations: [shoppinglists_page_1.ShoppinglistsPage]
        })
    ], ShoppinglistsPageModule);
    return ShoppinglistsPageModule;
}());
exports.ShoppinglistsPageModule = ShoppinglistsPageModule;
//# sourceMappingURL=shoppinglists.module.js.map