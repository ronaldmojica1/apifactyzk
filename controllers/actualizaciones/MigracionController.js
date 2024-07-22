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
const ClaseDocumento_1 = __importDefault(require("../../models/compras/ClaseDocumento"));
const Proveedor_1 = __importDefault(require("../../models/compras/Proveedor"));
const TipoDocumentoCompra_1 = __importDefault(require("../../models/compras/TipoDocumentoCompra"));
const Cierre_1 = __importDefault(require("../../models/factura/Cierre"));
function verificarMigracion() {
    return __awaiter(this, void 0, void 0, function* () {
        //verificar las migraciones
        //Este procedimiento se ejecuta para verificar la version actual y ejecutar
        yield Migracion_1.default.sync(); //Si no se ha creado en la BD, OJO ESTA LINEA LA PUEDO BORRAR DESPUES DE LA PRIMERA ACTUALIZACION
        Migracion_1.default.findOne().then((migVersion) => __awaiter(this, void 0, void 0, function* () {
            const expectedVersion = 10; //****Esta es la version que debo modificar cada vez que se haga algun cambio en la estructura de la BD
            //Si no existe version (primera vez crear)
            if (!migVersion) {
                migVersion = yield Migracion_1.default.create({
                    version: 1
                });
            }
            const currentVersion = migVersion.version;
            if (currentVersion < expectedVersion) { //En este caso debera actualizar        
                (() => __awaiter(this, void 0, void 0, function* () {
                    //***Colocar aca los modelos que sicronizara segun los cambios realizados*******
                    yield Proveedor_1.default.sync();
                    yield TipoDocumentoCompra_1.default.sync();
                    yield ClaseDocumento_1.default.sync();
                    //await Dte.sync({alter:true});                 
                    yield Cierre_1.default.sync();
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
