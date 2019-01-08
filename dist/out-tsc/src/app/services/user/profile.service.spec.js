"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var profile_service_1 = require("./profile.service");
describe('ProfileService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [profile_service_1.ProfileService]
        });
    });
    it('should be created', testing_1.inject([profile_service_1.ProfileService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=profile.service.spec.js.map