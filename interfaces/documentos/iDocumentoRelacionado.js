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
exports.getDocumentoRelacionado = getDocumentoRelacionado;
const DocumentosRelacionados_1 = __importDefault(require("../../models/factura/DocumentosRelacionados"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
const TipoGeneracion_1 = __importDefault(require("../../models/factura/TipoGeneracion"));
function getDocumentoRelacionado(dteId) {
    return __awaiter(this, void 0, void 0, function* () {
        const documentosRel = yield DocumentosRelacionados_1.default.findAll({
            where: {
                dteId: dteId
            }
        });
        let documentos = [];
        for (const doc of documentosRel) {
            const tipoDoc = yield TipoDte_1.default.findByPk(doc.tipoDteId);
            const tipoGeneracion = yield TipoGeneracion_1.default.findByPk(doc.tipoGeneracionId);
            documentos === null || documentos === void 0 ? void 0 : documentos.push({
                tipoDocumento: (tipoDoc === null || tipoDoc === void 0 ? void 0 : tipoDoc.codigo) || '',
                tipoGeneracion: (tipoGeneracion === null || tipoGeneracion === void 0 ? void 0 : tipoGeneracion.codigo) || 0,
                numeroDocumento: doc.numeroDocumento,
                fechaEmision: doc.fechaEmision
            });
        }
        //Verificar si se agregaron documentos
        if (documentos.length == 0) {
            documentos = null;
        }
        return documentos;
    });
}
