"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const ReporteController_1 = __importDefault(require("../controllers/reportes/ReporteController"));
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/ventasfechas', session_1.checkJwt, ReporteController_1.default.rptVentasFechas);
router.get('/usuariospermisos', session_1.checkJwt, ReporteController_1.default.rptUsuariosPermisos);
router.get('/plantillaivamhvcf', ReporteController_1.default.rptPlantillaIvaMhVcf);
router.get('/plantillaivamhvc', ReporteController_1.default.rptPlantillaIvaMhVc);
