"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.checkAdminRole = exports.checkUserExist = exports.checkUsernameExist = exports.checkEmailExist = exports.userLogin = exports.userRegister = exports.tokenVerification = exports.tokenRefresh = exports.generateRefreshToken = exports.generateAccessToken = void 0;
var constants_1 = require("../configs/constants");
var client_1 = require("@prisma/client");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import prisma from "../../lib/prisma";
var prisma = new client_1.PrismaClient();
// const prisma = new PrismaClient({ log: ["query", "info", "warn"] });
// check [type] is exist
var checkUserExist = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, queryType, userObject, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                messages = {
                    email: constants_1.EMAIL_EXIST,
                    username: constants_1.USERNAME_EXIST,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                queryType = Object.keys(query)[0];
                return [4 /*yield*/, prisma.users.findFirst({
                        where: query,
                    })];
            case 2:
                userObject = _a.sent();
                return [2 /*return*/, !userObject
                        ? { success: true, message: "This ".concat(queryType, " is not taken") }
                        : {
                            success: false,
                            message: messages[queryType],
                        }];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.checkUserExist = checkUserExist;
// check username already exist
var checkUsernameExist = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.users.findFirst({
                    where: {
                        username: query,
                    },
                })];
            case 1:
                user = _a.sent();
                if (user)
                    return [2 /*return*/, constants_1.USERNAME_EXIST];
                return [2 /*return*/, true];
        }
    });
}); };
exports.checkUsernameExist = checkUsernameExist;
// check email already exist
var checkEmailExist = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.users.findFirst({
                    where: {
                        email: query,
                    },
                })];
            case 1:
                user = _a.sent();
                if (user)
                    return [2 /*return*/, constants_1.EMAIL_EXIST];
                return [2 /*return*/, true];
        }
    });
}); };
exports.checkEmailExist = checkEmailExist;
// user register
var userRegister = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var emailStatus, usernameStatus, passwordHash, userObject, newUser, accessToken, error_2, errorMessage;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                console.log("Authentication | user registration");
                if (!(user === null || user === void 0 ? void 0 : user.username) || !(user === null || user === void 0 ? void 0 : user.password))
                    return [2 /*return*/, {
                            success: false,
                            message: "Please fill up all the required information",
                        }];
                return [4 /*yield*/, checkEmailExist(user === null || user === void 0 ? void 0 : user.email)];
            case 1:
                emailStatus = _f.sent();
                if (emailStatus != true)
                    return [2 /*return*/, { success: false, message: constants_1.EMAIL_EXIST }];
                return [4 /*yield*/, checkUsernameExist(user === null || user === void 0 ? void 0 : user.username)];
            case 2:
                usernameStatus = _f.sent();
                if (usernameStatus != true)
                    return [2 /*return*/, { success: false, message: constants_1.USERNAME_EXIST }];
                return [4 /*yield*/, bcrypt_1.default.hash(user === null || user === void 0 ? void 0 : user.password, 10)];
            case 3:
                passwordHash = _f.sent();
                userObject = {
                    username: (_a = user === null || user === void 0 ? void 0 : user.username) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                    password: passwordHash,
                    email: (_b = user === null || user === void 0 ? void 0 : user.email) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                    name: (_c = user === null || user === void 0 ? void 0 : user.name) === null || _c === void 0 ? void 0 : _c.toLowerCase(),
                    admin: (user === null || user === void 0 ? void 0 : user.admin) || false,
                };
                return [4 /*yield*/, prisma.users.create({
                        data: userObject,
                    })];
            case 4:
                newUser = _f.sent();
                // create toke for user registration
                if (newUser) {
                    accessToken = jsonwebtoken_1.default.sign({ username: userObject === null || userObject === void 0 ? void 0 : userObject.username, email: userObject === null || userObject === void 0 ? void 0 : userObject.email }, process.env.TOKEN_SECRET || "", {
                        expiresIn: "10m",
                    });
                    return [2 /*return*/, {
                            success: true,
                            message: constants_1.REGISTERED_SUCCESS,
                            data: accessToken,
                        }];
                }
                else {
                    return [2 /*return*/, { success: false, message: constants_1.REGISTERED_FAILED }];
                }
                return [3 /*break*/, 6];
            case 5:
                error_2 = _f.sent();
                console.log(error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                errorMessage = constants_1.REGISTERED_FAILED;
                (error_2 === null || error_2 === void 0 ? void 0 : error_2.code) === 11000 && ((_d = error_2 === null || error_2 === void 0 ? void 0 : error_2.keyPattern) === null || _d === void 0 ? void 0 : _d.username)
                    ? (errorMessage = "Username already exist")
                    : null;
                (error_2 === null || error_2 === void 0 ? void 0 : error_2.code) === 11000 && ((_e = error_2 === null || error_2 === void 0 ? void 0 : error_2.keyPattern) === null || _e === void 0 ? void 0 : _e.email)
                    ? (errorMessage = "Email already exist")
                    : null;
                return [2 /*return*/, { success: false, message: errorMessage, data: error_2 === null || error_2 === void 0 ? void 0 : error_2.toString() }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.userRegister = userRegister;
// user login
var userLogin = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var userObject, isPasswordVerified, password, userInfo, accessToken, refreshToken, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(user === null || user === void 0 ? void 0 : user.username) || !user.password)
                    return [2 /*return*/, { success: false, message: "Please fill up all the fields" }];
                return [4 /*yield*/, prisma.users.findFirst({
                        where: {
                            username: user.username.toLowerCase(),
                        },
                    })];
            case 1:
                userObject = _a.sent();
                if (!userObject) return [3 /*break*/, 6];
                return [4 /*yield*/, bcrypt_1.default.compare(user === null || user === void 0 ? void 0 : user.password, userObject.password)];
            case 2:
                isPasswordVerified = _a.sent();
                if (!isPasswordVerified) return [3 /*break*/, 4];
                password = userObject.password, userInfo = __rest(userObject, ["password"]);
                accessToken = (0, exports.generateAccessToken)(userObject.username);
                refreshToken = (0, exports.generateRefreshToken)(userObject.username);
                return [4 /*yield*/, prisma.users.update({
                        where: {
                            id: userObject.id,
                        },
                        data: {
                            refreshToken: refreshToken,
                        },
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: "User login successful",
                        data: __assign(__assign({}, userInfo), { accessToken: accessToken }),
                        refreshToken: refreshToken,
                    }];
            case 4: return [2 /*return*/, {
                    success: false,
                    message: "Incorrect password",
                }];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, {
                    success: false,
                    message: "No user found",
                }];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, {
                        success: false,
                        message: "User login failed",
                        error: error_3 === null || error_3 === void 0 ? void 0 : error_3.toString(),
                    }];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.userLogin = userLogin;
// @desc generate new access token
// @param user id
var generateAccessToken = function (username) {
    return jsonwebtoken_1.default.sign({ username: username }, process.env.TOKEN_SECRET || "", {
        expiresIn: "3s",
    });
};
exports.generateAccessToken = generateAccessToken;
var generateRefreshToken = function (username) {
    return jsonwebtoken_1.default.sign({ username: username }, process.env.TOKEN_SECRET || "", {
        expiresIn: "1d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
// check token validity
var tokenVerification = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, accessToken;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        console.log("authentication.service | tokenVerification ".concat(req.originalUrl));
        try {
            if (((_a = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _a === void 0 ? void 0 : _a.includes("/login")) ||
                ((_b = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _b === void 0 ? void 0 : _b.includes("/user-exist")) ||
                ((_c = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _c === void 0 ? void 0 : _c.includes("/register")) ||
                ((_d = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _d === void 0 ? void 0 : _d.includes("/refresh")) ||
                ((_e = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _e === void 0 ? void 0 : _e.includes("/logout")))
                return [2 /*return*/, next()];
            token = req === null || req === void 0 ? void 0 : req.headers.token;
            // console.log(token);
            if (token && token.startsWith("Bearer ")) {
                accessToken = token.split(" ")[1];
                jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET || "", function (error, decoded) {
                    if (error) {
                        return res.status(401).json({
                            success: false,
                            message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid Token",
                            error: "Invalid token | ".concat(error === null || error === void 0 ? void 0 : error.message),
                        });
                    }
                    else {
                        req.username = decoded === null || decoded === void 0 ? void 0 : decoded.username;
                        next();
                    }
                });
            }
            else {
                return [2 /*return*/, res.status(401).json({
                        success: false,
                        message: "Token is missing",
                        error: "Token is missing",
                    })];
            }
        }
        catch (error) {
            return [2 /*return*/, res.status(401).json({
                    success: false,
                    message: (error === null || error === void 0 ? void 0 : error.message) ? error === null || error === void 0 ? void 0 : error.message : "Authentication failed",
                    error: "Authentication failed | ".concat(error === null || error === void 0 ? void 0 : error.message),
                })];
        }
        return [2 /*return*/];
    });
}); };
exports.tokenVerification = tokenVerification;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
// refresh token validity
var tokenRefresh = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("authentication.service | tokenRefresh ");
        try {
            jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET || "", {
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
                            newAccessToken = (0, exports.generateAccessToken)(decoded === null || decoded === void 0 ? void 0 : decoded.username);
                            console.log(newAccessToken);
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Token refreshed successfully",
                                    accessToken: newAccessToken,
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid Token",
                                    error: "Invalid token | ".concat(error === null || error === void 0 ? void 0 : error.message),
                                }];
                        }
                    }
                    return [2 /*return*/];
                });
            }); });
        }
        catch (error) {
            return [2 /*return*/, {
                    success: false,
                    message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Token refresh failed",
                    error: "Token refresh failed | ".concat(error === null || error === void 0 ? void 0 : error.message),
                }];
        }
        return [2 /*return*/];
    });
}); };
exports.tokenRefresh = tokenRefresh;
var checkAdminRole = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var isAdmin, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                isAdmin = false;
                return [4 /*yield*/, prisma.users.findFirst({
                        where: {
                            username: username,
                        },
                    })];
            case 1:
                user = _a.sent();
                if (user)
                    isAdmin = user.admin || false;
                return [2 /*return*/, isAdmin];
        }
    });
}); };
exports.checkAdminRole = checkAdminRole;
