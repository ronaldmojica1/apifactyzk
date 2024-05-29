"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const DteMhController_1 = __importDefault(require("../controllers/dte/DteMhController"));
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/transmitirdte', session_1.checkJwt, DteMhController_1.default.transmitirDte);
router.post('/anulardte', session_1.checkJwt, DteMhController_1.default.anularDte);
router.post('/transmitircontingencia', session_1.checkJwt, DteMhController_1.default.transmitirContingencia);
router.post('/transmitirlote', session_1.checkJwt, DteMhController_1.default.transmitirLote);
router.post('/consultarlote', session_1.checkJwt, DteMhController_1.default.consultaLote);
router.post('/versionlegible', session_1.checkJwt, DteMhController_1.default.getVersionLegible);
router.post('/descargarjson', session_1.checkJwt, DteMhController_1.default.descargarJsonMh);
