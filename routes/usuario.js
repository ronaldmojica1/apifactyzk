"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const UsuarioController_1 = __importDefault(require("../controllers/auth/UsuarioController"));
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', session_1.checkJwt, UsuarioController_1.default.getAllR);
router.get('/:id', session_1.checkJwt, UsuarioController_1.default.getR);
router.post('/', session_1.checkJwt, UsuarioController_1.default.createR);
router.put('/:id', session_1.checkJwt, UsuarioController_1.default.updateR);
router.delete('/:id', session_1.checkJwt, UsuarioController_1.default.deleteR);
router.post('/login', UsuarioController_1.default.login);
router.get('/permisos/:id', session_1.checkJwt, UsuarioController_1.default.getPermisosUsuario);
