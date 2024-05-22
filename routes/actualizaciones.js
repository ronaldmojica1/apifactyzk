"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const ActualizacionController_1 = __importDefault(require("../controllers/actualizaciones/ActualizacionController"));
const router = (0, express_1.Router)();
exports.router = router;
router.post('/verificar', ActualizacionController_1.default.verificarActualizaciones);
router.post('/actualizar', ActualizacionController_1.default.actualizar);
