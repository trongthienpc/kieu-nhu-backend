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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authentication_service_1 = require("../services/authentication.service");
var transaction_service_1 = require("../services/transaction.service");
var dateTimeFn_1 = require("../utils/dateTimeFn");
var transactionRouter = express_1.default.Router();
// get all transactions
transactionRouter.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var p, pz, page, pageSize, search, isAdmin, result, totalPages;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                p = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
                pz = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.pageSize) || 5;
                page = parseInt(p.toString());
                pageSize = parseInt(pz.toString());
                search = ((_c = req.query) === null || _c === void 0 ? void 0 : _c.search) || "";
                return [4 /*yield*/, (0, authentication_service_1.checkAdminRole)(req.username)];
            case 1:
                isAdmin = _f.sent();
                if (!isAdmin) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, transaction_service_1.getAllTransactions)(search)];
            case 2:
                result = _f.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, transaction_service_1.getAllTransactionsByUsername)(req.username, search)];
            case 4:
                result = _f.sent();
                _f.label = 5;
            case 5:
                if (result && ((_d = result.data) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                    totalPages = Math.ceil(result.data.length / pageSize);
                    if (page > totalPages)
                        page = totalPages;
                    console.log(totalPages);
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            message: "Get services successfully!",
                            totalTransactions: (_e = result.data) === null || _e === void 0 ? void 0 : _e.length,
                            page: page,
                            totalPages: totalPages,
                            transactions: result.data.slice(page * pageSize - pageSize, page * pageSize),
                        })];
                }
                else {
                    return [2 /*return*/, res.json({
                            success: true,
                            message: "Can not found any transaction!",
                            transactions: [],
                        })];
                }
                return [2 /*return*/];
        }
    });
}); });
// analyze transactions by user
transactionRouter.get("/statistics", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, month, year, firstDate, lastDate, result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                date = new Date();
                month = req.query.month === "undefined"
                    ? date.getMonth() + 1
                    : req.query.month || date.getMonth() + 1;
                year = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.year) === "undefined"
                    ? date.getFullYear()
                    : req.query.year || date.getFullYear();
                firstDate = (0, dateTimeFn_1.getFirstDayOfMonth)(parseInt(month.toString()), parseInt(year.toString()));
                lastDate = (0, dateTimeFn_1.getLastDayOfMonth)(parseInt(month.toString()), parseInt(year.toString()));
                return [4 /*yield*/, (0, transaction_service_1.analyzeTransaction)(firstDate, lastDate)];
            case 1:
                result = _b.sent();
                if (result)
                    return [2 /*return*/, res.status(200).json(result)];
                return [2 /*return*/];
        }
    });
}); });
// get a transaction
transactionRouter.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, (0, transaction_service_1.getOneTransactions)(id)];
            case 1:
                result = _a.sent();
                if (result)
                    return [2 /*return*/, res.status(200).json(result)];
                return [2 /*return*/];
        }
    });
}); });
// create a new transaction
transactionRouter.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = req.body;
                console.log(data);
                return [4 /*yield*/, (0, transaction_service_1.createTransaction)(data)];
            case 1:
                result = _a.sent();
                if (result)
                    return [2 /*return*/, res.status(200).json(result)];
                return [2 /*return*/];
        }
    });
}); });
// update a transaction
transactionRouter.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                data = req.body;
                if (!(data !== null && id !== null)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, transaction_service_1.updateTransaction)(data)];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.status(200).json(result)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
// delete a transaction
transactionRouter.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, (0, transaction_service_1.deleteTransaction)(id)];
            case 1:
                result = _a.sent();
                if (result)
                    return [2 /*return*/, res.status(200).json(result)];
                return [2 /*return*/];
        }
    });
}); });
exports.default = transactionRouter;
