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
exports.getOneServiceGroup = exports.getAllServiceGroups = exports.createServiceGroup = exports.updateServiceGroup = exports.deleteServiceGroup = void 0;
const constants_1 = require("./../configs/constants");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// get all service groups
const getAllServiceGroups = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.serviceGroups.findMany({
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
exports.getAllServiceGroups = getAllServiceGroups;
// get a service group
const getOneServiceGroup = (value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.serviceGroups.findUnique({
            where: {
                value: value,
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
exports.getOneServiceGroup = getOneServiceGroup;
// create a new service group
const createServiceGroup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.serviceGroups.create({
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
exports.createServiceGroup = createServiceGroup;
// update a service group
const updateServiceGroup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.serviceGroups.update({
            where: {
                value: data === null || data === void 0 ? void 0 : data.value,
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
exports.updateServiceGroup = updateServiceGroup;
// delete a service group
const deleteServiceGroup = (value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma.serviceGroups.delete({
            where: {
                value: value,
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
exports.deleteServiceGroup = deleteServiceGroup;
