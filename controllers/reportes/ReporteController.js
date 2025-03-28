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
const apiresponse_1 = require("../../config/apiresponse");
const sequelize_1 = require("sequelize");
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const Emisor_1 = __importDefault(require("../../models/factura/Emisor"));
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
const Usuario_1 = __importDefault(require("../../models/auth/Usuario"));
const RolUsuario_1 = __importDefault(require("../../models/auth/RolUsuario"));
const Rol_1 = __importDefault(require("../../models/auth/Rol"));
const PermisoRol_1 = __importDefault(require("../../models/auth/PermisoRol"));
const PermisoUsuario_1 = __importDefault(require("../../models/auth/PermisoUsuario"));
const csv = __importStar(require("fast-csv"));
const TipoOperacionRenta_1 = __importDefault(require("../../models/contabilidad/TipoOperacionRenta"));
const TipoIngresoRenta_1 = __importDefault(require("../../models/contabilidad/TipoIngresoRenta"));
const TipoDocumento_1 = __importDefault(require("../../models/factura/TipoDocumento"));
function rptVentasFechas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta, todas } = req.query;
            const whereOptions = {};
            if (desde && hasta) {
                whereOptions.fecEmi = {
                    [sequelize_1.Op.between]: [desde, hasta]
                };
            }
            if (todas && todas == 'false') {
                whereOptions.creadoPorId = req.user.id;
            }
            const report = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: Emisor_1.default,
                        as: 'emisor',
                        attributes: ["nombre"]
                    },
                    {
                        model: Receptor_1.default,
                        as: 'receptor',
                        attributes: ["nombre"]
                    },
                    {
                        model: TipoDte_1.default,
                        as: 'tipoDte',
                        attributes: ["tipo"]
                    },
                    {
                        model: Usuario_1.default,
                        as: 'creadoPor',
                        attributes: ["nombre"]
                    },
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [
                            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'ventaGravada'],
                            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'ventaExenta'],
                            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'ventaNoSuj'],
                        ]
                    }
                ],
                group: ['Dte.id', 'emisor.id', 'receptor.id', 'tipoDte.id', 'items.id', 'creadoPor.id']
            });
            res.status(201).json((0, apiresponse_1.successResponse)(report, ''));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function rptPlantillaIvaMhVc(req, res) {
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
                [sequelize_1.Op.or]: [2, 4, 5]
            };
            const report = yield Dte_1.default.findAll({
                where: whereOptions,
                attributes: [
                    [(0, sequelize_1.literal)('CONCAT(SUBSTRING("Dte"."fecEmi", 9, 2),' + "'/'" + ', SUBSTRING("Dte"."fecEmi", 6, 2),' + "'/'" + ', SUBSTRING("Dte"."fecEmi", 1, 4))'), 'a'],
                    [(0, sequelize_1.literal)('4'), 'b'],
                    [(0, sequelize_1.col)('tipoDte.codigo'), 'c'],
                    [(0, sequelize_1.literal)('REPLACE("Dte"."codigoGeneracion", \'-\', \'\')'), 'd'],
                    [(0, sequelize_1.col)('Dte.selloRecibido'), 'e'],
                    [(0, sequelize_1.literal)('REPLACE("Dte"."codigoGeneracion", \'-\', \'\')'), 'f'],
                    [(0, sequelize_1.literal)("''"), 'g'],
                    [(0, sequelize_1.literal)(`CASE 
                    WHEN "receptor->tipoDocumento"."codigo" = '13' THEN ''
                    WHEN "receptor"."nit" IS NOT NULL THEN "receptor"."nit"
                    ELSE "receptor"."nrc"
                END`), 'h'],
                    [(0, sequelize_1.col)('receptor.nombre'), 'i'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false THEN "items"."ventaExenta" ELSE 0.00 END))::numeric,2)'), 'j'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false THEN "items"."ventaNoSuj" ELSE 0.00 END))::numeric,2)'), 'k'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'l'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false THEN ("items"."ventaGravada" * 0.13) ELSE 0.00 END))::numeric,2)'), 'm'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = true THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'n'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = true THEN ("items"."ventaGravada" * 0.13) ELSE 0.00 END))::numeric,2)'), 'o'],
                    [(0, sequelize_1.literal)('ROUND((SUM("items"."ventaGravada" + ("items"."ventaGravada" * 0.13) + "items"."ventaExenta" + "items"."ventaNoSuj"))::numeric,2)'), 'p'],
                    [(0, sequelize_1.literal)(`CASE 
                    WHEN "receptor->tipoDocumento"."codigo" = '13' THEN "receptor"."numDocumento"                    
                    ELSE ''
                END`), 'q'],
                    [(0, sequelize_1.col)('tipoOperacionRenta.codigo'), 'tipoOperacionRenta'],
                    [(0, sequelize_1.col)('tipoIngresoRenta.codigo'), 'tipoIngresoRenta'],
                    [(0, sequelize_1.literal)("'1'"), 'w'], //T - Anexo 1                                                                             
                ],
                group: ['Dte.fecEmi', 'tipoDte.codigo', 'Dte.codigoGeneracion', 'Dte.selloRecibido', 'receptor.nombre', 'receptor.nit', 'receptor.nrc', 'receptor.numDocumento', 'receptor.tipoDocumento.codigo', 'tipoOperacionRenta.codigo', 'tipoIngresoRenta.codigo'],
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
                        include: [
                            {
                                model: TipoDocumento_1.default,
                                as: 'tipoDocumento',
                                attributes: []
                            }
                        ]
                    },
                    {
                        model: TipoOperacionRenta_1.default,
                        as: 'tipoOperacionRenta',
                        attributes: []
                    },
                    {
                        model: TipoIngresoRenta_1.default,
                        as: 'tipoIngresoRenta',
                        attributes: []
                    }
                ],
                raw: true
            });
            const csvBuffer = yield generarCSV(report, 'datos');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=factura_con_datos.csv');
            res.send(csvBuffer);
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function rptPlantillaIvaMhVcf(req, res) {
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
            const report = yield Dte_1.default.findAll({
                where: whereOptions,
                attributes: [
                    [(0, sequelize_1.literal)('CONCAT(SUBSTRING("Dte"."fecEmi", 9, 2),' + "'/'" + ', SUBSTRING("Dte"."fecEmi", 6, 2),' + "'/'" + ', SUBSTRING("Dte"."fecEmi", 1, 4))'), 'fecha'],
                    [(0, sequelize_1.literal)('4'), 'claseDoc'],
                    [(0, sequelize_1.col)('tipoDte.codigo'), 'tipoDoc'],
                    [(0, sequelize_1.literal)("'N/A'"), 'd'],
                    [(0, sequelize_1.literal)("'N/A'"), 'e'],
                    [(0, sequelize_1.literal)("'N/A'"), 'f'],
                    [(0, sequelize_1.literal)("'N/A'"), 'g'],
                    [(0, sequelize_1.literal)(`(
                    SELECT "codigoGeneracion"
                    FROM "dte" AS "subDte"
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" ASC
                    LIMIT 1
                  )`),
                        'primerDocumento'],
                    //[fn('MIN', col('Dte.codigoGeneracion')), 'primerDocumento'],//H
                    [(0, sequelize_1.literal)(`(
                    SELECT "codigoGeneracion"
                    FROM "dte" AS "subDte"
                    WHERE "subDte"."fecEmi" = "Dte"."fecEmi"
                    AND "subDte"."tipoDteId" IN (1, 9)
                    ORDER BY "subDte"."horEmi" DESC
                    LIMIT 1
                  )`),
                        'ultimoDocumento',],
                    //[fn('MAX', col('Dte.codigoGeneracion')), 'ultimoDocumento'],//I
                    [(0, sequelize_1.literal)("''"), 'j'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoDteId" = 1 THEN "items"."ventaExenta" ELSE 0.00 END))::numeric,2)'), 'ventaExenta'],
                    [(0, sequelize_1.literal)('0.00'), 'l'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoDteId" = 1 THEN ("items"."ventaNoSuj" + "items"."noGravado") ELSE 0.00 END))::numeric,2)'), 'ventaNoSuj'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoDteId" = 1 THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'ventaGravada'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoItemExpoId" <> 2  AND "Dte"."tipoDteId" = 9 AND "receptor"."paisId" IN (23,46,72,77,117,126) THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'exportacionDCA'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoItemExpoId" <> 2  AND "Dte"."tipoDteId" = 9 AND "receptor"."paisId" NOT IN (23,46,72,77,117,126) THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'exportacionFCA'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoItemExpoId" = 2 AND "receptor"."paisId" <> 187 THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'exportacionServicios'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = false AND "Dte"."tipoDteId" = 9 AND "receptor"."paisId" = 187 THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'exportacionZfDpa'],
                    [(0, sequelize_1.literal)('ROUND((SUM(CASE WHEN "Dte"."esVentaTercero" = true THEN "items"."ventaGravada" ELSE 0.00 END))::numeric,2)'), 'ventaTerceros'],
                    [(0, sequelize_1.literal)('ROUND((SUM("items"."ventaGravada" + "items"."ventaNoSuj" + "items"."ventaExenta" + "items"."noGravado" ))::numeric,2)'), 'totalVentas'],
                    [(0, sequelize_1.col)('tipoOperacionRenta.codigo'), 'tipoOperacionRenta'],
                    [(0, sequelize_1.col)('tipoIngresoRenta.codigo'), 'tipoIngresoRenta'],
                    [(0, sequelize_1.literal)("'2'"), 'w'], //U - Anexo 2                                                                             
                ],
                group: ['Dte.fecEmi', 'tipoDte.id', 'Dte.tipoDteId', 'tipoOperacionRenta.id', 'tipoIngresoRenta.id', 'Dte.tipoOperacionRentaId', 'Dte.tipoIngresoRentaId'],
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
                    },
                    {
                        model: TipoOperacionRenta_1.default,
                        as: 'tipoOperacionRenta',
                        attributes: []
                    },
                    {
                        model: TipoIngresoRenta_1.default,
                        as: 'tipoIngresoRenta',
                        attributes: []
                    }
                ],
                raw: true
            });
            const csvBuffer = yield generarCSV(report, 'datos');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=factura_con_datos.csv');
            res.send(csvBuffer);
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function rptUsuariosPermisos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const report = yield Usuario_1.default.findAll({
                attributes: ['id', 'nombre', 'usuario', 'admin'],
                include: [
                    {
                        model: RolUsuario_1.default,
                        as: 'roles',
                        include: [
                            {
                                model: Rol_1.default,
                                as: 'rol',
                                attributes: ['rol'],
                                include: [
                                    {
                                        model: PermisoRol_1.default,
                                        as: 'permisos',
                                        attributes: ['permiso'],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: PermisoUsuario_1.default,
                        as: 'permisosDirectos',
                        attributes: ['permiso'],
                    },
                ],
            });
            res.status(201).json((0, apiresponse_1.successResponse)(report, ''));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function generarCSV(data, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const csvStream = csv.format({ headers: false, delimiter: ';' });
        return new Promise((resolve, reject) => {
            const chunks = [];
            csvStream.on('data', (chunk) => {
                chunks.push(Buffer.from(chunk));
            });
            csvStream.on('end', () => {
                const csvBuffer = Buffer.concat(chunks);
                resolve(csvBuffer);
            });
            csvStream.on('error', (error) => {
                reject(error);
            });
            data.forEach((row) => {
                csvStream.write(row);
            });
            csvStream.end();
        });
    });
}
exports.default = {
    rptVentasFechas,
    rptUsuariosPermisos,
    rptPlantillaIvaMhVcf,
    rptPlantillaIvaMhVc
};
