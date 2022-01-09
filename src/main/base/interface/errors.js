"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.GenericError = exports.MyProgrammeError = exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["OK"] = 0] = "OK";
    Status[Status["ERROR"] = 1] = "ERROR";
    Status[Status["OVER"] = 2] = "OVER";
})(Status = exports.Status || (exports.Status = {}));
exports.MyProgrammeError = 'MyProgrammeError';
var GenericError = /** @class */ (function (_super) {
    __extends(GenericError, _super);
    function GenericError(errorType, msg) {
        var _this = _super.call(this, msg) || this;
        _this.errorType = errorType;
        return _this;
    }
    GenericError.prototype.toString = function () {
        return "[error] type: ".concat(this.errorType, ", msg: ").concat(this.message);
    };
    return GenericError;
}(Error));
exports.GenericError = GenericError;
