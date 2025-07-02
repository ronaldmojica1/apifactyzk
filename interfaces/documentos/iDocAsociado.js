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
exports.getDocAsociados = getDocAsociados;
const DocumentoAsociado_1 = __importDefault(require("../../models/factura/DocumentoAsociado"));
const Medico_1 = __importDefault(require("../../models/factura/Medico"));
const OtrosDocumentos_1 = __importDefault(require("../../models/factura/OtrosDocumentos"));
const TipoServicioMedico_1 = __importDefault(require("../../models/factura/TipoServicioMedico"));
function getDocAsociados(dteId) {
    return __awaiter(this, void 0, void 0, function* () {
        //obtener los docs de la BD
        const otrosDocs = yield OtrosDocumentos_1.default.findAll({
            where: {
                dteId: dteId
            }
        });
        //Rellenar la interfaz del dte
        let documentosAsociados = [];
        otrosDocs.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
            const docAso = yield DocumentoAsociado_1.default.findByPk(doc.documentoAsociadoId);
            const medicoDoc = yield Medico_1.default.findByPk(doc.medicoId);
            const tipoServicioMedicoDoc = yield TipoServicioMedico_1.default.findByPk(doc.tipoServicioId);
            const medico = medicoDoc != undefined ? {
                nombre: medicoDoc.nombre,
                nit: medicoDoc.nit,
                docIdentificacion: medicoDoc.docIdentificacion,
                tipoServicio: (tipoServicioMedicoDoc === null || tipoServicioMedicoDoc === void 0 ? void 0 : tipoServicioMedicoDoc.codigo) || 0
            } : null;
            documentosAsociados === null || documentosAsociados === void 0 ? void 0 : documentosAsociados.push({
                codDocAsociado: (docAso === null || docAso === void 0 ? void 0 : docAso.codigo) || 0,
                descDocumento: doc.descDocumento,
                detalleDocumento: doc.detalleDocumento,
                medico: medico
            });
        }));
        //verificar si se agregaron
        if (documentosAsociados.length == 0) {
            documentosAsociados = null;
        }
        return documentosAsociados;
    });
}
