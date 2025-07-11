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
exports.getApendice = getApendice;
const Apendice_1 = __importDefault(require("../../models/factura/Apendice"));
function getApendice(dteId) {
    return __awaiter(this, void 0, void 0, function* () {
        //obtener apence BD
        const apend = yield Apendice_1.default.findAll({
            where: {
                dteId: dteId
            }
        });
        if (apend.length > 0) {
            const apendice = [];
            apend.forEach((ap) => {
                apendice.push({
                    campo: ap.campo,
                    etiqueta: ap.etiqueta,
                    valor: ap.valor
                });
            });
            return apendice;
        }
        else {
            return null;
        }
    });
}
