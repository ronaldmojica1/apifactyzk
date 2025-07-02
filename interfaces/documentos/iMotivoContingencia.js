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
exports.getMotivoContingencia = getMotivoContingencia;
const TipoContingencia_1 = __importDefault(require("../../models/factura/TipoContingencia"));
//Se necesita crear modelos para las contingecias
function getMotivoContingencia(contingencia) {
    return __awaiter(this, void 0, void 0, function* () {
        const tipoContingencia = yield TipoContingencia_1.default.findByPk(contingencia.tipoContingenciaId);
        const motivo = {
            fInicio: contingencia.fInicio,
            fFin: contingencia.fFin,
            hInicio: contingencia.hInicio,
            hFin: contingencia.hFin,
            tipoContingencia: (tipoContingencia === null || tipoContingencia === void 0 ? void 0 : tipoContingencia.codigo) || 0,
            motivoContingencia: contingencia.motivoContingencia
        };
        return motivo;
    });
}
