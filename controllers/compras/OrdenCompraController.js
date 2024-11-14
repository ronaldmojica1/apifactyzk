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
const OrdenCompra_1 = __importDefault(require("../../models/compras/OrdenCompra"));
const apiresponse_1 = require("../../config/apiresponse");
const Emisor_1 = __importDefault(require("../../models/factura/Emisor"));
const Proveedor_1 = __importDefault(require("../../models/compras/Proveedor"));
const CondicionOperacions_1 = __importDefault(require("../../models/factura/CondicionOperacions"));
const Usuario_1 = __importDefault(require("../../models/auth/Usuario"));
const OrdenCompraDetalle_1 = __importDefault(require("../../models/compras/OrdenCompraDetalle"));
const Producto_1 = __importDefault(require("../../models/inventario/Producto"));
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const acts = yield OrdenCompra_1.default.findAll({
                include: [
                    {
                        model: Emisor_1.default,
                        as: 'sucursal'
                    },
                    {
                        model: Proveedor_1.default,
                        as: 'proveedor'
                    },
                    {
                        model: CondicionOperacions_1.default,
                        as: 'condicionOperacion'
                    },
                    {
                        model: Usuario_1.default,
                        as: 'creadoPor'
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
            req.body.creadoPorId = req.user.id;
            const act = yield OrdenCompra_1.default.create(req.body);
            //Agregar el detalle
            const itemsLst = req.body.items;
            if (itemsLst != undefined) {
                itemsLst.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    item.ordenCompraId = act.id;
                    console.log(item);
                    const actItm = yield OrdenCompraDetalle_1.default.create(item);
                }));
            }
            res.status(201).json((0, apiresponse_1.successResponse)(act, 'Creado con exito!'));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al crear'));
        }
    });
}
function updateR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield OrdenCompra_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            yield act.update(req.body);
            //Actualizar el detalle.
            let itemsLst = req.body.items;
            if (itemsLst != undefined) {
                itemsLst.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    //Verificar si tiene confirmacion
                    if (item.confirmacion == 'Eliminado') {
                        yield OrdenCompraDetalle_1.default.findByPk(item.id).then((itm) => itm === null || itm === void 0 ? void 0 : itm.destroy());
                    }
                    else if (item.confirmacion == 'Agregado') {
                        item.dteId = act.id;
                        yield OrdenCompraDetalle_1.default.create(item);
                    }
                    else {
                        yield OrdenCompraDetalle_1.default.findByPk(item.id).then((itm) => itm === null || itm === void 0 ? void 0 : itm.update(item));
                    }
                }));
            }
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
            const act = yield OrdenCompra_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Eliminar el detalle
            yield OrdenCompraDetalle_1.default.destroy({
                where: {
                    ordenCompraId: req.params.id
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
            const act = yield OrdenCompra_1.default.findByPk(req.params.id, {
                include: [
                    {
                        model: Emisor_1.default,
                        as: 'sucursal'
                    },
                    {
                        model: Proveedor_1.default,
                        as: 'proveedor'
                    },
                    {
                        model: CondicionOperacions_1.default,
                        as: 'condicionOperacion'
                    },
                    {
                        model: Usuario_1.default,
                        as: 'creadoPor'
                    },
                    {
                        model: OrdenCompraDetalle_1.default,
                        as: 'items',
                        include: [
                            {
                                model: Producto_1.default,
                                as: 'producto'
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
            console.log(error);
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
