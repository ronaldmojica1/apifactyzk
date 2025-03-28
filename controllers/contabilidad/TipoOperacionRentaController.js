"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TipoOperacionRenta_1 = __importDefault(require("../../models/contabilidad/TipoOperacionRenta"));
const apiresponse_1 = require("../../config/apiresponse");
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operaciones = yield TipoOperacionRenta_1.default.findAll();
            res.status(201).json((0, apiresponse_1.successResponse)(operaciones, ''));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function createR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operacion = yield TipoOperacionRenta_1.default.create(req.body);
            res.status(201).json((0, apiresponse_1.successResponse)(operacion, 'Creado con exito!'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al crear'));
        }
        console.log(req.body);
    });
}
function updateR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operacion = yield TipoOperacionRenta_1.default.findByPk(req.params.id);
            if (!operacion) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            yield operacion.update(req.body);
            res.json((0, apiresponse_1.successResponse)(operacion, 'Actualizado con exito'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al actualizar'));
        }
    });
}
function deleteR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operacion = yield TipoOperacionRenta_1.default.findByPk(req.params.id);
            if (!operacion) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Eliminar
            yield operacion.destroy();
            res.json((0, apiresponse_1.successResponse)(operacion, 'Eliminado con exito!'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al eliminar'));
        }
    });
}
function getR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operacion = yield TipoOperacionRenta_1.default.findByPk(req.params.id);
            if (!operacion) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Ver
            res.json((0, apiresponse_1.successResponse)(operacion, ''));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al buscar'));
        }
    });
}
exports.default = {
    getAllR,
    createR,
    updateR,
    deleteR,
    getR
};
