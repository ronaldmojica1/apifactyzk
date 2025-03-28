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
exports.getItems = void 0;
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
const RetencionMH_1 = __importDefault(require("../../models/factura/RetencionMH"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
const TipoGeneracion_1 = __importDefault(require("../../models/factura/TipoGeneracion"));
const TributosItem_1 = __importDefault(require("../../models/factura/TributosItem"));
const Producto_1 = __importDefault(require("../../models/inventario/Producto"));
const TipoItem_1 = __importDefault(require("../../models/inventario/TipoItem"));
const Tributo_1 = __importDefault(require("../../models/inventario/Tributo"));
const UnidadMedida_1 = __importDefault(require("../../models/inventario/UnidadMedida"));
function getItems(dte) {
    return __awaiter(this, void 0, void 0, function* () {
        let items = [];
        let itemsDte = yield CuerpoDocumento_1.default.findAll({
            where: {
                dteId: dte === null || dte === void 0 ? void 0 : dte.id
            },
            order: [['numItem', 'ASC']],
        });
        for (const itm of itemsDte) {
            const producto = yield Producto_1.default.findByPk(itm.productoId);
            const tipoItem = yield TipoItem_1.default.findByPk(itm === null || itm === void 0 ? void 0 : itm.tipoItemId);
            const tributoProd = yield Tributo_1.default.findByPk(producto === null || producto === void 0 ? void 0 : producto.tributoId);
            const um = yield UnidadMedida_1.default.findByPk(itm === null || itm === void 0 ? void 0 : itm.unidadMedidaId);
            const tributosProd = yield TributosItem_1.default.findAll({
                where: {
                    itemId: itm.id
                }
            });
            let tributosLstProd = [];
            for (const trib of tributosProd) {
                const tribuP = yield Tributo_1.default.findByPk(trib.tributoId);
                if (tribuP) {
                    tributosLstProd.push(tribuP.codigo);
                    console.log(tributosLstProd);
                }
            }
            //Verificar si tiene elementos o convertir a null
            if (tributosLstProd.length == 0) {
                tributosLstProd = null;
            }
            const tipoDte = yield TipoDte_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.tipoDteId);
            const tipoGeneracion = yield TipoGeneracion_1.default.findByPk(itm.tipoGeneracionId);
            const retencionMh = yield RetencionMH_1.default.findByPk(itm.retencionMhId);
            console.log('/******Abajo los calculos de tipodte e item.ventanosuj*****/');
            console.log('venta no suje ' + itm.ventaNoSuj);
            console.log('tipoDte ' + (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo));
            console.log(" la evaluacion " + (itm.ventaNoSuj > 0 && (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo) === '11'));
            items.push({
                numItem: itm.numItem,
                tipoItem: tipoItem === null || tipoItem === void 0 ? void 0 : tipoItem.codigo,
                codigo: (producto === null || producto === void 0 ? void 0 : producto.codigo) || null,
                codTributo: (tributoProd === null || tributoProd === void 0 ? void 0 : tributoProd.codigo) || null,
                uniMedida: (um === null || um === void 0 ? void 0 : um.codigo) || 0,
                descripcion: ((itm === null || itm === void 0 ? void 0 : itm.descripcion) || '') + (itm.observaciones != null ? ('(' + itm.observaciones + ')') : ''),
                cantidad: itm.cantidad,
                precioUni: (itm.noGravado > 0 ? 0 : itm.precioUni),
                montoDescu: itm.montoDescu,
                ventaNoSuj: itm.ventaNoSuj,
                ventaExenta: itm.ventaExenta,
                ventaGravada: itm.ventaGravada,
                tributos: tributosLstProd,
                psv: ((producto === null || producto === void 0 ? void 0 : producto.psv) != null ? (Math.round(producto.psv * 100) / 100) : itm.precioUni) || 0,
                noGravado: itm.noGravado,
                ivaItem: Math.round((itm.ventaGravada - (itm.ventaGravada / 1.13)) * 100) / 100,
                //Cuando el tipo de Item es Documento CL(varios DTE),CR(solo 1 dte),NC(de un item solo numero),ND(de un item solo numero),NR(de un item solo numero)            
                tipoDte: tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo,
                tipoDoc: tipoGeneracion === null || tipoGeneracion === void 0 ? void 0 : tipoGeneracion.codigo,
                tipoGeneracion: tipoGeneracion === null || tipoGeneracion === void 0 ? void 0 : tipoGeneracion.codigo,
                numDocumento: itm.numeroDocumento,
                numeroDocumento: itm.numeroDocumento,
                fechaEmision: itm.fechaEmision,
                fechaGeneracion: itm.fechaEmision,
                montoSujetoGrav: itm.montoSujetoGrav,
                codigoRetencionMH: retencionMh === null || retencionMh === void 0 ? void 0 : retencionMh.codigo,
                ivaRetenido: itm.ivaRetenido,
                exportaciones: itm.exportaciones,
                obsItem: itm.obsItem,
                //Datos de DCL
                periodoLiquidacionFechaInicio: itm.periodoLiquidacionFechaInicio,
                periodoLiquidacionFechaFin: itm.periodoLiquidacionFechaFin,
                codLiquidacion: itm.codLiquidacion,
                cantidadDoc: itm.cantidadDoc,
                valorOperaciones: itm.valorOperaciones,
                montoSinPercepcion: itm.montoSinPercepcion,
                descripSinPercepcion: itm.descripSinPercepcion,
                subTotal: itm.subTotal,
                iva: itm.iva,
                montoSujetoPercepcion: itm.montoSinPercepcion,
                ivaPercibido: itm.ivaPercibido,
                comision: itm.comision,
                porcentComision: itm.porcentComision,
                ivaComision: itm.ivaComision,
                liquidoApagar: itm.liquidoApagar,
                totalLetras: itm.totalLetras,
                observaciones: itm.observaciones,
                //Factura de Sujeto Excluido
                compra: itm.ventaGravada + itm.ventaExenta + itm.ventaNoSuj //Solo es un campo independiente la que se use
            });
        }
        return items;
    });
}
exports.getItems = getItems;
