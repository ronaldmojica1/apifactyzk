"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundResponse = exports.errorResponse = exports.successResponse = void 0;
function successResponse(data, message) {
    return { success: true, data, message };
}
exports.successResponse = successResponse;
function errorResponse(message) {
    return { success: false, message, data: null };
}
exports.errorResponse = errorResponse;
function notFoundResponse(resource) {
    return errorResponse(`${resource} No encontrado`);
}
exports.notFoundResponse = notFoundResponse;
