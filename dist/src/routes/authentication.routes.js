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
const express_1 = __importDefault(require("express"));
const authentication_service_1 = require("../services/authentication.service");
var authenticationRouter = express_1.default.Router();
// user registration
authenticationRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    console.log(`authenticationRouter | register`);
    let response = yield (0, authentication_service_1.userRegister)(body);
    return res.status(200).json(response);
}));
// user login
authenticationRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let response = yield (0, authentication_service_1.userLogin)(body);
    if (response.success)
        res.cookie("refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
        });
    console.log(`Authentication.routes | login`);
    const { refreshToken } = response, responseData = __rest(response, ["refreshToken"]);
    return res.json({
        success: responseData.success,
        data: responseData.data,
        message: responseData.message,
    });
}));
// user exist
authenticationRouter.get("/user-exist", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let params = req.query;
    console.log(params);
    let response = yield (0, authentication_service_1.checkUserExist)(params);
    res.json(response);
}));
// refresh token
authenticationRouter.post("/refresh", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`authentication.router | tokenRefresh | ${req === null || req === void 0 ? void 0 : req.originalUrl}`);
    // let token = req?.headers["authorization"];
    // take refresh token from user
    let re = req.cookies["refreshToken"];
    console.log(re);
}));
// @route POST api/auth/logout
// desc logout
authenticationRouter.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully!" });
}));
exports.default = authenticationRouter;
