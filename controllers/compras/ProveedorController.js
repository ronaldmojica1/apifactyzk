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
const Proveedor_1 = __importDefault(require("../../models/compras/Proveedor"));
const apiresponse_1 = require("../../config/apiresponse");
const TipoDocumento_1 = __importDefault(require("../../models/factura/TipoDocumento"));
const ActividadEconomica_1 = __importDefault(require("../../models/factura/ActividadEconomica"));
const Pais_1 = __importDefault(require("../../models/region/Pais"));
const Departamento_1 = __importDefault(require("../../models/region/Departamento"));
const Municipio_1 = __importDefault(require("../../models/region/Municipio"));
const TipoPersona_1 = __importDefault(require("../../models/factura/TipoPersona"));
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const acts = yield Proveedor_1.default.findAll({
                include: [
                    {
                        model: TipoDocumento_1.default,
                        as: 'tipoDocumento'
                    },
                    {
                        model: ActividadEconomica_1.default,
                        as: 'actividadEconomica'
                    },
                    {
                        model: Pais_1.default,
                        as: 'pais',
                    },
                    {
                        model: Departamento_1.default,
                        as: 'departamento'
                    },
                    {
                        model: Municipio_1.default,
                        as: 'municipio'
                    },
                    {
                        model: TipoPersona_1.default,
                        as: 'tipoPersona'
                    }
                ]
            });
            res.status(201).json((0, apiresponse_1.successResponse)(acts, ''));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function createR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Proveedor_1.default.create(req.body);
            res.status(201).json((0, apiresponse_1.successResponse)(act, 'Creado con exito!'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al crear'));
        }
    });
}
function updateR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Proveedor_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            yield act.update(req.body);
            res.json((0, apiresponse_1.successResponse)(act, 'Actualizado con exito'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)(error));
        }
    });
}
function deleteR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Proveedor_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Eliminar
            yield act.destroy();
            res.json((0, apiresponse_1.successResponse)(act, 'Eliminado con exito!'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al eliminar'));
        }
    });
}
function getR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Proveedor_1.default.findByPk(req.params.id, {
                include: [
                    {
                        model: TipoDocumento_1.default,
                        as: 'tipoDocumento'
                    },
                    {
                        model: ActividadEconomica_1.default,
                        as: 'actividadEconomica'
                    },
                    {
                        model: Pais_1.default,
                        as: 'pais',
                    },
                    {
                        model: Departamento_1.default,
                        as: 'departamento'
                    },
                    {
                        model: Municipio_1.default,
                        as: 'municipio'
                    },
                    {
                        model: TipoPersona_1.default,
                        as: 'tipoPersona'
                    }
                ]
            });
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Ver
            res.json((0, apiresponse_1.successResponse)(act, ''));
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
