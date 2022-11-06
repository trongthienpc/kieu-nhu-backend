"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneServiceGroup = exports.getAllServiceGroups = exports.createServiceGroup = exports.updateServiceGroup = exports.deleteServiceGroup = void 0;
var constants_1 = require("./../configs/constants");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// get all service groups
var getAllServiceGroups = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.serviceGroups.findMany({
                    // where: {
                    //   status: true,
                    // },
                    })];
            case 1:
                res = _a.sent();
                // console.log(res);
                return [2 /*return*/, {
                        success: true,
                        message: constants_1.GET_SUCCESS,
                        data: res,
                    }];
            case 2:
                error_1 = _a.sent();
                console.log(error_1 === null || error_1 === void 0 ? void 0 : error_1.message);
                return [2 /*return*/, {
                        success: false,
                        message: constants_1.ERROR,
                        data: error_1 === null || error_1 === void 0 ? void 0 : error_1.message,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllServiceGroups = getAllServiceGroups;
// get a service group
var getOneServiceGroup = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.serviceGroups.findUnique({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: constants_1.GET_SUCCESS,
                        data: res,
                    }];
            case 2:
                error_2 = _a.sent();
                console.log(error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                return [2 /*return*/, {
                        success: false,
                        message: constants_1.ERROR,
                        data: error_2 === null || error_2 === void 0 ? void 0 : error_2.message,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOneServiceGroup = getOneServiceGroup;
// create a new service group
var createServiceGroup = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var oldEntity, res, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma.serviceGroups.findFirst({
                        where: {
                            label: data.label,
                        },
                    })];
            case 1:
                oldEntity = _a.sent();
                // check if the service group exists
                if (oldEntity)
                    return [2 /*return*/, { success: false, message: "Tên nhóm dịch vụ đã tồn tại" }];
                return [4 /*yield*/, prisma.serviceGroups.create({
                        data: data,
                    })];
            case 2:
                res = _a.sent();
                if (res) {
                    return [2 /*return*/, {
                            success: true,
                            message: constants_1.POST_SUCCESS,
                            data: res,
                        }];
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, {
                        success: false,
                        message: constants_1.ERROR,
                        data: error_3 === null || error_3 === void 0 ? void 0 : error_3.message,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createServiceGroup = createServiceGroup;
// update a service group
var updateServiceGroup = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var id, newObject, res, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = data.id, newObject = __rest(data, ["id"]);
                return [4 /*yield*/, prisma.serviceGroups.update({
                        where: {
                            id: id,
                        },
                        data: newObject,
                    })];
            case 1:
                res = _a.sent();
                console.log(res);
                if (res)
                    return [2 /*return*/, {
                            success: true,
                            message: constants_1.UPDATE_SUCCESS,
                            data: res,
                        }];
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, {
                        success: false,
                        message: constants_1.ERROR,
                        data: error_4 === null || error_4 === void 0 ? void 0 : error_4.message,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateServiceGroup = updateServiceGroup;
// delete a service group
var deleteServiceGroup = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.serviceGroups.delete({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: constants_1.DELETE_SUCCESS,
                        data: res,
                    }];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, {
                        success: false,
                        message: constants_1.ERROR,
                        data: error_5 === null || error_5 === void 0 ? void 0 : error_5.message,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteServiceGroup = deleteServiceGroup;
