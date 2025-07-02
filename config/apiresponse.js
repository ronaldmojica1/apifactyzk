"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.notFoundResponse = notFoundResponse;
function successResponse(data, message) {
    return { success: true, data, message };
}
function errorResponse(message) {
    return { success: false, message, data: null };
}
function notFoundResponse(resource) {
    return errorResponse(`${resource} No encontrado`);
}
