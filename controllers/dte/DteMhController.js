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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const apiresponse_1 = require("../../config/apiresponse");
const jsonwebtoken_1 = require("jsonwebtoken");
const MHToken_1 = __importDefault(require("../../models/factura/MHToken"));
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
const iEmisor_1 = require("../../interfaces/documentos/iEmisor");
const iReceptor_1 = require("../../interfaces/documentos/iReceptor");
const iIdentificacion_1 = require("../../interfaces/documentos/iIdentificacion");
const iItem_1 = require("../../interfaces/documentos/iItem");
const iResumen_1 = require("../../interfaces/documentos/iResumen");
const iDocumentoRelacionado_1 = require("../../interfaces/documentos/iDocumentoRelacionado");
const iDocAsociado_1 = require("../../interfaces/documentos/iDocAsociado");
const schemavalidator_1 = require("../../utils/schemavalidator");
const iVentaTercero_1 = require("../../interfaces/documentos/iVentaTercero");
const iExtension_1 = require("../../interfaces/documentos/iExtension");
const iApendice_1 = require("../../interfaces/documentos/iApendice");
const Contingencia_1 = __importDefault(require("../../models/factura/Contingencia"));
const iContingencia_1 = require("../../interfaces/documentos/iContingencia");
const ContingenciaDetalle_1 = __importDefault(require("../../models/factura/ContingenciaDetalle"));
const iAnulacion_1 = require("../../interfaces/documentos/iAnulacion");
const MHCredenciales_1 = __importDefault(require("../../models/factura/MHCredenciales"));
const functions_1 = require("../../utils/functions");
const { v4: uuidv4 } = require('uuid');
const pdf_lib_1 = require("pdf-lib");
const Configuracion_1 = __importDefault(require("../../models/configuracion/Configuracion"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function obtenerCredenciales() {
    return __awaiter(this, void 0, void 0, function* () {
        const credenciales = yield MHCredenciales_1.default.findByPk(1);
        return credenciales;
    });
}
//Obtener el token de seguridad del MH (Final)
function loginAndGetToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const fd = new form_data_1.default();
        const credenciales = yield obtenerCredenciales();
        fd.append('user', (credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit) || "");
        fd.append('pwd', (credenciales === null || credenciales === void 0 ? void 0 : credenciales.clave_api) || "");
        let resp = yield axios_1.default.post(process.env.MH_URL_LOGIN || "", fd);
        console.log('Iniciando sesion en los servicios de MH');
        console.log(resp);
        if (resp.data.status = "OK") {
            return resp.data.body.token;
        }
        else {
            return 'abc';
        }
        //res.json(successResponse(resp.data,"Resp"));
    });
}
//validar el Token si aun esta activo (Final)
function obtenerToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let tokenStr = yield recuperarJWT();
        if (tokenStr) {
            const tokenParts = tokenStr.split(' ');
            if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
                const token = tokenParts[1];
                // Decodificar el token para acceder a sus claims
                const decodedToken = (0, jsonwebtoken_1.decode)(token);
                // Verificar si el token ha expirado
                if (decodedToken && decodedToken.exp) {
                    const expirationTimestamp = decodedToken.exp;
                    const currentTimestamp = Math.floor(Date.now() / 1000);
                    if (currentTimestamp < expirationTimestamp) {
                        //const expirationDate = new Date(expirationTimestamp * 1000); // Convierte a fecha legible              
                        //console.log('La fecha de expiración es:', expirationDate);
                        return tokenStr;
                    }
                    else {
                        //console.log('El token ha expirado.');
                        //Si ha expirado loguearse en el MH nuevamente
                        tokenStr = yield loginAndGetToken();
                        yield guardarJWT(tokenStr);
                        return tokenStr;
                    }
                }
            }
        }
        else {
            tokenStr = yield loginAndGetToken();
            yield guardarJWT(tokenStr);
            return tokenStr;
        }
    });
}
// Recuperar el JWT de la base de datos  (Final)
function recuperarJWT() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenRow = yield MHToken_1.default.findOne();
            if (tokenRow) {
                return tokenRow.jwt;
            }
            return null; // Si no se encuentra ningún JWT
        }
        catch (error) {
            console.error('Error al recuperar el JWT:', error);
            return null;
        }
    });
}
// Guardar el JWT en la base de datos  (Final)
function guardarJWT(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenRow = yield MHToken_1.default.findOne();
            if (tokenRow) {
                // Si ya existe una fila, actualiza el JWT
                yield tokenRow.update({ jwt });
            }
            else {
                // Si no existe una fila, crea una nueva
                yield MHToken_1.default.create({ jwt });
            }
            console.log('JWT guardado con éxito.');
        }
        catch (error) {
            console.error('Error al guardar el JWT:', error);
        }
    });
}
//Firmar el DTE (Final)
function firmarDte(jsonDte) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(jsonDte);
        const credenciales = yield obtenerCredenciales();
        const jsonFirmar = {
            nit: (credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit) || "",
            activo: true,
            passwordPri: (credenciales === null || credenciales === void 0 ? void 0 : credenciales.clave_firma) || "",
            dteJson: jsonDte
        };
        let resp = yield axios_1.default.post(process.env.MH_URL_FIRMA || "", jsonFirmar, {
            headers: {
                "Content-Type": 'application/JSON',
            }
        });
        //console.log(resp.data.body);
        return resp.data.body;
    });
}
//Transmitir DTE
function transmitirDte(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let tkn = yield obtenerToken();
        let dteId = req.body.dteId;
        let datos = req.body.datos;
        let dte = yield Dte_1.default.findByPk(dteId);
        if (dte != undefined) {
            //Actualizar los datos
            yield dte.update(datos);
            //Obtener el esquema JSON    
            let jsonData = yield getDocument(dte);
            console.log("dte JsonData abajo");
            console.log(jsonData);
            //Obtener el tipo de DTE del modelo de BD
            const tipoDte = yield TipoDte_1.default.findByPk(dte.tipoDteId);
            const jsonFirmado = yield firmarDte(jsonData);
            const dataTransmitir = {
                ambiente: process.env.MH_AMBIENTE,
                idEnvio: dte === null || dte === void 0 ? void 0 : dte.id,
                version: tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.version,
                tipoDte: tipoDte === null || tipoDte === void 0 ? void 0 : tipoDte.codigo,
                documento: jsonFirmado
            };
            let resp;
            yield axios_1.default.post(process.env.MH_URL_RECEPCION || "", dataTransmitir, {
                headers: {
                    "Content-Type": 'application/JSON',
                    "Authorization": tkn
                }
            }).then((result) => {
                resp = result.data;
            }).catch((error) => {
                console.log(error);
                if (error.response) {
                    if (error.response.status == 401) {
                        resp = {
                            estado: "RECHAZADO",
                            descripcionMsg: 'Usuario No autorizado',
                            observaciones: [
                                "Rechazo por usuario no autorizado"
                            ]
                        };
                    }
                    else {
                        resp = error.response.data;
                    }
                }
                else if (error.request) {
                    resp = error.request;
                }
                else {
                    resp = {
                        error: error.message
                    };
                }
            });
            if (resp.estado == 'PROCESADO') {
                yield actualizarDteTransmitido(dte, resp, jsonData === null || jsonData === void 0 ? void 0 : jsonData.identificacion.numeroControl);
            }
            return res.json((0, apiresponse_1.successResponse)(resp, "Success"));
        }
        else {
            return res.json((0, apiresponse_1.errorResponse)("DTE no encontado"));
        }
    });
}
//Actualizar el DTE transmitido
function actualizarDteTransmitido(dte, resp, numeroControl) {
    return __awaiter(this, void 0, void 0, function* () {
        dte.ambienteId = process.env.MH_AMBIENTE ? (process.env.MH_AMBIENTE == '00' ? 1 : 2) : null;
        dte.selloRecibido = resp.selloRecibido;
        dte.codigoGeneracion = resp.codigoGeneracion;
        //dte.numeroControl = numeroControl;
        dte.save();
    });
}
function actualizarDteAnulado(dte, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        dte.docAnulado = true;
        const fecha = new Date();
        dte.fecAnula = (0, functions_1.formatDateToYYYYMMDD)(fecha);
        dte.horAnula = (0, functions_1.formatTimeToHHMMSS)(fecha);
        dte.selloAnulacion = resp.selloRecibido;
        dte.codigoAnulacion = resp.codigoGeneracion;
        dte.save();
    });
}
function actualizarContingenciaTransmitida(contin, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        contin.selloRecibido = resp.selloRecibido;
        contin.save();
    });
}
//Armar el archivo JSON
function getDocument(dte) {
    return __awaiter(this, void 0, void 0, function* () {
        const tipoDteId = dte === null || dte === void 0 ? void 0 : dte.tipoDteId;
        switch (tipoDteId) {
            case 1: //Factura Comercial.         
                const fc = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    documentoRelacionado: yield (0, iDocumentoRelacionado_1.getDocumentoRelacionado)(dte.id),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    otrosDocumentos: yield (0, iDocAsociado_1.getDocAsociados)(dte.id),
                    ventaTercero: yield (0, iVentaTercero_1.getVentaTercero)(dte),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                //console.log(fc.cuerpoDocumento);
                const fcValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.FC, fc);
                return fcValid;
            case 2: //Comprobante de credito Fiscal
                const ccf = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    documentoRelacionado: yield (0, iDocumentoRelacionado_1.getDocumentoRelacionado)(dte.id),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    otrosDocumentos: yield (0, iDocAsociado_1.getDocAsociados)(dte.id),
                    ventaTercero: yield (0, iVentaTercero_1.getVentaTercero)(dte),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const ccfValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.CCF, ccf);
                return ccfValid;
            case 3: //Nota de Remision
                const nr = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    documentoRelacionado: yield (0, iDocumentoRelacionado_1.getDocumentoRelacionado)(dte.id),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId, dte.tituloBienId),
                    ventaTercero: yield (0, iVentaTercero_1.getVentaTercero)(dte),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const nrValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.NR, nr);
                return nrValid;
            case 4: //Nota de Credito
                const nc = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    documentoRelacionado: yield (0, iDocumentoRelacionado_1.getDocumentoRelacionado)(dte.id),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    ventaTercero: yield (0, iVentaTercero_1.getVentaTercero)(dte),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const ncValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.NC, nc);
                return ncValid;
            case 5: //Nota Debito
                const nd = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    documentoRelacionado: yield (0, iDocumentoRelacionado_1.getDocumentoRelacionado)(dte.id),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    ventaTercero: yield (0, iVentaTercero_1.getVentaTercero)(dte),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const ndValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.ND, nd);
                return ndValid;
            case 6: //Comprobante de Retencion
                const cr = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const crValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.CR, cr);
                return crValid;
            case 7: //Comprobante de liquidacion
                const cl = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const clValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.CL, cl);
                return clValid;
            case 8: //Documento contable de liquidacion
                const itemsDcl = yield (0, iItem_1.getItems)(dte);
                const dcl = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    cuerpoDocumento: itemsDcl[0],
                    extension: yield (0, iExtension_1.getExtension)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const dclValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.DCL, dcl);
                return dclValid;
            case 9: //Factura Exportacion
                const fex = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0, dte.tipoItemExpoId),
                    receptor: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    otrosDocumentos: yield (0, iDocAsociado_1.getDocAsociados)(dte.id),
                    ventaTercero: yield (0, iVentaTercero_1.getVentaTercero)(dte),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const fexValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.FEX, fex);
                //console.log(fexValid)    
                return fexValid;
            case 10: //Factura de Sujeto Excluido
                const fse = {
                    identificacion: yield (0, iIdentificacion_1.getIdentificacion)(dte),
                    emisor: yield (0, iEmisor_1.getEmisor)(dte.emisorId || 0),
                    sujetoExcluido: yield (0, iReceptor_1.getReceptor)(dte.receptorId),
                    cuerpoDocumento: yield (0, iItem_1.getItems)(dte),
                    resumen: yield (0, iResumen_1.getResumen)(dte),
                    apendice: yield (0, iApendice_1.getApendice)(dte.id),
                };
                const fseValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.FSE, fse);
                return fseValid;
            default:
                return null;
        }
    });
}
function anularDte(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let tkn = yield obtenerToken();
        let dteId = req.body.dteId;
        let datos = req.body.datos; // donde viene los datos de invalidacion
        //ojo evaluar si se actualiza el dte con la generacion de la anulacion
        let dte = yield Dte_1.default.findByPk(dteId);
        if (dte != undefined) {
            //actualizar el DTE con los datos adicionales 
            yield dte.update(datos);
            //Obtener el esquema JSON    
            let jsonData = yield (0, iAnulacion_1.getAnulacionDoc)(dte);
            let jsonDataValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.ANULACION, jsonData);
            console.log(jsonDataValid);
            //Obtener el tipo de DTE del modelo de BD
            //const tipoDte = await TipoDte.findByPk(dte.tipoDteId);      
            const jsonFirmado = yield firmarDte(jsonDataValid);
            const dataTransmitir = {
                ambiente: process.env.MH_AMBIENTE,
                idEnvio: dte === null || dte === void 0 ? void 0 : dte.id,
                version: 2,
                documento: jsonFirmado
            };
            let resp;
            yield axios_1.default.post(process.env.MH_URL_ANULAR_DTE || "", dataTransmitir, {
                headers: {
                    "Content-Type": 'application/JSON',
                    "Authorization": tkn
                }
            }).then((result) => {
                resp = result.data;
            }).catch((error) => {
                if (error.response) {
                    resp = error.response.data;
                }
                else if (error.request) {
                }
                else {
                    resp = {
                        error: 'Error al procesar'
                    };
                }
            });
            if (resp.estado == 'PROCESADO') {
                yield actualizarDteAnulado(dte, resp);
            }
            return res.json((0, apiresponse_1.successResponse)(resp, "Success"));
        }
        else {
            return res.json((0, apiresponse_1.errorResponse)("DTE no encontado"));
        }
    });
}
//crear en la bd la contingencia
function crearContingencia(datos) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cont = yield Contingencia_1.default.create(datos);
            return cont;
        }
        catch (error) {
            return null;
        }
    });
}
function transmitirContingencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const contingenciaId = req.body.contingenciaId;
        const contin = yield Contingencia_1.default.findByPk(contingenciaId);
        const tkn = yield obtenerToken();
        if (contin) {
            //Obtener el esquema JSON    
            let jsonData = yield (0, iContingencia_1.getContingencia)(contin);
            let jsonDataValid = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.CONTINGENCIA, jsonData);
            const jsonFirmado = yield firmarDte(jsonDataValid);
            const credenciales = yield obtenerCredenciales();
            const dataTransmitir = {
                nit: credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit,
                documento: jsonFirmado
            };
            let resp;
            yield axios_1.default.post(process.env.MH_URL_CONTINGENCIA || "", dataTransmitir, {
                headers: {
                    "Content-Type": 'application/JSON',
                    "Authorization": tkn
                }
            }).then((result) => {
                resp = result.data;
            }).catch((error) => {
                if (error.response) {
                    resp = error.response.data;
                }
                else if (error.request) {
                }
                else {
                    resp = {
                        error: 'Error al procesar'
                    };
                }
            });
            if (resp.estado == 'RECIBIDO') { //Recibido en lugar de procesado      
                yield actualizarContingenciaTransmitida(contin, resp);
            }
            return res.json((0, apiresponse_1.successResponse)(resp, "Success"));
        }
        else {
            return res.json((0, apiresponse_1.errorResponse)("Error interno al crear contingencia"));
        }
    });
}
function transmitirLote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const contingenciaId = req.body.contingenciaId;
        let contin = yield Contingencia_1.default.findByPk(contingenciaId);
        if (contin != null) {
            contin.codigoLote = uuidv4().toUpperCase();
            //Obtener el listado de los DTE en la contingencia
            const dteContin = yield ContingenciaDetalle_1.default.findAll({
                where: {
                    contingenciaId: contingenciaId
                }
            });
            //Crear un arreglo para almacenar los documentos
            const documentos = [];
            //Recorrer cada documento de la contingencia
            for (const det of dteContin) {
                const dte = yield Dte_1.default.findByPk(det.dteId);
                if (dte != null) {
                    const datosMod = {
                        fecEmi: (0, functions_1.formatDateToYYYYMMDD)(dte.createdAt),
                        horEmi: (0, functions_1.formatTimeToHHMMSS)(dte.createdAt),
                        tipoModeloId: 2,
                        tipoOperacionId: 2
                    };
                    yield dte.update(datosMod);
                    console.log(dte);
                    //Obtener el esquema JSON        
                    const jsonData = yield getDocument(dte);
                    //Actualizar el numero de control
                    dte.numeroControl = jsonData === null || jsonData === void 0 ? void 0 : jsonData.identificacion.numeroControl;
                    dte.save();
                    const jsonFirmado = yield firmarDte(jsonData);
                    documentos.push(jsonFirmado);
                }
            }
            //Transmitir el Lote
            const tkn = yield obtenerToken();
            const credenciales = yield obtenerCredenciales();
            const dataTransmitir = {
                ambiente: process.env.MH_AMBIENTE,
                idEnvio: contin.codigoLote,
                version: 2,
                nitEmisor: credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit,
                documentos: documentos
            };
            let resp;
            yield axios_1.default.post(process.env.MH_URL_RECEPCION_LOTE || "", dataTransmitir, {
                headers: {
                    "Content-Type": 'application/JSON',
                    "Authorization": tkn
                }
            }).then((result) => {
                resp = result.data;
            }).catch((error) => {
                if (error.response) {
                    resp = error.response.data;
                }
                else if (error.request) {
                }
                else {
                    resp = {
                        error: 'Error al procesar'
                    };
                }
            });
            if (resp.estado == 'PROCESADO' || resp.estado == "RECIBIDO") {
                //Actualizar el status de lote transmitido
                contin.codigoLote = resp.codigoLote; //se actualiza el lote obtenido del MH
                contin.loteEnviado = true;
                contin.save();
            }
            return res.json((0, apiresponse_1.successResponse)(resp, "Success"));
        }
        else {
            return res.json((0, apiresponse_1.errorResponse)("Contingencia no encontrada"));
        }
    });
}
function consultaLote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const contingenciaId = req.body.contingenciaId;
        let contin = yield Contingencia_1.default.findByPk(contingenciaId);
        if (contin != null) {
            const tkn = yield obtenerToken();
            let resp;
            yield axios_1.default.get(process.env.MH_URL_CONSULTA_LOTE + contin.codigoLote || "", {
                headers: {
                    "Content-Type": 'application/JSON',
                    "Authorization": tkn
                }
            }).then((result) => {
                resp = result.data;
            }).catch((error) => {
                if (error.response) {
                    resp = error.response.data;
                }
                else if (error.request) {
                }
                else {
                    resp = {
                        error: 'Error al procesar'
                    };
                }
            });
            //Actualizar los procesados    
            if (resp.procesados) {
                for (const proce of resp.procesados) {
                    const dte = Dte_1.default.findOne({
                        where: {
                            codigoGeneracion: proce.codigoGeneracion
                        }
                    }).then((encont) => {
                        encont === null || encont === void 0 ? void 0 : encont.update({
                            ambienteId: process.env.MH_AMBIENTE ? (process.env.MH_AMBIENTE == '00' ? 1 : 2) : null,
                            selloRecibido: proce.selloRecibido
                        });
                    });
                }
            }
            return res.json((0, apiresponse_1.successResponse)(resp, "Success"));
        }
        else {
            return res.json((0, apiresponse_1.errorResponse)("Contingencia no encontrada"));
        }
    });
}
function getVersionLegible(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const codigoGeneracion = req.body.codigoGeneracion;
        const urlLista = (process.env.MH_CONSULTA_JSON || "");
        const urlDoc = (process.env.MH_VERSION_LEGIBLE || "") + codigoGeneracion;
        let tkn = yield obtenerToken();
        let docJson;
        const credenciales = yield obtenerCredenciales();
        yield axios_1.default.post(urlLista, {
            codigoGeneracion: codigoGeneracion,
            tipoRpt: "E",
            nitEmision: credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit,
            duiEmision: credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit
        }, {
            headers: {
                "Authorization": tkn
            }
        }).then((result) => {
            docJson = result.data.body[0];
        });
        let resp;
        yield axios_1.default.post(urlDoc, docJson, {
            headers: {
                "Authorization": tkn
            }
        }).then((result) => {
            resp = result.data;
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                resp = error.response.data;
            }
            else if (error.request) {
            }
            else {
            }
        });
        try {
            // Convertir el PDF de base64 a buffer
            const pdfBuffer = Buffer.from(resp, 'base64');
            // Crear nombre de archivo único usando el código de generación
            const pdfFileName = `${codigoGeneracion}.pdf`;
            const pdfPath = path_1.default.join('uploads', pdfFileName);
            // Asegurarse que la carpeta uploads existe
            if (!fs_1.default.existsSync('uploads')) {
                fs_1.default.mkdirSync('uploads');
            }
            // Verificar si se debe usar el logo desde la configuración
            const [config] = yield Configuracion_1.default.findOrCreate({
                where: {},
                defaults: {
                    usarLogo: false,
                    nombreLogo: null
                }
            });
            // Si se usa logo y existe el archivo
            if (config.usarLogo && config.nombreLogo) {
                const logoPath = path_1.default.join('uploads/', config.nombreLogo);
                if (fs_1.default.existsSync(logoPath)) {
                    // Cargar el PDF existente
                    const pdfDoc = yield pdf_lib_1.PDFDocument.load(pdfBuffer);
                    // Leer el archivo de logo
                    const logoFile = fs_1.default.readFileSync(logoPath);
                    // Determinar el tipo de imagen basado en la extensión
                    const fileExt = path_1.default.extname(config.nombreLogo).toLowerCase();
                    let logoImage;
                    if (fileExt === '.jpg' || fileExt === '.jpeg') {
                        logoImage = yield pdfDoc.embedJpg(logoFile);
                    }
                    else if (fileExt === '.png') {
                        logoImage = yield pdfDoc.embedPng(logoFile);
                    }
                    else {
                        // Si no es JPG o PNG, no se puede insertar
                        console.log("Formato de logo no soportado:", fileExt);
                        // Guardar el PDF original
                        fs_1.default.writeFileSync(pdfPath, pdfBuffer);
                        res.status(200).send(resp);
                        return;
                    }
                    // Obtener la primera página
                    const pages = pdfDoc.getPages();
                    const firstPage = pages[0];
                    // Obtener dimensiones de la página
                    const { width, height } = firstPage.getSize();
                    // Calcular dimensiones para el logo (ajustar según necesidades)
                    const logoWidth = 100;
                    const logoHeight = logoWidth * (logoImage.height / logoImage.width);
                    // Dibujar el logo en la esquina superior derecha
                    firstPage.drawImage(logoImage, {
                        x: 25,
                        y: height - 85,
                        width: 60,
                        height: 60,
                    });
                    // Guardar el PDF modificado
                    const modifiedPdfBytes = yield pdfDoc.save();
                    // Guardar el archivo modificado
                    fs_1.default.writeFileSync(pdfPath, modifiedPdfBytes);
                    // Convertir de nuevo a base64 para la respuesta
                    resp = Buffer.from(modifiedPdfBytes).toString('base64');
                }
                else {
                    // Si no existe el logo, guardar el PDF original
                    fs_1.default.writeFileSync(pdfPath, pdfBuffer);
                }
            }
            else {
                // Si no se usa logo, guardar el PDF original
                fs_1.default.writeFileSync(pdfPath, pdfBuffer);
            }
        }
        catch (error) {
            console.error("Error al procesar el PDF con el logo:", error);
            // En caso de error, intentar guardar el PDF original
            try {
                const pdfFileName = `${codigoGeneracion}.pdf`;
                const pdfPath = path_1.default.join('uploads', pdfFileName);
                fs_1.default.writeFileSync(pdfPath, Buffer.from(resp, 'base64'));
            }
            catch (saveError) {
                console.error("Error al guardar el PDF original:", saveError);
            }
        }
        // Enviar la respuesta
        res.status(200).send(resp);
    });
}
function descargarJsonMh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const codigoGeneracion = req.body.codigoGeneracion;
        const urlLista = (process.env.MH_CONSULTA_JSON || "");
        let tkn = yield obtenerToken();
        let docJson;
        const credenciales = yield obtenerCredenciales();
        yield axios_1.default.post(urlLista, {
            codigoGeneracion: codigoGeneracion,
            tipoRpt: "E",
            nitEmision: credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit,
            duiEmision: credenciales === null || credenciales === void 0 ? void 0 : credenciales.nit
        }, {
            headers: {
                "Authorization": tkn
            }
        }).then((result) => {
            console.log(result);
            //console.log(result.data.body[0].documento)
            docJson = result.data.body[0].documento;
            docJson['selloRecibido'] = result.data.body[0].selloRecibido;
            docJson['firma'] = result.data.body[0].firma;
        });
        res.status(200).send(docJson);
    });
}
exports.default = {
    transmitirDte,
    anularDte,
    transmitirContingencia,
    transmitirLote,
    getVersionLegible,
    descargarJsonMh,
    consultaLote,
    obtenerToken,
};
