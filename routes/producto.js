"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const ProductoController_1 = __importDefault(require("../controllers/inventario/ProductoController"));
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', session_1.checkJwt, ProductoController_1.default.getAllR);
router.get('/search/sp', session_1.checkJwt, ProductoController_1.default.search);
router.get('/:id', session_1.checkJwt, ProductoController_1.default.getR);
router.post('/', session_1.checkJwt, ProductoController_1.default.createR);
router.put('/:id', session_1.checkJwt, ProductoController_1.default.updateR);
router.delete('/:id', session_1.checkJwt, ProductoController_1.default.deleteR);
router.post('/verificarocrear', session_1.checkJwt, ProductoController_1.default.verificateOrCreate);
