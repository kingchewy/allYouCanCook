"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var shoppinglist_service_1 = require("./shoppinglist.service");
describe('ShoppinglistService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [shoppinglist_service_1.ShoppinglistService]
        });
    });
    it('should be created', testing_1.inject([shoppinglist_service_1.ShoppinglistService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=shoppinglist.service.spec.js.map