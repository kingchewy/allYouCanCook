"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var food_service_1 = require("./food.service");
describe('FoodService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [food_service_1.FoodService]
        });
    });
    it('should be created', testing_1.inject([food_service_1.FoodService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=food.service.spec.js.map