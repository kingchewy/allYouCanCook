"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var friend_service_1 = require("./friend.service");
describe('FriendService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [friend_service_1.FriendService]
        });
    });
    it('should be created', testing_1.inject([friend_service_1.FriendService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=friend.service.spec.js.map