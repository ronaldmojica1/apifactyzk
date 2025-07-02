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
exports.getIdentificacion = getIdentificacion;
const Emisor_1 = __importDefault(require("../../models/factura/Emisor"));
const TipoContingencia_1 = __importDefault(require("../../models/factura/TipoContingencia"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
const TipoModelo_1 = __importDefault(require("../../models/factura/TipoModelo"));
const TipoOperacion_1 = __importDefault(require("../../models/factura/TipoOperacion"));
function getIdentificacion(dte) {
    return __awaiter(this, void 0, void 0, function* () {
        const emisor = yield Emisor_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.emisorId);
        const tipoDte = yield TipoDte_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.tipoDteId);
        const tipoModelo = yield TipoModelo_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.tipoModeloId);
        const tipoOperacion = yield TipoOperacion_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.tipoOperacionId);
        const tipoContingencia = yield TipoContingencia_1.default.findByPk((dte === null || dte === void 0 ? void 0 : dte.tipoContingenciaId) || 0);
        //verificar si el campo de dte.numeroControl es diferente de null
        let numeroControl = '';
        if ((dte === null || dte === void 0 ? void 0 : dte.numeroControl) == null) {
            //const docId = dte?.id || ''
            const docId = (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.correlativo) || '';
            //Incrementar correlativo
            tipoDte ? tipoDte.correlativo = ((tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.correlativo) || 0) + 1 : null;
            yield (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.save());
            numeroControl = "DTE-" + (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo) + '-' + (emisor === null || emisor === void 0 ? void 0 : emisor.codEstable) + (emisor === null || emisor === void 0 ? void 0 : emisor.codPuntoVenta) + '-' + '0'.repeat(15 - docId.toString().length) + docId.toString();
            if (dte) {
                dte.numeroControl = numeroControl;
                yield dte.save();
            }
        }
        else {
            numeroControl = dte.numeroControl;
        }
        const identificacion = {
            version: (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.version) || 1,
            ambiente: process.env.MH_AMBIENTE || '',
            tipoDte: (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo) || '00',
            numeroControl: numeroControl,
            codigoGeneracion: (dte === null || dte === void 0 ? void 0 : dte.codigoGeneracion) || '', //uuidv4().toUpperCase(),
            tipoModelo: (tipoModelo === null || tipoModelo === void 0 ? void 0 : tipoModelo.codigo) || 0,
            tipoOperacion: (tipoOperacion === null || tipoOperacion === void 0 ? void 0 : tipoOperacion.codigo) || 0,
            tipoContingencia: (tipoContingencia === null || tipoContingencia === void 0 ? void 0 : tipoContingencia.codigo) || null,
            motivoContin: (dte === null || dte === void 0 ? void 0 : dte.motivoContingencia) || null,
            motivoContigencia: (dte === null || dte === void 0 ? void 0 : dte.motivoContingencia) || null,
            fecEmi: (dte === null || dte === void 0 ? void 0 : dte.fecEmi) || '',
            horEmi: (dte === null || dte === void 0 ? void 0 : dte.horEmi) || '',
            tipoMoneda: 'USD'
        };
        if ((tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo) == '11') { //Is FEX
            delete identificacion.motivoContin;
        }
        else {
            delete identificacion.motivoContigencia;
        }
        return identificacion;
    });
}
