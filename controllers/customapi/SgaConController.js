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
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
const Producto_1 = __importDefault(require("../../models/inventario/Producto"));
const apiresponse_1 = require("../../config/apiresponse");
const { v4: uuidv4 } = require('uuid');
//Funcion customizada solo para YZK
function verificarNoViaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { noViaje } = req.query;
            const act = yield Dte_1.default.findOne({
                where: {
                    noViaje: noViaje
                }
            });
            if (act) {
                res.status(200).json((0, apiresponse_1.successResponse)(act, ''));
            }
            else {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
            }
        }
        catch (error) {
            console.log(error);
            return res.status(200).json((0, apiresponse_1.errorResponse)('Error al verificar'));
        }
    });
}
function guardarFex(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener los datos
            const datos = req.body;
            //Verificar si existe el receptor o crear
            const receptor = datos.receptor;
            let receptorBd = yield Receptor_1.default.findOne({
                where: {
                    nombre: receptor.nombre,
                    direccion: receptor.direccion
                },
            });
            if (!receptorBd) {
                receptorBd = yield Receptor_1.default.create(receptor);
            }
            datos.receptorId = receptorBd.id;
            //Verificar si existe el cobrar a o crear
            const cobrarA = datos.cobrarA;
            //verificar si viene
            if (cobrarA) {
                let cobrarABd = yield Receptor_1.default.findOne({
                    where: {
                        nombre: cobrarA.nombre,
                        direccion: cobrarA.direccion
                    }
                });
                if (!cobrarABd) {
                    cobrarABd = yield Receptor_1.default.create(cobrarA);
                }
                datos.cobrarAId = cobrarABd.id;
            }
            //Verificar si existe el embarcar a o crear
            const embarcarA = datos.embarcarA;
            //verificar si viene
            if (embarcarA) {
                let embarcarABd = yield Receptor_1.default.findOne({
                    where: {
                        nombre: embarcarA.nombre,
                        direccion: embarcarA.direccion
                    }
                });
                if (!embarcarABd) {
                    embarcarABd = yield Receptor_1.default.create(embarcarA);
                }
                datos.embarcarAId = embarcarABd.id;
            }
            //Crear el DTE
            datos.codigoGeneracion = uuidv4().toUpperCase();
            const act = yield Dte_1.default.create(datos);
            //Agregar el detalle
            let itemsLst = datos.items;
            if (itemsLst != undefined) {
                itemsLst.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    //Verificar si existe el producto .........OJO SI SE EVALUA DEJAR NULL el productoId esto elimina
                    let productoBd = yield Producto_1.default.findOne({
                        where: {
                            codigo: item.producto.codigo
                        }
                    });
                    if (!productoBd) { //Si no existe crear
                        productoBd = yield Producto_1.default.create(item.producto);
                    }
                    item.dteId = act.id;
                    item.productoId = productoBd.id;
                    yield CuerpoDocumento_1.default.create(item);
                }));
            }
            res.json((0, apiresponse_1.successResponse)(act, "Generado"));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)("Error al crear"));
        }
    });
}
exports.default = {
    guardarFex,
    verificarNoViaje
};
