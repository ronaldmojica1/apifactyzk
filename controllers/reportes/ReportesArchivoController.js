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
function rptLibroVentasXlsCustYzk(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta } = req.query;
            const whereOptions = {};
            if (desde && hasta) {
                whereOptions.fecEmi = {
                    [sequelize_1.Op.between]: [desde, hasta]
                };
            }
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [1, 9]
            };
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
                group: ['Dte.id']
            });
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroVentas.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet(1);
            if (worksheet) {
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 7;
                // Pegar los datos en la hoja de Excel                
                const datosJson = datos.map((d) => d.toJSON());
                datosJson.forEach((dato) => {
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = dato.fecEmi.split("-")[2];
                    worksheet.getCell(`B${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`C${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`F${nextRow}`).value = dato.tipoDteId == 1 ? dato.totVentaGravada : 0;
                    worksheet.getCell(`H${nextRow}`).value = dato.tipoDteId == 9 ? dato.totVentaGravada : 0;
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
            const whereOptions = {};
            if (desde && hasta) {
                whereOptions.fecEmi = {
                    [sequelize_1.Op.between]: [desde, hasta]
                };
            }
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [1, 9]
            };
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            /*const datos:any = await Dte.findAll({
                where: whereOptions,
                include:[
                    {
                        model: CuerpoDocumento,
                        as:'items',
                        attributes: [],
                        required: false,
                    }
                ],
                attributes:[
                    ...dteAttributes,
                    [fn('SUM',literal('"items"."ventaGravada"')), 'totVentaGravada'],
                    [fn('SUM',literal('"items"."ventaExenta"')), 'totVentaExenta'],
                    [fn('SUM',literal('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id']
            });*/
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroCompras.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet(1);
            if (worksheet) {
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 7;
                // Pegar los datos en la hoja de Excel                
                /*const datosJson = datos.map((d:any) => d.toJSON());
                datosJson.forEach((dato:any) => {
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = dato.fecEmi.split("-")[2];
                    worksheet.getCell(`B${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`C${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`F${nextRow}`).value = dato.tipoDteId == 1 ? dato.totVentaGravada : 0;
                    worksheet.getCell(`H${nextRow}`).value = dato.tipoDteId == 9 ? dato.totVentaGravada : 0;
    
                    nextRow ++;
                })*/
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
            const whereOptions = {};
            if (desde && hasta) {
                whereOptions.fecEmi = {
                    [sequelize_1.Op.between]: [desde, hasta]
                };
            }
            whereOptions.tipoDteId = {
                [sequelize_1.Op.or]: [1, 9]
            };
            const dteAttributes = Object.keys(Dte_1.default.getAttributes());
            /*const datos:any = await Dte.findAll({
                where: whereOptions,
                include:[
                    {
                        model: CuerpoDocumento,
                        as:'items',
                        attributes: [],
                        required: false,
                    }
                ],
                attributes:[
                    ...dteAttributes,
                    [fn('SUM',literal('"items"."ventaGravada"')), 'totVentaGravada'],
                    [fn('SUM',literal('"items"."ventaExenta"')), 'totVentaExenta'],
                    [fn('SUM',literal('"items"."ventaNoSuj"')), 'totVentaNoSuj'],
                ],
                group: ['Dte.id']
            });*/
            //Buscar el archivo de Excel
            const excelFilePath = path.join(__dirname, '../../archivos/LibroVentasContr.xlsx');
            // Cargar el archivo de Excel existente
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(excelFilePath);
            // Obtener la hoja de Excel en la que deseas agregar o actualizar datos
            const worksheet = workbook.getWorksheet(1);
            if (worksheet) {
                // Calcular la próxima fila disponible para pegar datos
                let nextRow = 7;
                // Pegar los datos en la hoja de Excel                
                /*const datosJson = datos.map((d:any) => d.toJSON());
                datosJson.forEach((dato:any) => {
                    //Identificar los items
                    worksheet.getCell(`A${nextRow}`).value = dato.fecEmi.split("-")[2];
                    worksheet.getCell(`B${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`C${nextRow}`).value = dato.codigoGeneracion;
                    worksheet.getCell(`F${nextRow}`).value = dato.tipoDteId == 1 ? dato.totVentaGravada : 0;
                    worksheet.getCell(`H${nextRow}`).value = dato.tipoDteId == 9 ? dato.totVentaGravada : 0;
    
                    nextRow ++;
                })*/
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
exports.default = {
    rptLibroVentasXlsCustYzk,
    rptLibroComprasXlsCustYzk,
    rptLibroVentasContrCustYzk
};
