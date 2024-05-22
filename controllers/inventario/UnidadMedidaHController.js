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
const UnidadMedidaH_1 = __importDefault(require("../../models/homologaciones/UnidadMedidaH"));
const apiresponse_1 = require("../../config/apiresponse");
const UnidadMedida_1 = __importDefault(require("../../models/inventario/UnidadMedida"));
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const acts = yield UnidadMedidaH_1.default.findAll();
            res.status(201).json((0, apiresponse_1.successResponse)(acts, ''));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function createR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield UnidadMedidaH_1.default.create(req.body);
            res.status(201).json((0, apiresponse_1.successResponse)(act, 'Creado con exito!'));
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
            const act = yield UnidadMedidaH_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            yield act.update(req.body);
            res.json((0, apiresponse_1.successResponse)(act, 'Actualizado con exito'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al eliminar'));
        }
    });
}
function deleteR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield UnidadMedidaH_1.default.findByPk(req.params.id);
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
            const act = yield UnidadMedidaH_1.default.findByPk(req.params.id);
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
function verificateOrCreate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const unidades = req.body.unidades;
        for (let i = 0; i < unidades.length; i++) {
            //verificar si existe la unidad como principal
            const undPrincipal = yield UnidadMedida_1.default.findOne({
                where: {
                    codigo: isNaN(parseInt(unidades[i].unidadMedidaCod)) ? 0 : parseInt(unidades[i].unidadMedidaCod)
                }
            });
            if (undPrincipal) { //Si la unidad principal existe
                unidades[i].unidadMedidaId = undPrincipal.id;
                unidades[i].unidadMedida = undPrincipal;
            }
            else { //buscar en la tabla de homologaciones
                const undHomologada = yield UnidadMedidaH_1.default.findOne({
                    where: {
                        codigo: unidades[i].unidadMedidaCod
                    }
                });
                if (undHomologada) { //Si se encontro la unidad homologada
                    unidades[i].unidadMedidaId = undHomologada.unidadMedidaId;
                    const undPrincipalH = yield UnidadMedida_1.default.findByPk(undHomologada.unidadMedidaId);
                    unidades[i].unidadMedida = undPrincipalH;
                }
                else { //Si no se encuentra verificar si se puede crear o notificar para que se cree
                    //Verificar si tiene el unidadMedidaId para crear en la tabla de honologaciones
                    if (unidades[i].unidadMedidaId != null) {
                        const umh = yield UnidadMedidaH_1.default.create({
                            codigo: unidades[i].unidadMedidaCod,
                            unidadMedidaId: unidades[i].unidadMedidaId
                        });
                        unidades[i].unidadMedida = umh;
                    }
                }
            }
        }
        //DEvolver el mismo arreglo con las unidades de medida que deberia tener la unidadMedidaId del MH
        res.status(200).json((0, apiresponse_1.successResponse)(unidades, "Unidades validadas!"));
    });
}
exports.default = {
    getAllR,
    createR,
    updateR,
    deleteR,
    getR,
    verificateOrCreate,
};
