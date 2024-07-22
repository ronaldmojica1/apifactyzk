"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const CierreController_1 = __importDefault(require("../controllers/factura/CierreController"));
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', session_1.checkJwt, CierreController_1.default.getR);
router.post('/', session_1.checkJwt, CierreController_1.default.updateR);
