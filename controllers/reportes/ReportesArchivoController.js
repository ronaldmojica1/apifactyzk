"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const ExcelJS = __importStar(require("exceljs"));
const apiresponse_1 = require("../../config/apiresponse");
const sequelize_1 = require("sequelize");
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const path = __importStar(require("path"));
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
const meses_1 = require("../../utils/meses");
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const Departamento_1 = __importDefault(require("../../models/region/Departamento"));
const Municipio_1 = __importDefault(require("../../models/region/Municipio"));
function rptLibroVentasXlsCustYzk(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta } = req.query;
            const fecha = new Date(hasta);
            const nombMes = meses_1.meses[fecha.getMonth()];
            const whereOptions = {};
            /*whereOptions.fecEmi ={
                [Op.between]:[desde,hasta]
            }*/
            whereOptions[sequelize_1.Op.or] = [
                {
                    fecEmi: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
                {
                    fecAnula: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
            ];
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [1, 9]
            };
            whereOptions.selloRecibido = {
                [sequelize_1.Op.ne]: null
            };
            whereOptions[sequelize_1.Op.and] = [
                {
                    [sequelize_1.Op.or]: [
                        {
                            docAnulado: false
                        },
                        {
                            [sequelize_1.Op.and]: [
                                {
                                    docAnulado: true
                                },
                                {
                                    fecAnula: {
                                        [sequelize_1.Op.between]: [desde, hasta]
                                    }
                                },
                                {
                                    fecEmi: {
                                        [sequelize_1.Op.lt]: desde
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            const datos = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [],
                        required: false,
                    }
                ],
                attributes: [
                    ...dteAttributes,
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'totVentaGravada'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id'],
                order: [
                    ['fecEmi', 'ASC']
                ]
            });
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroVentas.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet(1);
            if (worksheet) {
                //Poner el encabezado del reporte el periodo
                worksheet.getCell("A4").value = "MES DE " + nombMes.toUpperCase() + " " + fecha.getFullYear();
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 7;
                // Pegar los datos en la hoja de Excel                
                const datosJson = datos.map((d) => d.toJSON());
                datosJson.forEach((dato) => {
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = dato.fecEmi.split("-")[2];
                    worksheet.getCell(`B${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`C${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`F${nextRow}`).value = dato.tipoDteId == 1 ? (dato.docAnulado == true ? (dato.totVentaGravada * -1) : dato.totVentaGravada) : 0;
                    worksheet.getCell(`H${nextRow}`).value = dato.tipoDteId == 9 ? (dato.docAnulado == true ? (dato.totVentaGravada * -1) : dato.totVentaGravada) : 0;
                    nextRow++;
                });
            }
            // Convertir el archivo de Excel a un flujo de datos
            const fileStream = yield workbook.xlsx.writeBuffer();
            // Enviar el archivo resultante como respuesta al cliente
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=factura_con_datos.xlsx');
            res.send(fileStream);
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)("error"));
        }
    });
}
function rptLibroComprasXlsCustYzk(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta } = req.query;
            const fecha = new Date(hasta);
            const nombMes = meses_1.meses[fecha.getMonth()];
            const whereOptions = {};
            whereOptions[sequelize_1.Op.or] = [
                {
                    fecEmi: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
                {
                    fecAnula: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
            ];
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [10]
            };
            whereOptions.selloRecibido = {
                [sequelize_1.Op.ne]: null
            };
            whereOptions[sequelize_1.Op.and] = [
                {
                    [sequelize_1.Op.or]: [
                        {
                            docAnulado: false
                        },
                        {
                            [sequelize_1.Op.and]: [
                                {
                                    docAnulado: true
                                },
                                {
                                    fecAnula: {
                                        [sequelize_1.Op.between]: [desde, hasta]
                                    }
                                },
                                {
                                    fecEmi: {
                                        [sequelize_1.Op.lt]: desde
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            const datos = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [],
                        required: false,
                    },
                    {
                        model: Receptor_1.default,
                        as: 'receptor',
                        required: false
                    }
                ],
                attributes: [
                    ...dteAttributes,
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'totVentaGravada'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id', 'receptor.id'],
                order: [
                    ['fecEmi', 'ASC']
                ]
            });
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroCompras.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet(1);
            if (worksheet) {
                //Colocar el encabezado
                worksheet.getCell("A3").value = nombMes.toUpperCase();
                worksheet.getCell("E3").value = "AÑO: " + fecha.getFullYear();
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 8;
                let correlativo = 1;
                // Pegar los datos en la hoja de Excel                
                const datosJson = datos.map((d) => d.toJSON());
                datosJson.forEach((dato) => {
                    const tCompra = dato.totVentaGravada + dato.totVentaExenta + dato.totVentaNoSuj;
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = correlativo;
                    worksheet.getCell(`B${nextRow}`).value = dato.fecEmi;
                    worksheet.getCell(`C${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`D${nextRow}`).value = dato.selloRecibido;
                    worksheet.getCell(`E${nextRow}`).value = dato.receptor.numDocumento;
                    worksheet.getCell(`F${nextRow}`).value = dato.receptor.nombre;
                    worksheet.getCell(`M${nextRow}`).value = dato.docAnulado == true ? (tCompra * -1) : tCompra;
                    worksheet.getCell(`N${nextRow}`).value = dato.docAnulado == true ? (dato.reteRenta * -1) : dato.reteRenta;
                    nextRow++;
                    correlativo++;
                });
            }
            // Convertir el archivo de Excel a un flujo de datos
            const fileStream = yield workbook.xlsx.writeBuffer();
            // Enviar el archivo resultante como respuesta al cliente
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=factura_con_datos.xlsx');
            res.send(fileStream);
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)("error"));
        }
    });
}
function rptLibroVentasContrCustYzk(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta } = req.query;
            const fecha = new Date(hasta);
            const nombMes = meses_1.meses[fecha.getMonth()];
            const whereOptions = {};
            whereOptions[sequelize_1.Op.or] = [
                {
                    fecEmi: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
                {
                    fecAnula: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
            ];
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [2]
            };
            whereOptions.selloRecibido = {
                [sequelize_1.Op.ne]: null
            };
            whereOptions[sequelize_1.Op.and] = [
                {
                    [sequelize_1.Op.or]: [
                        {
                            docAnulado: false
                        },
                        {
                            [sequelize_1.Op.and]: [
                                {
                                    docAnulado: true
                                },
                                {
                                    fecAnula: {
                                        [sequelize_1.Op.between]: [desde, hasta]
                                    }
                                },
                                {
                                    fecEmi: {
                                        [sequelize_1.Op.lt]: desde
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            const datos = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [],
                        required: false,
                    },
                    {
                        model: Receptor_1.default,
                        as: 'receptor',
                        required: false
                    }
                ],
                attributes: [
                    ...dteAttributes,
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'totVentaGravada'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id', 'receptor.id'],
                order: [
                    ['fecEmi', 'ASC']
                ]
            });
            //Obtener el total de exportaciones
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [9]
            };
            const datosExp = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [],
                        required: false,
                    },
                ],
                attributes: [
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'totVentaGravada'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id']
            });
            const sumExport = datosExp.map((d) => d.toJSON()).reduce((tot, dte) => {
                return tot + (dte.totVentaGravada + dte.totVentaExenta + dte.totVentaNoSuj);
            }, 0);
            //Obtener el total de facturas de cf
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [1]
            };
            const datosFC = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [],
                        required: false,
                    },
                ],
                attributes: [
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'totVentaGravada'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id']
            });
            const sumFC = datosFC.map((d) => d.toJSON()).reduce((tot, dte) => {
                return tot + (dte.totVentaGravada + dte.totVentaExenta + dte.totVentaNoSuj);
            }, 0);
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroVentasContr.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet(1);
            if (worksheet) {
                //Colocar el encabezado
                worksheet.getCell("C5").value = nombMes.toUpperCase();
                worksheet.getCell("E5").value = fecha.getFullYear();
                //Colocar los totales de Exportaciones y Debito Facturas
                worksheet.getCell("E50").value = sumExport;
                worksheet.getCell("E49").value = sumFC;
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 9;
                let correlativo = 1;
                // Pegar los datos en la hoja de Excel                
                const datosJson = datos.map((d) => d.toJSON());
                datosJson.forEach((dato) => {
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = correlativo;
                    worksheet.getCell(`B${nextRow}`).value = dato.fecEmi;
                    worksheet.getCell(`C${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`E${nextRow}`).value = dato.receptor.nombre;
                    worksheet.getCell(`F${nextRow}`).value = dato.receptor.nrc;
                    worksheet.getCell(`G${nextRow}`).value = dato.docAnulado == true ? (dato.totVentaExenta * -1) : dato.totVentaExenta;
                    worksheet.getCell(`H${nextRow}`).value = dato.docAnulado == true ? (dato.totVentaGravada * -1) : dato.totVentaGravada;
                    worksheet.getCell(`M${nextRow}`).value = dato.docAnulado == true ? (dato.ivaRete1 * -1) : dato.ivaRete1;
                    worksheet.getCell(`N${nextRow}`).value = dato.docAnulado == true ? (dato.ivaPerci1 * -1) : dato.ivaPerci1;
                    nextRow++;
                    correlativo++;
                });
            }
            // Convertir el archivo de Excel a un flujo de datos
            const fileStream = yield workbook.xlsx.writeBuffer();
            // Enviar el archivo resultante como respuesta al cliente
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=factura_con_datos.xlsx');
            res.send(fileStream);
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)("error"));
        }
    });
}
function rptSujetoExcluido(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta } = req.query;
            const fecha = new Date(hasta);
            const nombMes = meses_1.meses[fecha.getMonth()];
            const whereOptions = {};
            whereOptions[sequelize_1.Op.or] = [
                {
                    fecEmi: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
                {
                    fecAnula: {
                        [sequelize_1.Op.between]: [desde, hasta],
                    },
                },
            ];
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [10]
            };
            whereOptions.selloRecibido = {
                [sequelize_1.Op.ne]: null
            };
            whereOptions[sequelize_1.Op.and] = [
                {
                    [sequelize_1.Op.or]: [
                        {
                            docAnulado: false
                        },
                        {
                            [sequelize_1.Op.and]: [
                                {
                                    docAnulado: true
                                },
                                {
                                    fecAnula: {
                                        [sequelize_1.Op.between]: [desde, hasta]
                                    }
                                },
                                {
                                    fecEmi: {
                                        [sequelize_1.Op.lt]: desde
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            const datos = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [],
                        required: false,
                    },
                    {
                        model: Receptor_1.default,
                        as: 'receptor',
                        required: false,
                        include: [
                            {
                                model: Departamento_1.default,
                                as: 'departamento'
                            },
                            {
                                model: Municipio_1.default,
                                as: 'municipio'
                            }
                        ]
                    },
                ],
                attributes: [
                    ...dteAttributes,
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'totVentaGravada'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id', 'receptor.id', 'receptor.departamento.id', 'receptor.municipio.id']
            });
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/ReporteSujetoExcluido.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet(1);
            if (worksheet) {
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 2;
                let correlativo = 1;
                // Pegar los datos en la hoja de Excel                
                const datosJson = datos.map((d) => d.toJSON());
                datosJson.forEach((dato) => {
                    //Identificar los items                
                    worksheet.getCell(`A${nextRow}`).value = dato.fecEmi;
                    worksheet.getCell(`B${nextRow}`).value = nombMes.toUpperCase();
                    worksheet.getCell(`C${nextRow}`).value = fecha.getFullYear();
                    worksheet.getCell(`D${nextRow}`).value = dato.receptor.nit != null ? dato.receptor.nit : dato.receptor.numDocumento;
                    worksheet.getCell(`E${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`F${nextRow}`).value = dato.receptor.nombre;
                    worksheet.getCell(`G${nextRow}`).value = 1;
                    worksheet.getCell(`H${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`I${nextRow}`).value = dato.receptor.telefono;
                    worksheet.getCell(`J${nextRow}`).value = dato.receptor.departamento.codigo;
                    worksheet.getCell(`K${nextRow}`).value = dato.receptor.municipio.codigo;
                    worksheet.getCell(`L${nextRow}`).value = dato.receptor.direccion;
                    worksheet.getCell(`Q${nextRow}`).value = dato.receptor.correo;
                    worksheet.getCell(`R${nextRow}`).value = dato.docAnulado == true ? (0) : (dato.totVentaGravada + dato.totVentaExenta + dato.totVentaNoSuj);
                    nextRow++;
                    correlativo++;
                });
            }
            // Convertir el archivo de Excel a un flujo de datos
            const fileStream = yield workbook.xlsx.writeBuffer();
            // Enviar el archivo resultante como respuesta al cliente
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=factura_con_datos.xlsx');
            res.send(fileStream);
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
exports.default = {
    rptLibroVentasXlsCustYzk,
    rptLibroComprasXlsCustYzk,
    rptLibroVentasContrCustYzk,
    rptSujetoExcluido
};
