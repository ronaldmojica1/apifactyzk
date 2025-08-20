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
exports.getResumen = getResumen;
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
const functions_1 = require("../../utils/functions");
const CondicionOperacions_1 = __importDefault(require("../../models/factura/CondicionOperacions"));
const Incoterms_1 = __importDefault(require("../../models/factura/Incoterms"));
const PagoDte_1 = __importDefault(require("../../models/factura/PagoDte"));
const FormaPago_1 = __importDefault(require("../../models/factura/FormaPago"));
const Plazo_1 = __importDefault(require("../../models/factura/Plazo"));
const TributosItem_1 = __importDefault(require("../../models/factura/TributosItem"));
const Tributo_1 = __importDefault(require("../../models/inventario/Tributo"));
function getResumen(dte) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemsDte = yield CuerpoDocumento_1.default.findAll({
            where: {
                dteId: dte === null || dte === void 0 ? void 0 : dte.id
            }
        });
        const totalNoSuj = Math.round((itemsDte.reduce((pv, cv) => pv + cv.ventaNoSuj, 0) * 100)) / 100;
        const totalExenta = Math.round((itemsDte.reduce((pv, cv) => pv + cv.ventaExenta, 0) * 100)) / 100;
        const totalGravada = Math.round((itemsDte.reduce((pv, cv) => pv + cv.ventaGravada, 0) * 100)) / 100;
        const subTotalVentas = Math.round((totalNoSuj + totalExenta + totalGravada) * 100) / 100;
        const descuItems = itemsDte.reduce((pv, cv) => pv + cv.montoDescu, 0);
        const subTotalDescuentos = ((dte === null || dte === void 0 ? void 0 : dte.descuNoSuj) || 0) + ((dte === null || dte === void 0 ? void 0 : dte.descuExenta) || 0) + ((dte === null || dte === void 0 ? void 0 : dte.descuGravada) || 0);
        const porcentajeDescuento = subTotalVentas == 0 ? 0 : Math.round(((subTotalDescuentos / subTotalVentas) * 100) * 100) / 100;
        const totalNoGravado = itemsDte.reduce((pv, cv) => pv + cv.noGravado, 0);
        const totalIva = (dte === null || dte === void 0 ? void 0 : dte.tipoDteId) == 1 ? Math.round((totalGravada - (totalGravada / 1.13)) * 100) / 100 : Math.round((totalGravada * 0.13) * 100) / 100; //itemsDte.reduce((pv,cv) => pv + cv.iva,0);//Ojo para mientras
        //const totalIva = Math.round((totalGravada  * 0.13) * 100) / 100 ; //itemsDte.reduce((pv,cv) => pv + cv.iva,0);//Ojo para mientras
        const condicionOperacion = yield CondicionOperacions_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.condicionOperacionId);
        const incoterm = yield Incoterms_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.incotermId);
        const totalSujetoRetencion = itemsDte.reduce((pv, cv) => pv + cv.montoSujetoGrav, 0);
        const totalIVAretenido = itemsDte.reduce((pv, cv) => pv + cv.ivaRetenido, 0);
        const totalExportacion = itemsDte.reduce((pv, cv) => pv + cv.exportaciones, 0);
        const totalCompra = Math.round((totalExenta + totalNoSuj + totalGravada) * 100) / 100; //Ojo hay campo de compras pero se usa venta gravada
        let pagosDte = yield PagoDte_1.default.findAll({
            where: {
                dteId: dte === null || dte === void 0 ? void 0 : dte.id
            }
        });
        let pagos = [];
        pagosDte.forEach((pago) => __awaiter(this, void 0, void 0, function* () {
            const formaPago = yield FormaPago_1.default.findByPk(pago.formaPagoId);
            const plazo = yield Plazo_1.default.findByPk(pago.plazoId);
            pagos === null || pagos === void 0 ? void 0 : pagos.push({
                codigo: (formaPago === null || formaPago === void 0 ? void 0 : formaPago.codigo) || '',
                montoPago: pago.montoPago,
                referencia: pago.referencia,
                plazo: (plazo === null || plazo === void 0 ? void 0 : plazo.codigo) || '',
                periodo: pago.periodo
            });
        }));
        //Si no hay pagos colocarlo en null
        if (pagos.length == 0) {
            pagos = null;
        }
        let tributos = [];
        const tributosItem = yield TributosItem_1.default.findAll({
            where: {
                dteId: dte === null || dte === void 0 ? void 0 : dte.id
            },
            include: [
                {
                    model: Tributo_1.default,
                    as: 'tributo'
                }
            ]
        });
        const tributosItemJson = tributosItem.map((trib) => trib.toJSON());
        let tributosTmp = [];
        let subTotalTributosAdicionales = 0;
        const tributosMap = new Map();
        for (const tributo of tributosItemJson) {
            const tributoId = tributo.tributoId;
            const subTotal = (Math.round(tributo.subTotal * 100) / 100);
            if (!tributosMap.has(tributoId)) { //Si no existe agregar am map            
                tributosMap.set(tributoId, {
                    codigo: tributo.tributo.codigo,
                    descripcion: tributo.tributo.tributo,
                    valor: subTotal,
                    tributo: tributo.tributo,
                });
            }
            else { //si existe sumar el subtotal
                const existTributo = tributosMap.get(tributoId);
                existTributo.valor += subTotal;
                existTributo.valor = (Math.round(existTributo.valor * 100) / 100);
            }
            subTotalTributosAdicionales += subTotal;
        }
        // todos los tributos de tributosMap que tengan tributo.porcentaje ? deberan aplicarse el descuento de dte.descuGravada           
        tributosMap.forEach((tributo) => {
            if (tributo.tributo.porcentaje) {
                const tributoDescuento = ((dte === null || dte === void 0 ? void 0 : dte.descuGravada) || 0) * (tributo.tributo.porcentaje / 100);
                tributo.valor -= tributoDescuento;
                tributo.valor = (Math.round(tributo.valor * 100) / 100);
                subTotalTributosAdicionales -= tributoDescuento;
            }
        });
        subTotalTributosAdicionales = (Math.round(subTotalTributosAdicionales * 100) / 100);
        tributosTmp = Array.from(tributosMap.values());
        //Asignar a la interfaz de resumen
        tributos = tributosTmp.length > 0 ? tributosTmp : null;
        const resumen = {
            totalNoSuj: totalNoSuj,
            totalExenta: totalExenta,
            totalGravada: totalGravada,
            subTotalVentas: subTotalVentas,
            descuNoSuj: (dte === null || dte === void 0 ? void 0 : dte.descuNoSuj) || 0,
            descuExenta: (dte === null || dte === void 0 ? void 0 : dte.descuExenta) || 0,
            descuGravada: (dte === null || dte === void 0 ? void 0 : dte.descuGravada) || 0,
            descuento: (dte === null || dte === void 0 ? void 0 : dte.descuGravada) || 0, //FEX (Se guarda en descugravada)
            porcentajeDescuento: porcentajeDescuento,
            totalDescu: Math.round((descuItems + subTotalDescuentos) * 100) / 100,
            tributos: tributos,
            subTotal: Math.round((subTotalVentas - subTotalDescuentos) * 100) / 100,
            ivaRete1: (dte === null || dte === void 0 ? void 0 : dte.ivaRete1) || 0,
            ivaPerci1: (dte === null || dte === void 0 ? void 0 : dte.ivaPerci1) || 0, //CCF    
            reteRenta: (dte === null || dte === void 0 ? void 0 : dte.reteRenta) || 0,
            //montoTotalOperacion : Math.round(((subTotalVentas - subTotalDescuentos - (dte?.ivaRete1 || 0) - (dte?.reteRenta || 0) + (dte?.ivaPerci1 || 0) + subTotalTributosAdicionales) * 100))/100 ,
            montoTotalOperacion: Math.round(((subTotalVentas - subTotalDescuentos + subTotalTributosAdicionales) * 100)) / 100,
            totalNoGravado: totalNoGravado,
            totalPagar: Math.round(((totalGravada + totalExenta + totalNoSuj) - (subTotalDescuentos) + totalNoGravado - ((dte === null || dte === void 0 ? void 0 : dte.ivaRete1) || 0) - ((dte === null || dte === void 0 ? void 0 : dte.reteRenta) || 0) + ((dte === null || dte === void 0 ? void 0 : dte.ivaPerci1) || 0) + subTotalTributosAdicionales) * 100) / 100,
            totalLetras: (0, functions_1.numeroALetras)(Math.round(((totalGravada + totalExenta + totalNoSuj) - (subTotalDescuentos) + totalNoGravado - ((dte === null || dte === void 0 ? void 0 : dte.ivaRete1) || 0) - ((dte === null || dte === void 0 ? void 0 : dte.reteRenta) || 0) + ((dte === null || dte === void 0 ? void 0 : dte.ivaPerci1) || 0) + subTotalTributosAdicionales) * 100) / 100),
            totalIva: totalIva,
            saldoFavor: (dte === null || dte === void 0 ? void 0 : dte.saldoFavor) || 0,
            condicionOperacion: (condicionOperacion === null || condicionOperacion === void 0 ? void 0 : condicionOperacion.codigo) || 1,
            pagos: pagos,
            codIncoterms: (incoterm === null || incoterm === void 0 ? void 0 : incoterm.codigo) || null,
            descIncoterms: (incoterm === null || incoterm === void 0 ? void 0 : incoterm.incoterm) || null,
            flete: (dte === null || dte === void 0 ? void 0 : dte.flete) || 0,
            seguro: (dte === null || dte === void 0 ? void 0 : dte.seguro) || 0,
            numPagoElectronico: (dte === null || dte === void 0 ? void 0 : dte.numPagoElectronico) || '',
            observaciones: (dte === null || dte === void 0 ? void 0 : dte.observaciones) || '',
            //Cuando el tipo de Item es Documento
            totalSujetoRetencion: totalSujetoRetencion,
            totalIVAretenido: totalIVAretenido,
            totalIVAretenidoLetras: (0, functions_1.numeroALetras)(totalIVAretenido),
            ivaPerci: totalIva, //IVA Sumatoria CL.
            totalExportacion: totalExportacion,
            total: subTotalVentas + totalIva,
            totalCompra: totalCompra, //Factura Sujeto Excluido
            descu: dte === null || dte === void 0 ? void 0 : dte.descuGravada, //Factura Sujeto Excluido (se guarda DescuGravada)
        };
        console.log(resumen);
        return resumen;
    });
}
