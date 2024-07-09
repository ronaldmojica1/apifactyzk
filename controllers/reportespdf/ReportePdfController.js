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
        const head = {
            rows: [
                new RptPdfUtils_1.Row([
                    new RptPdfUtils_1.Column(8, '', [
                        new RptPdfUtils_1.Row([
                            new RptPdfUtils_1.Column(6, 'Facturar A', [
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.receptor.nombre)
                                ]),
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.receptor.direccion)
                                ])
                            ]),
                            new RptPdfUtils_1.Column(6, 'Cobrar A', [
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, 'dasdasdasdsadasdasdsad')
                                ]),
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, 'dadasdasdeqeqweqwewqewqewq ewqewqewqewqewqewqe  qwewqewq eqweqwewqewqd dadasdqqwqewq')
                                ])
                            ])
                        ])
                    ])
                ]),
                new RptPdfUtils_1.Row([
                    new RptPdfUtils_1.Column(8, '', [
                        new RptPdfUtils_1.Row([
                            new RptPdfUtils_1.Column(6, 'Facturar A', [
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.receptor.nombre)
                                ]),
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, dte.receptor.direccion)
                                ])
                            ]),
                            new RptPdfUtils_1.Column(6, 'Cobrar A', [
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, 'dasdasdasdsadasdasdsad')
                                ]),
                                new RptPdfUtils_1.Row([
                                    new RptPdfUtils_1.Column(12, 'dadasdasdeqeqweqwewqewqewq ewqewqewqewqewqewqe  qwewqewq eqweqwewqewqd dadasdqqwqewq')
                                ])
                            ])
                        ])
                    ])
                ])
            ]
        };
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
                    width: 100
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
        const invoiceTable = dte.items.sort((a, b) => a.numItem - b.numItem).map((itm) => {
            return [
                itm.numItem,
                itm.producto != null ? itm.producto.codigo : "",
                itm.cantidad,
                itm.unidadMedida != null ? itm.unidadMedida.unidad : "",
                itm.paisOrigen,
                itm.descripcion,
                "",
                "",
                "",
                itm.precioUni,
                itm.ventaGravada
            ];
        });
        //res.json(head)
        const outputType = 'save';
        const param = {
            outputType: outputType,
            fileName: "invoice.pdf",
            orientationLandscape: true,
            head: head,
            invoice: {
                headerBorder: true,
                tableBodyBorder: true,
                header: invoiceHeader,
                table: invoiceTable,
                additionalRows: [{
                        col1: 'Total:',
                        col2: '145,250.50',
                        col3: 'ALL',
                        style: {
                            fontSize: 14 //optional, default 12
                        }
                    },
                    {
                        col1: 'VAT:',
                        col2: '20',
                        col3: '%',
                        style: {
                            fontSize: 10 //optional, default 12
                        }
                    },
                    {
                        col1: 'SubTotal:',
                        col2: '116,199.90',
                        col3: 'ALL',
                        style: {
                            fontSize: 10 //optional, default 12
                        }
                    }],
                invDescLabel: "Invoice Note",
                invDesc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
            }
        };
        (0, Global_1.initTemplate)(param);
        res.json((0, apiresponse_1.successResponse)(null, "Si"));
    });
}
exports.default = {
    generarReporte
};
