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
exports.getAnulacionDoc = getAnulacionDoc;
const iDocumentoInvalidar_1 = require("./iDocumentoInvalidar");
const iEmisor_1 = require("./iEmisor");
const iIdentificacionInvalidacion_1 = require("./iIdentificacionInvalidacion");
const iMotivoInvalidar_1 = require("./iMotivoInvalidar");
function getAnulacionDoc(dte) {
    return __awaiter(this, void 0, void 0, function* () {
        const docAnulacion = {
            identificacion: yield (0, iIdentificacionInvalidacion_1.getIdentificacionAnulacion)(),
            emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId),
            documento: yield (0, iDocumentoInvalidar_1.getDocumentoInvalidar)(dte),
            motivo: yield (0, iMotivoInvalidar_1.getMotivoInvalidar)(dte),
        };
        return docAnulacion;
    });
}
