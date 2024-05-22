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
exports.getContingencia = void 0;
const ContingenciaDetalle_1 = __importDefault(require("../../models/factura/ContingenciaDetalle"));
const iDteContingencia_1 = require("./iDteContingencia");
const iEmisor_1 = require("./iEmisor");
const iIdentificacionContingencia_1 = require("./iIdentificacionContingencia");
const iMotivoContingencia_1 = require("./iMotivoContingencia");
function getContingencia(contin) {
    return __awaiter(this, void 0, void 0, function* () {
        //const contin = await Contingencia.findByPk(contingeciaId);
        if (contin != null) {
            const continDetalle = yield ContingenciaDetalle_1.default.findAll({
                where: {
                    contingenciaId: contin.id
                }
            });
            const dteContingencia = yield (0, iDteContingencia_1.getDteContingecia)(continDetalle);
            const emisor = yield (0, iEmisor_1.getEmisor)(contin === null || contin === void 0 ? void 0 : contin.emisorId);
            const contingecia = {
                identificacion: yield (0, iIdentificacionContingencia_1.getIdentificacionContingencia)(contin),
                emisor: emisor,
                detalleDTE: dteContingencia,
                motivo: yield (0, iMotivoContingencia_1.getMotivoContingencia)(contin)
            };
            return contingecia;
        }
        else {
            return null;
        }
    });
}
exports.getContingencia = getContingencia;
