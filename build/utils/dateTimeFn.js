"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastDayOfMonth = exports.getFirstDayOfMonth = void 0;
function getFirstDayOfMonth(month, year) {
    return new Date(year, month - 1, 1);
}
exports.getFirstDayOfMonth = getFirstDayOfMonth;
function getLastDayOfMonth(month, year) {
    return new Date(year, month, 0);
}
exports.getLastDayOfMonth = getLastDayOfMonth;
