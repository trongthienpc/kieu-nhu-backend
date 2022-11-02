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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneServices = exports.deleteService = exports.updateService = exports.createService = exports.getAllServices = void 0;
const constants_1 = require("./../configs/constants");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// get all services
const getAllServices = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.services.findMany({
            where: {
                status: true,
            },
        });
        return {
            success: true,
            message: constants_1.GET_SUCCESS,
            data: res,
        };
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
        return {
            success: false,
            message: constants_1.ERROR,
            data: error === null || error === void 0 ? void 0 : error.message,
        };
    }
});
exports.getAllServices = getAllServices;
// get a services
const getOneServices = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.services.findUnique({
            where: {
                id: id,
            },
        });
        return {
            success: true,
            message: constants_1.GET_SUCCESS,
            data: res,
        };
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
        return {
            success: false,
            message: constants_1.ERROR,
            data: error === null || error === void 0 ? void 0 : error.message,
        };
    }
});
exports.getOneServices = getOneServices;
// create a new service
const createService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.services.create({
            data: data,
        });
        if (res) {
            return {
                success: true,
                message: constants_1.POST_SUCCESS,
                data: res,
            };
        }
    }
    catch (error) {
        return {
            success: false,
            message: constants_1.ERROR,
            data: error === null || error === void 0 ? void 0 : error.message,
        };
    }
});
exports.createService = createService;
// update a service
const updateService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.services.update({
            where: {
                id: data.id,
            },
            data: data,
        });
        return {
            success: false,
            message: constants_1.UPDATE_SUCCESS,
            data: res,
        };
    }
    catch (error) {
        return {
            success: false,
            message: constants_1.ERROR,
            data: error === null || error === void 0 ? void 0 : error.message,
        };
    }
});
exports.updateService = updateService;
// delete a service
const deleteService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.services.delete({
            where: {
                id: id,
            },
        });
        return {
            success: true,
            message: constants_1.DELETE_SUCCESS,
            data: res,
        };
    }
    catch (error) {
        return {
            success: false,
            message: constants_1.ERROR,
            data: error === null || error === void 0 ? void 0 : error.message,
        };
    }
});
exports.deleteService = deleteService;
