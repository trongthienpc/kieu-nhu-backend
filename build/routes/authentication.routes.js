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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var user_service_1 = require("./../services/user.service");
var express_1 = __importDefault(require("express"));
var authentication_service_1 = require("../services/authentication.service");
var authenticationRouter = express_1.default.Router();
// user registration
authenticationRouter.post("/register", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var body, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log("authenticationRouter | register");
                return [4 /*yield*/, (0, authentication_service_1.userRegister)(body)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, res.status(200).json(response)];
        }
    });
}); });
// user login
authenticationRouter.post("/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var body, response, refreshToken, responseData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                return [4 /*yield*/, (0, authentication_service_1.userLogin)(body)];
            case 1:
                response = _a.sent();
                console.log(response);
                if (response.success) {
                    // res.status(200).cookie("refreshToken", response.refreshToken, {
                    //   httpOnly: true,
                    //   secure: true, // change this to true if production
                    //   sameSite: "strict",
                    //   domain:
                    //     process.env.NODE_ENV === "development" ? ".localhost" : ".vercel.com",
                    //   path: "/",
                    // });
                }
                console.log("Authentication.routes | login");
                refreshToken = response.refreshToken, responseData = __rest(response, ["refreshToken"]);
                return [2 /*return*/, res.json({
                        success: responseData.success,
                        data: responseData.data,
                        message: responseData.message,
                    })];
        }
    });
}); });
// user exist
authenticationRouter.get("/user-exist", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var params, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = req.query;
                console.log(params);
                return [4 /*yield*/, (0, authentication_service_1.checkUserExist)(params)];
            case 1:
                response = _a.sent();
                res.json(response);
                return [2 /*return*/];
        }
    });
}); });
// refresh token
authenticationRouter.post("/refresh", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log("authentication.routes | tokenRefresh | ".concat(req === null || req === void 0 ? void 0 : req.originalUrl));
                username = (_a = req.body) === null || _a === void 0 ? void 0 : _a.username;
                return [4 /*yield*/, (0, user_service_1.getUser)(username)];
            case 1:
                user = _d.sent();
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "user not found, may be refresh token is not valid",
                    });
                }
                else {
                    console.log("r", (_b = user.data) === null || _b === void 0 ? void 0 : _b.refreshToken);
                    try {
                        jsonwebtoken_1.default.verify(((_c = user.data) === null || _c === void 0 ? void 0 : _c.refreshToken) || "", process.env.TOKEN_SECRET || "", {
                            ignoreExpiration: true,
                        }, function (error, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                            var newAccessToken;
                            return __generator(this, function (_a) {
                                if (error) {
                                    return [2 /*return*/, {
                                            success: false,
                                            message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid token",
                                            error: "Invalid token | ".concat(error === null || error === void 0 ? void 0 : error.message),
                                        }];
                                }
                                else {
                                    console.log("decoded: ", decoded);
                                    if (decoded === null || decoded === void 0 ? void 0 : decoded.username) {
                                        newAccessToken = (0, authentication_service_1.generateAccessToken)(decoded === null || decoded === void 0 ? void 0 : decoded.username);
                                        console.log(newAccessToken);
                                        return [2 /*return*/, res.status(200).json({
                                                success: true,
                                                message: "Token refreshed successfully",
                                                accessToken: newAccessToken,
                                            })];
                                    }
                                    else {
                                        return [2 /*return*/, res.status(401).json({
                                                success: false,
                                                message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid Token",
                                                error: "Invalid token | ".concat(error === null || error === void 0 ? void 0 : error.message),
                                            })];
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    }
                    catch (error) {
                        return [2 /*return*/, res.status(501).json({
                                success: false,
                                message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Token refresh failed",
                                error: "Token refresh failed | ".concat(error === null || error === void 0 ? void 0 : error.message),
                            })];
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
// @route POST api/auth/logout
// desc logout
authenticationRouter.post("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.clearCookie("refreshToken");
        res.status(200).json({ success: true, message: "Logged out successfully!" });
        return [2 /*return*/];
    });
}); });
exports.default = authenticationRouter;
