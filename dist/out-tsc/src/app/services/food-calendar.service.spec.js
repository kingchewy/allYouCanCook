"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var food_calendar_service_1 = require("./food-calendar.service");
describe('FoodCalendarService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [food_calendar_service_1.FoodCalendarService]
        });
    });
    it('should be created', testing_1.inject([food_calendar_service_1.FoodCalendarService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=food-calendar.service.spec.js.map