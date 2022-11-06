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
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
exports.app = app;
var index_routes_1 = __importDefault(require("./routes/index.routes"));
var authentication_routes_1 = __importDefault(require("./routes/authentication.routes"));
var authentication_service_1 = require("./services/authentication.service");
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var service_routes_1 = __importDefault(require("./routes/service.routes"));
var transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
var serviceGroup_routes_1 = __importDefault(require("./routes/serviceGroup.routes"));
var kpi_routes_1 = __importDefault(require("./routes/kpi.routes"));
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
var allowCors = function (fn) { return function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                res.setHeader("Access-Control-Allow-Credentials", "*");
                res.setHeader("Access-Control-Allow-Origin", "*");
                // another common pattern
                // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
                res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
                res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
                if (req.method === "OPTIONS") {
                    res.status(200).end();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, fn(req, res)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); }; };
var corsConfig = {
    credentials: true,
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://192.168.4.89:3000",
        "http://192.168.1.8:3000",
        "https://kieu-nhu.vercel.app",
    ],
    // origin: true,
};
app.use(allowCors);
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsConfig));
app.use("*", (0, cors_1.default)(corsConfig));
app.use(express_1.default.static("./src/static"));
// verify logged in user
app.use("*", authentication_service_1.tokenVerification);
// app.use(morgan("dev"));
// routes
app.use("/", index_routes_1.default);
// app.use("/", (req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });
app.use("/api/auth", (0, cors_1.default)(corsConfig), authentication_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/service", service_routes_1.default);
app.use("/api/service-group", serviceGroup_routes_1.default);
app.use("/api/transaction", transaction_routes_1.default);
app.use("/api/kpi", kpi_routes_1.default);
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(res.status(404).send("Sorry, the page was not found"));
// });
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server is listening on ".concat(port));
});
