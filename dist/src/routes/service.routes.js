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
const service_service_1 = require("../services/service.service");
var serviceRouter = express_1.default.Router();
// get all services
serviceRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // page configs
    let p = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
    let pz = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.pageSize) || 5;
    let page = parseInt(p.toString());
    const pageSize = parseInt(pz.toString());
    const result = yield (0, service_service_1.getAllServices)();
    if (result && ((_c = result.data) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        let totalPages = Math.ceil(result.data.length / pageSize);
        if (page > totalPages)
            page = totalPages;
        console.log(totalPages);
        return res.status(200).json({
            success: true,
            message: "Get services successfully!",
            totalServices: (_d = result.data) === null || _d === void 0 ? void 0 : _d.length,
            page: page,
            totalPages: totalPages,
            services: result.data.slice(page * pageSize - pageSize, page * pageSize),
        });
    }
    else {
        return res.json({
            success: true,
            message: "Can not found any service!",
            services: [],
        });
    }
}));
// get a service
serviceRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield (0, service_service_1.getOneServices)(id);
    if (result)
        return res.status(200).json(result);
}));
// create a new service
serviceRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    const result = yield (0, service_service_1.createService)(data);
    if (result)
        return res.status(200).json(result);
}));
// update a service
serviceRouter.put(":id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    if (data !== null && id !== null) {
        const result = yield (0, service_service_1.updateService)(data);
        if (result) {
            return res.status(200).json(result);
        }
    }
}));
// delete a service
serviceRouter.delete(":id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield (0, service_service_1.deleteService)(id);
    if (result)
        return res.status(200).json(result);
}));
exports.default = serviceRouter;