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
exports.getDocumentoInvalidar = void 0;
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const TipoDocumento_1 = __importDefault(require("../../models/factura/TipoDocumento"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
function getDocumentoInvalidar(dte) {
    return __awaiter(this, void 0, void 0, function* () {
        const tipoDte = yield TipoDte_1.default.findByPk(dte.tipoDteId);
        const receptor = yield Receptor_1.default.findByPk(dte.receptorId);
        const tipoDoc = yield TipoDocumento_1.default.findByPk(receptor === null || receptor === void 0 ? void 0 : receptor.tipoDocumentoId);
        const documento = {
            tipoDte: (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo) || '',
            codigoGeneracion: dte.codigoGeneracion,
            selloRecibido: dte.selloRecibido,
            numeroControl: dte.numeroControl,
            fecEmi: dte.fecEmi,
            montoIva: null,
            codigoGeneracionR: null,
            tipoDocumento: (tipoDoc === null || tipoDoc === void 0 ? void 0 : tipoDoc.codigo) || '',
            numDocumento: (receptor === null || receptor === void 0 ? void 0 : receptor.numDocumento) || '',
            nombre: (receptor === null || receptor === void 0 ? void 0 : receptor.nombre) || '',
            telefono: (receptor === null || receptor === void 0 ? void 0 : receptor.telefono) || '',
            correo: (receptor === null || receptor === void 0 ? void 0 : receptor.correo) || '',
        };
        return documento;
    });
}
exports.getDocumentoInvalidar = getDocumentoInvalidar;
