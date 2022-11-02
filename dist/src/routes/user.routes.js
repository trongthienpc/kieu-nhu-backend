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
const serviceGroup_service_1 = require("../services/serviceGroup.service");
const user_service_1 = require("../services/user.service");
const userRouter = express_1.default.Router();
userRouter.get("/get-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("userRouter.get-user");
    // console.log(req);
    const username = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.username) || "";
    const response = yield (0, user_service_1.getUser)(username);
    res.json(response);
}));
// get all users
userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    // page configs
    let p = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
    let pz = ((_c = req.query) === null || _c === void 0 ? void 0 : _c.pageSize) || 5;
    let page = parseInt(p.toString());
    const pageSize = parseInt(pz.toString());
    const result = yield (0, serviceGroup_service_1.getAllServiceGroups)();
    if (result && ((_d = result.data) === null || _d === void 0 ? void 0 : _d.length) > 0) {
        let totalPages = Math.ceil(result.data.length / pageSize);
        if (page > totalPages)
            page = totalPages;
        console.log(totalPages);
        return res.status(200).json({
            success: true,
            message: "Get services successfully!",
            totalTransactions: (_e = result.data) === null || _e === void 0 ? void 0 : _e.length,
            page: page,
            totalPages: totalPages,
            users: result.data.slice(page * pageSize - pageSize, page * pageSize),
        });
    }
    else {
        return res.json({
            success: true,
            message: "Can not found any transaction!",
            users: [],
        });
    }
}));
exports.default = userRouter;
