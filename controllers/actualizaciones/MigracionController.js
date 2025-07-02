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
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
const Configuracion_1 = __importDefault(require("../../models/configuracion/Configuracion"));
function verificarMigracion() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Este procedimiento se ejecuta para verificar la version actual y ejecutar
            yield Migracion_1.default.sync(); //Si no se ha creado en la BD, OJO ESTA LINEA LA PUEDO BORRAR DESPUES DE LA PRIMERA ACTUALIZACION
            Migracion_1.default.findOne().then((migVersion) => __awaiter(this, void 0, void 0, function* () {
                const expectedVersion = 28; //****Esta es la version que debo modificar cada vez que se haga algun cambio en la estructura de la BD (15 usada para migrar)
                //Si no existe version (primera vez crear)
                if (!migVersion) {
                    migVersion = yield Migracion_1.default.create({
                        version: 1
                    });
                }
                const currentVersion = migVersion.version;
                if (currentVersion < expectedVersion) { //En este caso debera actualizar        
                    (() => __awaiter(this, void 0, void 0, function* () {
                        yield Dte_1.default.sync({ alter: true });
                        yield CuerpoDocumento_1.default.sync({ alter: true });
                        yield Configuracion_1.default.sync({ alter: true });
                    }))();
                    //Actualizar la version migrada en la BD
                    migVersion.version = expectedVersion;
                    migVersion.save();
                }
            }));
        }
        catch (error) {
            console.error("Error al procesar migracion:", error);
        }
    });
}
exports.default = {
    verificarMigracion
};
