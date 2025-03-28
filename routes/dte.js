"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const DteController_1 = __importDefault(require("../controllers/factura/DteController"));
const session_1 = require("../middleware/session");
const MulterController_1 = require("../controllers/multer/MulterController");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', session_1.checkJwt, DteController_1.default.getAllR);
router.get('/:id', session_1.checkJwt, DteController_1.default.getR);
router.post('/', session_1.checkJwt, DteController_1.default.createR);
router.put('/:id', session_1.checkJwt, DteController_1.default.updateR);
router.delete('/:id', session_1.checkJwt, DteController_1.default.deleteR);
router.post('/duplicar/:id', session_1.checkJwt, DteController_1.default.duplicar);
router.post('/correo/enviar', MulterController_1.upload.array('files'), function (req, res, next) {
    DteController_1.default.enviarDocsCorreo(req, res);
});
