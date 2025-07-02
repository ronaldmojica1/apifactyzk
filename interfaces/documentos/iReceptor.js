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
exports.getReceptor = getReceptor;
const ActividadEconomica_1 = __importDefault(require("../../models/factura/ActividadEconomica"));
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const TipoDocumento_1 = __importDefault(require("../../models/factura/TipoDocumento"));
const TipoPersona_1 = __importDefault(require("../../models/factura/TipoPersona"));
const TituloBien_1 = __importDefault(require("../../models/factura/TituloBien"));
const Departamento_1 = __importDefault(require("../../models/region/Departamento"));
const Municipio_1 = __importDefault(require("../../models/region/Municipio"));
const Pais_1 = __importDefault(require("../../models/region/Pais"));
function getReceptor(receptorId_1) {
    return __awaiter(this, arguments, void 0, function* (receptorId, tituloBienId = null) {
        const recep = yield Receptor_1.default.findByPk(receptorId);
        const actividadE = yield ActividadEconomica_1.default.findByPk(recep === null || recep === void 0 ? void 0 : recep.actividadEconomicaId);
        const departamento = yield Departamento_1.default.findByPk(recep === null || recep === void 0 ? void 0 : recep.departamentoId);
        const municipio = yield Municipio_1.default.findByPk(recep === null || recep === void 0 ? void 0 : recep.municipioId);
        const direccion = {
            departamento: (departamento === null || departamento === void 0 ? void 0 : departamento.codigo) || '',
            municipio: (municipio === null || municipio === void 0 ? void 0 : municipio.codigo) || '',
            complemento: (recep === null || recep === void 0 ? void 0 : recep.direccion) || ''
        };
        const pais = yield Pais_1.default.findByPk(recep === null || recep === void 0 ? void 0 : recep.paisId);
        const tipoDoc = yield TipoDocumento_1.default.findByPk(recep === null || recep === void 0 ? void 0 : recep.tipoDocumentoId);
        const tipoPersona = yield TipoPersona_1.default.findByPk(recep === null || recep === void 0 ? void 0 : recep.tipoPersonaId);
        const tituloBien = yield TituloBien_1.default.findByPk(tituloBienId || 0);
        let receptor = {
            tipoDocumento: (tipoDoc === null || tipoDoc === void 0 ? void 0 : tipoDoc.codigo) || null,
            numDocumento: (recep === null || recep === void 0 ? void 0 : recep.numDocumento) || null, //FC
            nit: recep === null || recep === void 0 ? void 0 : recep.nit,
            nrc: (recep === null || recep === void 0 ? void 0 : recep.nrc) || null,
            nombre: (recep === null || recep === void 0 ? void 0 : recep.nombre) || null,
            codActividad: (actividadE === null || actividadE === void 0 ? void 0 : actividadE.codigo) || null,
            descActividad: (actividadE === null || actividadE === void 0 ? void 0 : actividadE.actividad) || null,
            nombreComercial: recep === null || recep === void 0 ? void 0 : recep.nombreComercial,
            codPais: pais === null || pais === void 0 ? void 0 : pais.codigo,
            nombrePais: pais === null || pais === void 0 ? void 0 : pais.pais,
            complemento: recep === null || recep === void 0 ? void 0 : recep.direccion,
            tipoPersona: tipoPersona === null || tipoPersona === void 0 ? void 0 : tipoPersona.codigo,
            direccion: direccion,
            telefono: (recep === null || recep === void 0 ? void 0 : recep.telefono) || null,
            correo: (recep === null || recep === void 0 ? void 0 : recep.correo) || null,
            bienTitulo: (tituloBien === null || tituloBien === void 0 ? void 0 : tituloBien.codigo) || null,
            codigoMH: recep === null || recep === void 0 ? void 0 : recep.codigoMH,
            puntoVentaMH: recep === null || recep === void 0 ? void 0 : recep.puntoVentaMH
        };
        console.log(receptor);
        return receptor;
    });
}
