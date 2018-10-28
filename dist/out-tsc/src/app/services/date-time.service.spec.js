"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var date_time_service_1 = require("./date-time.service");
describe('DateTimeService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [date_time_service_1.DateTimeService]
        });
    });
    it('should be created', testing_1.inject([date_time_service_1.DateTimeService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=date-time.service.spec.js.map