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
const apiresponse_1 = require("../../config/apiresponse");
const Producto_1 = __importDefault(require("../../models/inventario/Producto"));
const TributosProducto_1 = __importDefault(require("../../models/inventario/TributosProducto"));
const TipoItem_1 = __importDefault(require("../../models/inventario/TipoItem"));
const Tributo_1 = __importDefault(require("../../models/inventario/Tributo"));
const UnidadMedida_1 = __importDefault(require("../../models/inventario/UnidadMedida"));
const TipoVenta_1 = __importDefault(require("../../models/inventario/TipoVenta"));
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const acts = yield Producto_1.default.findAll({
                include: [
                    {
                        model: TributosProducto_1.default,
                        as: 'tributos',
                        include: [
                            {
                                model: Tributo_1.default,
                                as: 'tributo'
                            }
                        ]
                    },
                    {
                        model: TipoItem_1.default,
                        as: 'tipoItem'
                    },
                    {
                        model: TipoVenta_1.default,
                        as: 'tipoVenta'
                    },
                    {
                        model: Tributo_1.default,
                        as: 'tributo'
                    },
                    {
                        model: UnidadMedida_1.default,
                        as: 'unidadMedida'
                    }
                ]
            });
            res.status(201).json((0, apiresponse_1.successResponse)(acts, ''));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)(error));
            console.log(error);
        }
    });
}
function createR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Producto_1.default.create(req.body);
            //Agregar los tributos
            let tributosList = req.body.tributos;
            if (tributosList != undefined) {
                tributosList.forEach((trib) => __awaiter(this, void 0, void 0, function* () {
                    trib.productoId = act.id;
                    yield TributosProducto_1.default.create(trib);
                }));
            }
            //end Agregar los tributos
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
            const act = yield Producto_1.default.findByPk(req.params.id);
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
            const act = yield Producto_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Eliminar los tributos relacionados
            yield TributosProducto_1.default.destroy({
                where: {
                    productoId: act.id
                }
            });
            //Eliminar
            yield act.destroy();
            res.json((0, apiresponse_1.successResponse)(act, 'Eliminado con exito!'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)(error));
        }
    });
}
function getR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Producto_1.default.findByPk(req.params.id, {
                include: [
                    {
                        model: TributosProducto_1.default,
                        as: 'tributos',
                        include: [
                            {
                                model: Tributo_1.default,
                                as: 'tributo'
                            }
                        ]
                    },
                    {
                        model: TipoItem_1.default,
                        as: 'tipoItem'
                    },
                    {
                        model: TipoVenta_1.default,
                        as: 'tipoVenta'
                    },
                    {
                        model: Tributo_1.default,
                        as: 'tributo'
                    },
                    {
                        model: UnidadMedida_1.default,
                        as: 'unidadMedida'
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
function verificateOrCreate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let items = req.body.items;
        for (let i = 0; i < items.length; i++) {
            //verificar si existe el producto
            let prod = yield Producto_1.default.findOne({
                where: {
                    codigo: items[i].codigo.toString()
                }
            });
            if (!prod) { //Si no existe crear
                const objItem = {
                    tipoItemId: req.body.tipoItemId,
                    tipoVentaId: req.body.tipoVentaId,
                    codigo: items[i].codigo,
                    descripcion: items[i].descripcion,
                    unidadMedidaId: items[i].unidadMedidaId,
                    precioUni: items[i].precioUni,
                    precioCompra: items[i].precioUni,
                    psv: items[i].precioUni,
                    tributoId: null,
                    porcentajeDesc: null,
                };
                prod = yield Producto_1.default.create(objItem);
            }
            items[i].productoId = prod.id;
            items[i].producto = prod;
        }
        res.status(200).json((0, apiresponse_1.successResponse)(items, "Productos validados!"));
    });
}
exports.default = {
    getAllR,
    createR,
    updateR,
    deleteR,
    getR,
    verificateOrCreate
};
