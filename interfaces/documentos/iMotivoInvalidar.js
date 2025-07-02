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
exports.getMotivoInvalidar = getMotivoInvalidar;
const ResponsableAnulacion_1 = __importDefault(require("../../models/factura/ResponsableAnulacion"));
const TipoDocumento_1 = __importDefault(require("../../models/factura/TipoDocumento"));
const TipoInvalidacion_1 = __importDefault(require("../../models/factura/TipoInvalidacion"));
function getMotivoInvalidar(dte) {
    return __awaiter(this, void 0, void 0, function* () {
        const tipoAnulacion = yield TipoInvalidacion_1.default.findByPk(dte.tipoInvalidacionId);
        const responsableAnulacion = yield ResponsableAnulacion_1.default.findByPk(dte.responsableAnulacionId);
        const tipoDocResponsable = yield TipoDocumento_1.default.findByPk(responsableAnulacion === null || responsableAnulacion === void 0 ? void 0 : responsableAnulacion.tipoDocId);
        const solicitaAnulacion = yield ResponsableAnulacion_1.default.findByPk(dte.solicitaAnulacionId);
        const tipoDocSolicita = yield TipoDocumento_1.default.findByPk(solicitaAnulacion === null || solicitaAnulacion === void 0 ? void 0 : solicitaAnulacion.tipoDocId);
        const motivo = {
            tipoAnulacion: (tipoAnulacion === null || tipoAnulacion === void 0 ? void 0 : tipoAnulacion.codigo) || 0,
            motivoAnulacion: dte.motivoInvalidacion,
            nombreResponsable: (responsableAnulacion === null || responsableAnulacion === void 0 ? void 0 : responsableAnulacion.nombre) || '',
            tipDocResponsable: (tipoDocResponsable === null || tipoDocResponsable === void 0 ? void 0 : tipoDocResponsable.codigo) || '',
            numDocResponsable: (responsableAnulacion === null || responsableAnulacion === void 0 ? void 0 : responsableAnulacion.numDoc) || '',
            nombreSolicita: (solicitaAnulacion === null || solicitaAnulacion === void 0 ? void 0 : solicitaAnulacion.nombre) || '',
            tipDocSolicita: (tipoDocSolicita === null || tipoDocSolicita === void 0 ? void 0 : tipoDocSolicita.codigo) || '',
            numDocSolicita: (solicitaAnulacion === null || solicitaAnulacion === void 0 ? void 0 : solicitaAnulacion.numDoc) || ''
        };
        return motivo;
    });
}
