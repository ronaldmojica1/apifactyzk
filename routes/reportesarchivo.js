"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const ReportesArchivoController_1 = __importDefault(require("../controllers/reportes/ReportesArchivoController"));
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/libroventascustyzk', session_1.checkJwt, ReportesArchivoController_1.default.rptLibroVentasXlsCustYzk);
router.get('/librocomprascustyzk', session_1.checkJwt, ReportesArchivoController_1.default.rptLibroComprasXlsCustYzk);
router.get('/libroventascontrcustyzk', session_1.checkJwt, ReportesArchivoController_1.default.rptLibroVentasContrCustYzk);
