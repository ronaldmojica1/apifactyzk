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
exports.getEmisor = void 0;
const ActividadEconomica_1 = __importDefault(require("../../models/factura/ActividadEconomica"));
const Emisor_1 = __importDefault(require("../../models/factura/Emisor"));
const TipoDocumento_1 = __importDefault(require("../../models/factura/TipoDocumento"));
const TipoEstablecimiento_1 = __importDefault(require("../../models/factura/TipoEstablecimiento"));
const TipoItem_1 = __importDefault(require("../../models/inventario/TipoItem"));
const Departamento_1 = __importDefault(require("../../models/region/Departamento"));
const Municipio_1 = __importDefault(require("../../models/region/Municipio"));
function getEmisor(emisorId, tipoItemExpoId = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const emi = yield Emisor_1.default.findByPk(emisorId);
        const actividadE = yield ActividadEconomica_1.default.findByPk(emi === null || emi === void 0 ? void 0 : emi.actividadEconomicaId);
        const tipoEstable = yield TipoEstablecimiento_1.default.findByPk(emi === null || emi === void 0 ? void 0 : emi.tipoEstablecimientoId);
        const departamento = yield Departamento_1.default.findByPk(emi === null || emi === void 0 ? void 0 : emi.departamentoId);
        const municipio = yield Municipio_1.default.findByPk(emi === null || emi === void 0 ? void 0 : emi.municipioId);
        const tipoItemExpor = tipoItemExpoId != null ? yield TipoItem_1.default.findByPk(tipoItemExpoId) : null;
        const direccion = {
            departamento: (departamento === null || departamento === void 0 ? void 0 : departamento.codigo) || '',
            municipio: (municipio === null || municipio === void 0 ? void 0 : municipio.codigo) || '',
            complemento: (emi === null || emi === void 0 ? void 0 : emi.direccion) || ''
        };
        const docResposable = yield TipoDocumento_1.default.findByPk(emi === null || emi === void 0 ? void 0 : emi.tipoDocResponsableId);
        let emisor = {
            nit: (emi === null || emi === void 0 ? void 0 : emi.nit) || '',
            nrc: (emi === null || emi === void 0 ? void 0 : emi.nrc) || null,
            nombre: (emi === null || emi === void 0 ? void 0 : emi.nombre) || '',
            codActividad: (actividadE === null || actividadE === void 0 ? void 0 : actividadE.codigo) || null,
            descActividad: (actividadE === null || actividadE === void 0 ? void 0 : actividadE.actividad) || null,
            nombreComercial: (emi === null || emi === void 0 ? void 0 : emi.nombreComercial) || null,
            tipoEstablecimiento: (tipoEstable === null || tipoEstable === void 0 ? void 0 : tipoEstable.codigo) || null,
            nomEstablecimiento: (emi === null || emi === void 0 ? void 0 : emi.nombre) || '',
            direccion: direccion,
            telefono: (emi === null || emi === void 0 ? void 0 : emi.telefono) || null,
            correo: (emi === null || emi === void 0 ? void 0 : emi.correo) || null,
            codEstableMH: (emi === null || emi === void 0 ? void 0 : emi.codEstableMH) || null,
            codEstable: emi === null || emi === void 0 ? void 0 : emi.codEstable,
            codigoMH: (emi === null || emi === void 0 ? void 0 : emi.codEstableMH) || null,
            codigo: emi === null || emi === void 0 ? void 0 : emi.codEstable,
            codPuntoVentaMH: (emi === null || emi === void 0 ? void 0 : emi.codPuntoVentaMH) || null,
            codPuntoVenta: emi === null || emi === void 0 ? void 0 : emi.codPuntoVenta,
            puntoVentaMH: (emi === null || emi === void 0 ? void 0 : emi.codPuntoVentaMH) || null,
            puntoVenta: emi === null || emi === void 0 ? void 0 : emi.codPuntoVenta,
            puntoVentaContri: emi === null || emi === void 0 ? void 0 : emi.codPuntoVenta,
            tipoItemExpor: tipoItemExpor != null ? tipoItemExpor.codigo : null,
            recintoFiscal: null,
            regimen: null,
            nombreResponsable: emi === null || emi === void 0 ? void 0 : emi.nombreResponsable,
            tipoDocResponsable: docResposable === null || docResposable === void 0 ? void 0 : docResposable.codigo,
            numeroDocResponsable: emi === null || emi === void 0 ? void 0 : emi.numeroDocResponsable
        };
        return emisor;
    });
}
exports.getEmisor = getEmisor;
