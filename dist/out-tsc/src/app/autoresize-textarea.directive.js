"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AutoresizeTextareaDirective = /** @class */ (function () {
    function AutoresizeTextareaDirective(element) {
        this.element = element;
        console.log('hello directive');
    }
    AutoresizeTextareaDirective.prototype.adjust = function (ev) {
        console.log(this.element.nativeElement.getElementsByTagName('textText')[0]);
        var test = ev.target;
        console.log(test.nativeElement);
        /* const textArea = this.element.nativeElement.getElementsByTagName('textText')[0];
        textArea.style.overflow = 'hidden';
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px'; */
        /*     const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
            textArea.style.overflow = 'hidden';
            textArea.style.height = 'auto';
            textArea.style.height = textArea.scrollHeight + 'px'; */
    };
    AutoresizeTextareaDirective = __decorate([
        core_1.Directive({
            selector: '[appAutoresizeTextarea]',
            host: {
                '(ionInput)': 'adjust($event)'
            }
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], AutoresizeTextareaDirective);
    return AutoresizeTextareaDirective;
}());
exports.AutoresizeTextareaDirective = AutoresizeTextareaDirective;
//# sourceMappingURL=autoresize-textarea.directive.js.map