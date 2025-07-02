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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdentificacionContingencia = getIdentificacionContingencia;
const functions_1 = require("../../utils/functions");
function getIdentificacionContingencia(contin) {
    return __awaiter(this, void 0, void 0, function* () {
        const identificacion = {
            version: 3,
            ambiente: process.env.MH_AMBIENTE || '',
            codigoGeneracion: contin.codigoGeneracion,
            fTransmision: (0, functions_1.formatDateToYYYYMMDD)(new Date()),
            hTransmision: (0, functions_1.formatTimeToHHMMSS)(new Date()),
        };
        return identificacion;
    });
}
