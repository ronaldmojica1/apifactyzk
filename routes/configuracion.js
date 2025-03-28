"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const ConfiguracionController_1 = __importDefault(require("../controllers/configuracion/ConfiguracionController"));
const session_1 = require("../middleware/session");
const MulterController_1 = require("../controllers/multer/MulterController");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', session_1.checkJwt, ConfiguracionController_1.default.getConfig);
router.post('/', session_1.checkJwt, MulterController_1.upload.single('logo'), function (req, res, next) {
    ConfiguracionController_1.default.updateConfig(req, res);
});
