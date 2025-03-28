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
const Migracion_1 = __importDefault(require("../../models/actualizacion/Migracion"));
const TipoIngresoRenta_1 = __importDefault(require("../../models/contabilidad/TipoIngresoRenta"));
const TipoOperacionRenta_1 = __importDefault(require("../../models/contabilidad/TipoOperacionRenta"));
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const TipoVenta_1 = __importDefault(require("../../models/inventario/TipoVenta"));
function verificarMigracion() {
    return __awaiter(this, void 0, void 0, function* () {
        //verificar las migraciones
        //Este procedimiento se ejecuta para verificar la version actual y ejecutar
        yield Migracion_1.default.sync(); //Si no se ha creado en la BD, OJO ESTA LINEA LA PUEDO BORRAR DESPUES DE LA PRIMERA ACTUALIZACION
        Migracion_1.default.findOne().then((migVersion) => __awaiter(this, void 0, void 0, function* () {
            const expectedVersion = 25; //****Esta es la version que debo modificar cada vez que se haga algun cambio en la estructura de la BD (15 usada para migrar)
            //Si no existe version (primera vez crear)
            if (!migVersion) {
                migVersion = yield Migracion_1.default.create({
                    version: 1
                });
            }
            const currentVersion = migVersion.version;
            if (currentVersion < expectedVersion) { //En este caso debera actualizar        
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield TipoOperacionRenta_1.default.sync();
                    yield TipoIngresoRenta_1.default.sync();
                    //Crear los datos por defecto
                    yield TipoOperacionRenta_1.default.create({
                        codigo: 1,
                        tipo: "Gravada"
                    });
                    yield TipoOperacionRenta_1.default.create({
                        codigo: 2,
                        tipo: "No Gravada o Exento"
                    });
                    yield TipoOperacionRenta_1.default.create({
                        codigo: 3,
                        tipo: "Excluido o no Constituye Renta"
                    });
                    yield TipoOperacionRenta_1.default.create({
                        codigo: 4,
                        tipo: "Mixta (Operaciones Gravadas y Exentas en el mismo Documento)"
                    });
                    yield TipoOperacionRenta_1.default.create({
                        codigo: 12,
                        tipo: "Ingresos que ya fueron sujetos de retencion informados en el F14 y consolidados en el F910"
                    });
                    yield TipoOperacionRenta_1.default.create({
                        codigo: 13,
                        tipo: "Sujetos Pasivos Excluidos (Art. 6 LISR)"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 1,
                        tipo: "Profesiones, Artes y Oficios"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 2,
                        tipo: "Actividades de Servicios"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 3,
                        tipo: "Actividades Comerciales"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 4,
                        tipo: "Actividades Industriales"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 5,
                        tipo: "Actividades Agropecuarias"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 6,
                        tipo: "Utilidades y Dividendos"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 7,
                        tipo: "Exportaciones de Bienes"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 8,
                        tipo: "Servicios Realizados en El Exterior y Utilizados en El Salvador"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 9,
                        tipo: "Exportaciones de Servicios"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 10,
                        tipo: "Otras Rentas Gravables"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 12,
                        tipo: "Ingresos que ya fueron sujetos de retencion informados en el F14 y consolidados en el F910"
                    });
                    yield TipoIngresoRenta_1.default.create({
                        codigo: 13,
                        tipo: "Sujetos Pasivos Excluidos (Art. 6 LISR)"
                    });
                    yield Dte_1.default.sync({ alter: true });
                    yield TipoVenta_1.default.create({
                        codigo: 'NG',
                        tipo: "No Gravado"
                    }); //Descomentar al mandar a YZK que no se habia agregado la version 24
                }))();
                //Actualizar la version migrada en la BD
                migVersion.version = expectedVersion;
                migVersion.save();
            }
        }));
    });
}
exports.default = {
    verificarMigracion
};
