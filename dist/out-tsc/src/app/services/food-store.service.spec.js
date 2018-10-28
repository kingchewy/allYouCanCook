"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var food_store_service_1 = require("./food-store.service");
describe('FoodStoreService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [food_store_service_1.FoodStoreService]
        });
    });
    it('should be created', testing_1.inject([food_store_service_1.FoodStoreService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=food-store.service.spec.js.map