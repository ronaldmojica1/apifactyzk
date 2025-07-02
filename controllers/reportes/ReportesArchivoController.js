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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
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
                /*{
                    fecAnula: {
                        [Op.between]: [desde, hasta],
                    },
                },*/
            ];
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [1, 9]
            };
            whereOptions.selloRecibido = {
                [sequelize_1.Op.ne]: null
            };
            whereOptions.docAnulado = {
                [sequelize_1.Op.eq]: false
            };
            /*whereOptions[Op.and] = [
                {
                    [Op.or]: [
                        {
                            docAnulado: false
                        },
                        {
                            [Op.and]: [
                                {
                                    docAnulado: true
                                },
                                {
                                    fecAnula: {
                                        [Op.between]: [desde, hasta]
                                    }
                                },
                                {
                                    fecEmi: {
                                        [Op.lt]: desde
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];*/
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            const datos = yield Dte_1.default.findAll({
                where: whereOptions,
                attributes: [
                    [(0, sequelize_1.col)('Dte.fecEmi'), 'fecha'], //A                
                    [(0, sequelize_1.literal)(`(
                    SELECT "selloRecibido"
                    FROM "dte" AS "subDte" 
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" ASC
                    LIMIT 1
                  )`), 'primerSello'], //B                
                    [(0, sequelize_1.literal)(`(
                    SELECT "selloRecibido"
                    FROM "dte" AS "subDte"
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" DESC
                    LIMIT 1
                  )`), 'ultimoSello'], //C
                    [(0, sequelize_1.literal)(`(
                    SELECT "codigoGeneracion"
                    FROM "dte" AS "subDte"
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" ASC
                    LIMIT 1
                  )`),
                        'primerDocumento'], //D
                    [(0, sequelize_1.literal)(`(
                    SELECT "codigoGeneracion"
                    FROM "dte" AS "subDte"
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" DESC
                    LIMIT 1
                  )`),
                        'ultimoDocumento',], //E                                
                    [(0, sequelize_1.literal)(`(
                    SELECT "numeroControl"
                    FROM "dte" AS "subDte"
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" ASC
                    LIMIT 1
                  )`), 'primerNumero'], //F
                    [(0, sequelize_1.literal)(`(
                    SELECT "numeroControl"
                    FROM "dte" AS "subDte"
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" DESC
                    LIMIT 1
                  )`), 'ultimoNumero'], //G                
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoDteId" = 1 THEN "items"."ventaExenta" ELSE 0.00 END))::numeric,2)'), 'ventaExenta'], //H                
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoDteId" = 1 THEN "items"."ventaNoSuj" ELSE 0.00 END))::numeric,2)'), 'ventaNoSuj'], //I
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoDteId" = 1 THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'ventaGravada'], //J
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoItemExpoId" <> 2  AND "Dte"."tipoDteId" = 9 AND "receptor"."paisId" IN (23,46,72,77,117,126) THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'exportacionDCA'], //K
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoItemExpoId" <> 2  AND "Dte"."tipoDteId" = 9 AND "receptor"."paisId" NOT IN (23,46,72,77,117,126) THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'exportacionFCA'], //L                
                    [(0, sequelize_1.literal)('ROUND((SUM("items"."ventaGravada" + "items"."ventaNoSuj" + "items"."ventaExenta" ))::numeric,2)'), 'totalVentas'], //M                                                
                ],
                group: ['Dte.fecEmi', 'tipoDte.id', 'Dte.tipoDteId'],
                order: [['fecEmi', 'ASC']],
                include: [
                    {
                        model: TipoDte_1.default,
                        as: 'tipoDte',
                        attributes: []
                    },
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: []
                    },
                    {
                        model: Receptor_1.default,
                        as: 'receptor',
                        attributes: [],
                    }
                ],
                raw: true
            });
            console.log(datos);
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroVentas.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet("datos");
            if (worksheet) {
                //Poner el encabezado del reporte el periodo
                worksheet.getCell("A4").value = "MES: " + nombMes.toUpperCase();
                worksheet.getCell("C4").value = fecha.getFullYear();
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 8;
                // Pegar los datos en la hoja de Excel                
                //const datosJson = datos.map((d:any) => d.toJSON());                
                datos.forEach((dato) => {
                    console.log(dato);
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = dato.fecha;
                    worksheet.getCell(`B${nextRow}`).value = dato.primerSello;
                    worksheet.getCell(`C${nextRow}`).value = dato.ultimoSello;
                    worksheet.getCell(`D${nextRow}`).value = dato.primerDocumento;
                    worksheet.getCell(`E${nextRow}`).value = dato.ultimoDocumento;
                    worksheet.getCell(`F${nextRow}`).value = dato.primerNumero;
                    worksheet.getCell(`G${nextRow}`).value = dato.ultimoNumero;
                    worksheet.getCell(`H${nextRow}`).value = parseFloat(dato.ventaExenta);
                    worksheet.getCell(`I${nextRow}`).value = parseFloat(dato.ventaNoSuj);
                    worksheet.getCell(`J${nextRow}`).value = parseFloat(dato.ventaGravada);
                    worksheet.getCell(`K${nextRow}`).value = parseFloat(dato.exportacionDCA);
                    worksheet.getCell(`L${nextRow}`).value = parseFloat(dato.exportacionFCA);
                    worksheet.getCell(`M${nextRow}`).value = parseFloat(dato.totalVentas);
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
                /*{
                    fecAnula: {
                        [Op.between]: [desde, hasta],
                    },
                },*/
            ];
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [10]
            };
            whereOptions.selloRecibido = {
                [sequelize_1.Op.ne]: null
            };
            whereOptions.docAnulado = {
                [sequelize_1.Op.eq]: false
            };
            /*whereOptions[Op.and] = [
                {
                    [Op.or]: [
                        {
                            docAnulado: false
                        },
                        {
                            [Op.and]: [
                                {
                                    docAnulado: true
                                },
                                {
                                    fecAnula: {
                                        [Op.between]: [desde, hasta]
                                    }
                                },
                                {
                                    fecEmi: {
                                        [Op.lt]: desde
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];*/
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
            const worksheet = workbook.getWorksheet("datos");
            if (worksheet) {
                //Colocar el encabezado
                worksheet.getCell("A6").value = "MES: " + nombMes.toUpperCase() + " " + fecha.getFullYear();
                //worksheet.getCell("E3").value = "AÑO: " + fecha.getFullYear();
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 9;
                let correlativo = 1;
                // Pegar los datos en la hoja de Excel                
                const datosJson = datos.map((d) => d.toJSON());
                datosJson.forEach((dato) => {
                    const tCompra = dato.totVentaGravada + dato.totVentaExenta + dato.totVentaNoSuj;
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = correlativo;
                    worksheet.getCell(`B${nextRow}`).value = dato.fecEmi;
                    worksheet.getCell(`C${nextRow}`).value = dato.numeroControl;
                    worksheet.getCell(`D${nextRow}`).value = dato.selloRecibido;
                    worksheet.getCell(`E${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`G${nextRow}`).value = dato.receptor.numDocumento;
                    worksheet.getCell(`H${nextRow}`).value = dato.receptor.nombre;
                    worksheet.getCell(`U${nextRow}`).value = tCompra;
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
                /*{
                    fecAnula: {
                        [Op.between]: [desde, hasta],
                    },
                },*/
            ];
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [2]
            };
            whereOptions.selloRecibido = {
                [sequelize_1.Op.ne]: null
            };
            whereOptions.docAnulado = {
                [sequelize_1.Op.eq]: false
            };
            /*whereOptions[Op.and] = [
                {
                    [Op.or]: [
                        {
                            docAnulado: false
                        },
                        {
                            [Op.and]: [
                                {
                                    docAnulado: true
                                },
                                {
                                    fecAnula: {
                                        [Op.between]: [desde, hasta]
                                    }
                                },
                                {
                                    fecEmi: {
                                        [Op.lt]: desde
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];*/
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            const datos = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: TipoDte_1.default,
                        as: 'tipoDte',
                        attributes: []
                    },
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
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."tipoDteId" = 2 THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'totVentaGravada'],
                    //[literal('ROUND((SUM(CASE WHEN "Dte"."tipoDteId" = 9 THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'totVentaExenta'],
                    [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id', 'receptor.id'],
                order: [
                    ['fecEmi', 'ASC']
                ]
            });
            //Obtener el total de facturas de cf
            /*whereOptions.tipoDteId = {
                [Op.or] : [1]
            }
            const datosFC: any = await Dte.findAll({
                where: whereOptions,
                include: [
                    {
                        model: CuerpoDocumento,
                        as:'items',
                        attributes: [],
                        required: false,
                    },
                ],
                attributes:[
                    [fn('SUM',literal('"items"."ventaGravada"')), 'totVentaGravada'],
                    [fn('SUM',literal('"items"."ventaExenta"')), 'totVentaExenta'],
                    [fn('SUM',literal('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id']
            })
            const sumFC = datosFC.map((d:any) => d.toJSON()).reduce((tot: number, dte: any) => {
                return tot + (dte.totVentaGravada + dte.totVentaExenta + dte.totVentaNoSuj);
            },0)*/
            //Obtener el total de FEX
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [9]
            };
            const datosFEX = yield Dte_1.default.findAll({
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
            const sumExport = datosFEX.map((d) => d.toJSON()).reduce((tot, dte) => {
                return tot + (dte.totVentaGravada + dte.totVentaExenta + dte.totVentaNoSuj);
            }, 0);
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroVentasContr.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet("datos");
            if (worksheet) {
                //Colocar el encabezado
                worksheet.getCell("B6").value = nombMes.toUpperCase();
                worksheet.getCell("D6").value = fecha.getFullYear();
                //Colocar los totales de Exportaciones y Debito Facturas
                worksheet.getCell("G127").value = sumExport;
                //worksheet.getCell("E49").value = sumFC;
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 10;
                let correlativo = 1;
                // Pegar los datos en la hoja de Excel                
                const datosJson = datos.map((d) => d.toJSON());
                datosJson.forEach((dato) => {
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = correlativo;
                    worksheet.getCell(`B${nextRow}`).value = dato.fecEmi;
                    worksheet.getCell(`C${nextRow}`).value = dato.selloRecibido;
                    worksheet.getCell(`D${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`E${nextRow}`).value = dato.numeroControl;
                    worksheet.getCell(`F${nextRow}`).value = dato.receptor.nombre;
                    worksheet.getCell(`G${nextRow}`).value = dato.receptor.nrc;
                    worksheet.getCell(`H${nextRow}`).value = dato.receptor.nit;
                    worksheet.getCell(`I${nextRow}`).value = parseFloat(dato.totVentaExenta);
                    worksheet.getCell(`J${nextRow}`).value = parseFloat(dato.totVentaNoSuj);
                    worksheet.getCell(`K${nextRow}`).value = parseFloat(dato.totVentaGravada);
                    worksheet.getCell(`O${nextRow}`).value = parseFloat(dato.ivaPerci1);
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
