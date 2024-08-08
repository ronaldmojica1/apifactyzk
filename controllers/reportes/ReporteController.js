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
function rptVentasFechas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta } = req.query;
            const whereOptions = {};
            if (desde && hasta) {
                whereOptions.fecEmi = {
                    [sequelize_1.Op.between]: [desde, hasta]
                };
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
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        attributes: [
                            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaGravada"')), 'ventaGravada'],
                            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaExenta"')), 'ventaExenta'],
                            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.literal)('"items"."ventaNoSuj"')), 'ventaNoSuj'],
                        ]
                    }
                ],
                group: ['Dte.id', 'emisor.id', 'receptor.id', 'tipoDte.id', 'items.id']
            });
            res.status(201).json((0, apiresponse_1.successResponse)(report, ''));
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
exports.default = {
    rptVentasFechas,
    rptUsuariosPermisos,
};
