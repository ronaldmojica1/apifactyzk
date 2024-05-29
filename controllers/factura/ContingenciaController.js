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
const Contingencia_1 = __importDefault(require("../../models/factura/Contingencia"));
const apiresponse_1 = require("../../config/apiresponse");
const TipoContingencia_1 = __importDefault(require("../../models/factura/TipoContingencia"));
const Emisor_1 = __importDefault(require("../../models/factura/Emisor"));
const ContingenciaDetalle_1 = __importDefault(require("../../models/factura/ContingenciaDetalle"));
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
const { v4: uuidv4 } = require('uuid');
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const acts = yield Contingencia_1.default.findAll({
                include: [
                    {
                        model: TipoContingencia_1.default,
                        as: 'tipoContingencia'
                    },
                    {
                        model: Emisor_1.default,
                        as: 'emisor'
                    }
                ]
            });
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
            req.body.codigoGeneracion = uuidv4().toUpperCase();
            const act = yield Contingencia_1.default.create(req.body);
            //Guardar el detalle
            const detalleLst = req.body.detalle;
            if (detalleLst != undefined) {
                detalleLst.forEach((detalle) => __awaiter(this, void 0, void 0, function* () {
                    detalle.contingenciaId = act.id;
                    const actDetalle = yield ContingenciaDetalle_1.default.create(detalle);
                    //Actualizar el tipo de  contingencia del DTE
                    const dte = yield Dte_1.default.findByPk(actDetalle.dteId);
                    if (dte) {
                        dte.tipoContingenciaId = act.tipoContingenciaId;
                        dte.motivoContingencia = act.motivoContingencia;
                        dte.save();
                    }
                }));
            }
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
            const act = yield Contingencia_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            yield act.update(req.body);
            //Actualizar el detalle
            const detalleLst = req.body.detalle;
            if (detalleLst != undefined) {
                detalleLst.forEach((detalle) => __awaiter(this, void 0, void 0, function* () {
                    //Buscar dte del detalle lo utilizaremos
                    const dte = yield Dte_1.default.findByPk(detalle.dteId);
                    //verificar confirmaciones
                    if (detalle.confirmacion == "Eliminado") {
                        yield ContingenciaDetalle_1.default.findByPk(detalle.id).then((det) => det === null || det === void 0 ? void 0 : det.destroy());
                    }
                    else if (detalle.confirmacion == "Agregado") {
                        detalle.contingenciaId = act.id;
                        yield ContingenciaDetalle_1.default.create(detalle);
                    }
                    else {
                        yield ContingenciaDetalle_1.default.findByPk(detalle.id).then((det) => det === null || det === void 0 ? void 0 : det.update(detalle));
                    }
                    if (dte) {
                        if (detalle.confirmacion == "Eliminado") {
                            dte.tipoContingenciaId = null;
                            dte.motivoContingencia = null;
                            dte.save();
                        }
                        else {
                            dte.tipoContingenciaId = act.tipoContingenciaId;
                            dte.motivoContingencia = act.motivoContingencia;
                            dte.save();
                        }
                    }
                }));
            }
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
            const act = yield Contingencia_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Actualizar los DTE del detalle
            const detalleLst = yield ContingenciaDetalle_1.default.findAll({
                where: {
                    contingenciaId: act.id
                }
            });
            detalleLst.forEach((det) => __awaiter(this, void 0, void 0, function* () {
                yield Dte_1.default.findByPk(det.dteId).then((d) => {
                    d === null || d === void 0 ? void 0 : d.update({
                        tipoContingenciaId: null,
                        motivoContingencia: null,
                    });
                });
            }));
            //Eliminar el detalle
            ContingenciaDetalle_1.default.destroy({
                where: {
                    contingenciaId: act.id
                }
            });
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
            const act = yield Contingencia_1.default.findByPk(req.params.id, {
                include: [
                    {
                        model: TipoContingencia_1.default,
                        as: 'tipoContingencia'
                    },
                    {
                        model: Emisor_1.default,
                        as: 'emisor'
                    },
                    {
                        model: ContingenciaDetalle_1.default,
                        as: 'detalle',
                        include: [
                            {
                                model: Dte_1.default,
                                as: 'dte',
                                include: [
                                    {
                                        model: Receptor_1.default,
                                        as: 'receptor'
                                    },
                                    {
                                        model: TipoDte_1.default,
                                        as: 'tipoDte'
                                    }
                                ]
                            }
                        ]
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
