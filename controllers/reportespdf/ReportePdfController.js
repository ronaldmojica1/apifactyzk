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
const Global_1 = require("./plantillas/Global");
const RptPdfUtils_1 = require("./utils/RptPdfUtils");
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
function generarReporte(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //Obtener el DTE
        const dte = yield Dte_1.default.findByPk(req.params.id, {
            include: [
                {
                    model: CuerpoDocumento_1.default,
                    as: 'items'
                },
                {
                    model: Receptor_1.default,
                    as: 'receptor'
                },
                {
                    model: Receptor_1.default,
                    as: 'cobrarA'
                }
            ]
        });
        // Estilos para mejorar la presentación
        const headerStyle = {
            fontStyle: 'bold',
            fontSize: 10,
            border: true,
            padding: 5
        };
        const labelStyle = {
            fontStyle: 'bold',
            fontSize: 9,
            align: 'left',
            padding: 3
        };
        const valueStyle = {
            fontSize: 9,
            padding: 3
        };
        const sectionStyle = {
            marginBottom: 5
        };
        // Crear la estructura del encabezado con estilos mejorados
        const head = {
            rows: [
                new RptPdfUtils_1.Row([
                    new RptPdfUtils_1.Column(8, '', [
                        new RptPdfUtils_1.Row([
                            new RptPdfUtils_1.Column(6, 'Facturar A', [
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.receptor.nombre, undefined, valueStyle)
                                ]),
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.receptor.direccion, undefined, valueStyle)
                                ])
                            ], headerStyle),
                            new RptPdfUtils_1.Column(6, 'Cobrar A', [
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.cobrarA ? dte.cobrarA.nombre : '', undefined, valueStyle)
                                ]),
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.cobrarA ? dte.cobrarA.direccion : '', undefined, valueStyle)
                                ])
                            ], headerStyle)
                        ], sectionStyle)
                    ]),
                    new RptPdfUtils_1.Column(4, '', [
                        new RptPdfUtils_1.Row([
                            new RptPdfUtils_1.Column(4, 'Factura Nro:', undefined, labelStyle),
                            new RptPdfUtils_1.Column(8, dte.codigoGeneracion, undefined, valueStyle)
                        ]),
                        new RptPdfUtils_1.Row([
                            new RptPdfUtils_1.Column(4, 'Fecha:', undefined, labelStyle),
                            new RptPdfUtils_1.Column(8, dte.fecEmision, undefined, valueStyle)
                        ]),
                        new RptPdfUtils_1.Row([
                            new RptPdfUtils_1.Column(4, 'RUC:', undefined, labelStyle),
                            new RptPdfUtils_1.Column(8, dte.receptor.numeroDocumento || '', undefined, valueStyle)
                        ])
                    ], sectionStyle)
                ], sectionStyle),
                new RptPdfUtils_1.Row([
                    new RptPdfUtils_1.Column(12, 'Detalles de la Factura', undefined, {
                        fontStyle: 'bold',
                        fontSize: 12,
                        align: 'center',
                        padding: 5,
                        backgroundColor: '#e9e9e9',
                    })
                ], { marginTop: 10, marginBottom: 5 })
            ]
        };
        // Configuración mejorada para la tabla de factura
        const invoiceHeader = [
            {
                title: "ITEM",
                style: {
                    width: 10
                }
            },
            {
                title: "NO PARTE",
                style: {
                    width: 40
                }
            },
            { title: "CANTIDAD" },
            { title: "UM" },
            { title: "PAIS ORIGEN" },
            {
                title: "DESCRIPCION",
                style: {
                    width: 50
                }
            },
            { title: "O.C DELIVERY" },
            { title: "PESO NETO" },
            { title: "PESO BRUTO" },
            {
                title: "PRECIO UNITARIO",
                style: {
                    right: true
                }
            },
            {
                title: "IMPORTE",
                style: {
                    right: true
                }
            },
        ];
        // Procesar los datos de la tabla
        const invoiceTable = dte.items
            .sort((a, b) => a.numItem - b.numItem)
            .map((itm) => {
            return [
                itm.numItem,
                itm.producto != null ? itm.producto.codigo : "",
                itm.cantidad,
                itm.unidadMedida != null ? itm.unidadMedida.unidad : "",
                itm.paisOrigen != null ? itm.paisOrigen : "",
                itm.descripcion,
                "",
                "",
                "",
                itm.precioUni,
                itm.ventaGravada
            ];
        });
        // Calcular totales
        const totalVentaGravada = dte.items.reduce((sum, item) => sum + parseFloat(item.ventaGravada || 0), 0);
        const igv = totalVentaGravada * 0.18; // Asumiendo IGV del 18%
        const totalFactura = totalVentaGravada + igv;
        // Formatear números para mostrar
        const formatNumber = (num) => num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // Configuración del PDF
        const outputType = req.query.outputType || 'save';
        const param = {
            outputType: outputType,
            fileName: `factura_${dte.numero}.pdf`,
            orientationLandscape: true,
            head: head,
            invoice: {
                headerBorder: true,
                tableBodyBorder: true,
                header: invoiceHeader,
                table: invoiceTable,
                additionalRows: [
                    {
                        col1: 'SubTotal:',
                        col2: formatNumber(totalVentaGravada),
                        col3: 'PEN',
                        style: {
                            fontSize: 10
                        }
                    },
                    {
                        col1: 'IGV (18%):',
                        col2: formatNumber(igv),
                        col3: 'PEN',
                        style: {
                            fontSize: 10
                        }
                    },
                    {
                        col1: 'Total:',
                        col2: formatNumber(totalFactura),
                        col3: 'PEN',
                        style: {
                            fontSize: 12
                        }
                    }
                ],
                invDescLabel: "Observaciones",
                invDesc: dte.observaciones || "Gracias por su preferencia.",
            },
            footer: {
                text: "© " + new Date().getFullYear() + " - Documento generado electrónicamente"
            },
            pageEnable: true,
            pageLabel: "Página"
        };
        // Generar el PDF
        const result = (0, Global_1.initTemplate)(param);
        // Si se solicita como blob, devolver el blob
        if (outputType === 'blob' && result.blob) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=factura_${dte.numero}.pdf`);
            res.send(result.blob);
            return;
        }
        // Respuesta estándar
        res.json((0, apiresponse_1.successResponse)(result, "Reporte generado correctamente"));
    });
}
exports.default = {
    generarReporte
};
