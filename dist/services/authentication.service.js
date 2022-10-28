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
exports.checkUserExist = exports.checkUsernameExist = exports.checkEmailExist = exports.userLogin = exports.userRegister = exports.tokenVerification = exports.tokenRefresh = void 0;
const constants_1 = require("../configs/constants");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// check [type] is exist
const checkUserExist = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let messages = {
        email: constants_1.EMAIL_EXIST,
        username: constants_1.USERNAME_EXIST,
    };
    // console.log(query);
    try {
        let queryType = Object.keys(query)[0];
        let userObject = yield prisma.users.findFirst({
            where: query,
        });
        return !userObject
            ? { status: true, message: `This ${queryType} is not taken` }
            : {
                status: false,
                message: messages[queryType],
            };
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkUserExist = checkUserExist;
// check username already exist
const checkUsernameExist = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({
        where: {
            username: query,
        },
    });
    if (user)
        return constants_1.USERNAME_EXIST;
    return true;
});
exports.checkUsernameExist = checkUsernameExist;
// check email already exist
const checkEmailExist = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({
        where: {
            email: query,
        },
    });
    if (user)
        return constants_1.EMAIL_EXIST;
    return true;
});
exports.checkEmailExist = checkEmailExist;
// user register
const userRegister = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log(`Authentication | user registration`);
        if (!(user === null || user === void 0 ? void 0 : user.username) || !(user === null || user === void 0 ? void 0 : user.password) || !(user === null || user === void 0 ? void 0 : user.email))
            return {
                status: false,
                message: "Please fill up all the required information",
            };
        // check email already exist
        const emailStatus = yield checkEmailExist(user === null || user === void 0 ? void 0 : user.email);
        if (emailStatus != true)
            return { status: false, message: constants_1.EMAIL_EXIST };
        // check username already exist
        const usernameStatus = yield checkUsernameExist(user === null || user === void 0 ? void 0 : user.username);
        if (usernameStatus != true)
            return { status: false, message: constants_1.USERNAME_EXIST };
        const passwordHash = yield bcrypt_1.default.hash(user === null || user === void 0 ? void 0 : user.password, 10);
        let userObject = {
            username: user === null || user === void 0 ? void 0 : user.username,
            password: passwordHash,
            email: user === null || user === void 0 ? void 0 : user.email,
        };
        // save to database
        const newUser = yield prisma.users.create({
            data: userObject,
        });
        // create toke for user registration
        if (newUser) {
            let accessToken = jsonwebtoken_1.default.sign({ username: userObject === null || userObject === void 0 ? void 0 : userObject.username, email: userObject === null || userObject === void 0 ? void 0 : userObject.email }, process.env.TOKEN_SECRET || "", {
                expiresIn: "10m",
            });
            return {
                status: true,
                message: constants_1.REGISTERED_SUCCESS,
                data: accessToken,
            };
        }
        else {
            return { status: false, message: constants_1.REGISTERED_FAILED };
        }
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
        let errorMessage = constants_1.REGISTERED_FAILED;
        (error === null || error === void 0 ? void 0 : error.code) === 11000 && ((_a = error === null || error === void 0 ? void 0 : error.keyPattern) === null || _a === void 0 ? void 0 : _a.username)
            ? (errorMessage = "Username already exist")
            : null;
        (error === null || error === void 0 ? void 0 : error.code) === 11000 && ((_b = error === null || error === void 0 ? void 0 : error.keyPattern) === null || _b === void 0 ? void 0 : _b.email)
            ? (errorMessage = "Email already exist")
            : null;
        return { status: false, message: errorMessage, data: error === null || error === void 0 ? void 0 : error.toString() };
    }
});
exports.userRegister = userRegister;
// user login
const userLogin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(user === null || user === void 0 ? void 0 : user.username) || !user.password)
            return { status: false, message: "Please fill up all the fields" };
        const userObject = yield prisma.users.findFirst({
            where: {
                username: user.username,
            },
        });
        if (userObject) {
            let isPasswordVerified = yield bcrypt_1.default.compare(user === null || user === void 0 ? void 0 : user.password, userObject.password);
            if (isPasswordVerified) {
                let token = jsonwebtoken_1.default.sign({
                    username: userObject === null || userObject === void 0 ? void 0 : userObject.username,
                    email: userObject === null || userObject === void 0 ? void 0 : userObject.email,
                }, process.env.TOKEN_SECRET || "", { expiresIn: "10m" });
                return { status: true, message: "User login successful", data: token };
            }
            else {
                return {
                    status: false,
                    message: "Incorrect password",
                };
            }
        }
        else {
            return {
                status: false,
                message: "No user found",
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            status: false,
            message: "User login failed",
            error: error === null || error === void 0 ? void 0 : error.toString(),
        };
    }
});
exports.userLogin = userLogin;
// check token validity
const tokenVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    console.log(`authentication.service | tokenVerification ${req.originalUrl}`);
    try {
        if (((_c = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _c === void 0 ? void 0 : _c.includes("/login")) ||
            ((_d = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _d === void 0 ? void 0 : _d.includes("/user-exist")) ||
            ((_e = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _e === void 0 ? void 0 : _e.includes("/register")) ||
            ((_f = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _f === void 0 ? void 0 : _f.includes("/refresh-token")))
            return next();
        let token = req === null || req === void 0 ? void 0 : req.headers["authorization"];
        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
            jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || "", (error, decoded) => {
                if (error) {
                    return res.status(401).json({
                        status: false,
                        message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid Token",
                        error: `Invalid token | ${error === null || error === void 0 ? void 0 : error.message}`,
                    });
                }
                else {
                    req.username = decoded === null || decoded === void 0 ? void 0 : decoded.username;
                    next();
                }
            });
        }
        else {
            return res.status(401).json({
                status: false,
                message: "Token is missing",
                error: "Token is missing",
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            status: false,
            message: (error === null || error === void 0 ? void 0 : error.message) ? error === null || error === void 0 ? void 0 : error.message : "Authentication failed",
            error: `Authentication failed | ${error === null || error === void 0 ? void 0 : error.message}`,
        });
    }
});
exports.tokenVerification = tokenVerification;
// refresh token validity
const tokenRefresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`authentication.service | tokenRefresh | ${req === null || req === void 0 ? void 0 : req.originalUrl}`);
    try {
        let token = req === null || req === void 0 ? void 0 : req.headers["authorization"];
        console.log(token);
        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token === null || token === void 0 ? void 0 : token.length);
            jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || "", {
                ignoreExpiration: true,
            }, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    return res.status(401).json({
                        status: false,
                        message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid token",
                        error: `Invalid token | ${error === null || error === void 0 ? void 0 : error.message}`,
                    });
                }
                else {
                    if ((decoded === null || decoded === void 0 ? void 0 : decoded.username) && (decoded === null || decoded === void 0 ? void 0 : decoded.email)) {
                        let newToken = jsonwebtoken_1.default.sign({
                            username: decoded === null || decoded === void 0 ? void 0 : decoded.username,
                            email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
                        }, process.env.TOKEN_SECRET || "", { expiresIn: "10m" });
                        return res.json({
                            status: true,
                            message: "Token refreshed successfully",
                            data: newToken,
                        });
                    }
                    else {
                        return res.status(401).json({
                            status: false,
                            message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid Token",
                            error: `Invalid token | ${error === null || error === void 0 ? void 0 : error.message}`,
                        });
                    }
                }
            }));
        }
        else {
            return res
                .status(401)
                .json({ status: false, message: "Token not found or token not valid" });
        }
    }
    catch (error) {
        return res.status(404).json({
            status: false,
            message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Token refresh failed",
            error: `Token refresh failed | ${error === null || error === void 0 ? void 0 : error.message}`,
        });
    }
});
exports.tokenRefresh = tokenRefresh;
