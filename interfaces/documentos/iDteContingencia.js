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
exports.getDteContingecia = getDteContingecia;
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
function getDteContingecia(contingenciaDetalle) {
    return __awaiter(this, void 0, void 0, function* () {
        const dteContingencia = [];
        let noItem = 1;
        contingenciaDetalle.forEach((det) => __awaiter(this, void 0, void 0, function* () {
            const dte = yield Dte_1.default.findByPk(det.dteId);
            const tipoDte = yield TipoDte_1.default.findByPk(dte === null || dte === void 0 ? void 0 : dte.tipoDteId);
            dteContingencia.push({
                noItem: noItem,
                codigoGeneracion: (dte === null || dte === void 0 ? void 0 : dte.codigoGeneracion) || '',
                tipoDoc: (tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo) || ''
            });
            noItem++;
        }));
        return dteContingencia;
    });
}
