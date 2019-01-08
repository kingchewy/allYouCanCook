"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var fcm_service_1 = require("./fcm.service");
describe('FcmService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [fcm_service_1.FcmService]
        });
    });
    it('should be created', testing_1.inject([fcm_service_1.FcmService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=fcm.service.spec.js.map