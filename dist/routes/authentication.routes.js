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
    console.log(`Authentication.routes | login : ${JSON.stringify(response)}`);
    res.json(response);
}));
// user exist
authenticationRouter.get("/user-exist", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let params = req.query;
    console.log(params);
    let response = yield (0, authentication_service_1.checkUserExist)(params);
    res.json(response);
}));
// refresh token
authenticationRouter.post("/refresh-token", authentication_service_1.tokenRefresh);
exports.default = authenticationRouter;
