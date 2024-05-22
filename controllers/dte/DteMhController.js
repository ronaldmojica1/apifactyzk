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
const { v4: uuidv4 } = require('uuid');
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
            console.log(jsonData === null || jsonData === void 0 ? void 0 : jsonData.cuerpoDocumento[0].tributos);
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
                if (error.response) {
                    if (error.response.status == 401) {
                        resp = {
                            estado: "RECHAZADO",
                            descripcionMsg: 'Usuario No autorizado'
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
        dte.numeroControl = numeroControl;
        dte.save();
    });
}
function actualizarDteAnulado(dte, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        dte.docAnulado = true;
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
                console.log(fexValid);
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
        const datos = req.body.datos;
        req.body.datos.codigoGeneracion = uuidv4().toUpperCase();
        req.body.datos.codigoLote = uuidv4().toUpperCase();
        let contin = yield crearContingencia(datos);
        let tkn = yield obtenerToken();
        if (contin != null) {
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
                    //Obtener el esquema JSON
                    const jsonData = yield getDocument(dte);
                    const jsonFirmado = yield firmarDte(jsonData);
                    documentos.push(jsonFirmado);
                }
            }
            //Transmitir el Lote
            let tkn = yield obtenerToken();
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
            if (resp.estado == 'PROCESADO') {
                //Actualizar el status de lote transmitido
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
function test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonData = {
            "identificacion": {
                "version": 1,
                "ambiente": "01",
                "tipoDte": "01",
                "campo_no_valido": "eliminar",
                "numeroControl": "DTE-01-SANR0023-000000000004582",
                "codigoGeneracion": "0B2575D5-8583-4164-8A5D-EFE45176625A",
                "tipoModelo": 1,
                "tipoOperacion": 1,
                "tipoContingencia": null,
                "motivoContin": null,
                "fecEmi": "2023-08-12",
                "horEmi": "11:02:09",
                "tipoMoneda": "USD"
            },
            "documentoRelacionado": null,
            "emisor": {
                "nit": "06141504911068",
                "nrc": "384470",
                "nombre": "PROYECTOS E INVERSIONES, S.A. DE C.V.",
                "codActividad": "46484",
                "descActividad": "Venta de productos farmaceuticos y medicinales",
                "nombreComercial": "FARMACIAS SAN ROQUE",
                "tipoEstablecimiento": "02",
                "direccion": {
                    "departamento": "03",
                    "municipio": "15",
                    "complemento": "10\u00AA Avenida Norte #1-7, Barrio El \u00C1ngel, Sonsonate, Sonsonate, El Salvador"
                },
                "telefono": "24504373",
                "codEstableMH": null,
                "codEstable": "SANR",
                "codPuntoVentaMH": null,
                "codPuntoVenta": "0023",
                "correo": "factura@srfarmacias.com"
            },
            "receptor": {
                "tipoDocumento": "13",
                "numDocumento": "03827514-2",
                "nrc": null,
                "nombre": "RONALD ARMANDO MOJICA CHAVEZ",
                "codActividad": null,
                "descActividad": null,
                "direccion": {
                    "departamento": "02",
                    "municipio": "09",
                    "complemento": "CIUDAD REAL RES MADRID POL 4 CASA 8",
                    "otr_campo": "no debe ir"
                },
                "telefono": "76137899",
                "correo": "ronaldmojica1@gmail.com"
            },
            "otrosDocumentos": null,
            "ventaTercero": null,
            "cuerpoDocumento": [
                {
                    "numItem": 1,
                    "tipoItem": 1,
                    "numeroDocumento": null,
                    "cantidad": 1,
                    "codigo": "16868",
                    "codTributo": null,
                    "uniMedida": 40,
                    "descripcion": "DANIELE",
                    "precioUni": 10.21,
                    "montoDescu": 1.4294,
                    "ventaNoSuj": 0,
                    "ventaExenta": 0,
                    "ventaGravada": 8.78,
                    "tributos": null,
                    "psv": 0,
                    "noGravado": 0,
                    "ivaItem": 1.010217
                },
                {
                    "numItem": 2,
                    "tipoItem": 1,
                    "numeroDocumento": null,
                    "cantidad": 1,
                    "codigo": "5243",
                    "codTributo": null,
                    "uniMedida": 59,
                    "descripcion": "GARGANTINAS",
                    "precioUni": 0.6038,
                    "montoDescu": 0,
                    "ventaNoSuj": 0,
                    "ventaExenta": 0,
                    "ventaGravada": 0.6,
                    "tributos": null,
                    "psv": 0,
                    "noGravado": 0,
                    "ivaItem": 0.06916
                }
            ],
            "resumen": {
                "totalNoSuj": 0,
                "totalExenta": 0,
                "totalGravada": 9.38,
                "subTotalVentas": 9.38,
                "descuNoSuj": 0,
                "descuExenta": 0,
                "descuGravada": 0,
                "porcentajeDescuento": 0,
                "totalDescu": 1.43,
                "tributos": [],
                "subTotal": 9.38,
                "ivaRete1": 0,
                "reteRenta": 0,
                "montoTotalOperacion": 9.38,
                "totalNoGravado": 0,
                "totalPagar": 9.38,
                "totalLetras": "NUEVE 38 /100",
                "totalIva": 1.08,
                "saldoFavor": 0,
                "condicionOperacion": 1,
                "pagos": [
                    {
                        "codigo": "03",
                        "montoPago": 9.38,
                        "referencia": null,
                        "plazo": null,
                        "periodo": null
                    }
                ],
                "numPagoElectronico": ""
            },
            "extension": null,
            "apendice": [
                {
                    "campo": "Datos del vendedor",
                    "etiqueta": "Nombre",
                    "valor": "SELENA - SELENA MARGARITA RODRIGUEZ PEREZ"
                },
                {
                    "campo": "Datos del documento",
                    "etiqueta": "N\u00B0 Documento",
                    "valor": "FA2323 - 0004582"
                },
                {
                    "campo": "Datos del documento",
                    "etiqueta": "Sello",
                    "valor": "2023DE567C7C05F4432BA2EA7868139093A1ATN0"
                }
            ]
        };
        const jsonValidado = yield (0, schemavalidator_1.validateSchema)(schemavalidator_1.DteEschema.FC, jsonData);
        return res.json((0, apiresponse_1.successResponse)(jsonValidado, "test"));
    });
}
function getVersionLegible(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const codigoGeneracion = req.body.codigoGeneracion;
        const urlLista = (process.env.MH_CONSULTA_JSON || "");
        const urlDoc = (process.env.MH_VERSION_LEGIBLE || "") + codigoGeneracion;
        let tkn = yield obtenerToken();
        let docJson;
        yield axios_1.default.post(urlLista, {
            codigoGeneracion: codigoGeneracion,
            tipoRpt: "E"
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
            if (error.response) {
                resp = error.response.data;
            }
            else if (error.request) {
            }
            else {
            }
        });
        // Convertir la cadena base64 de nuevo a buffer
        //const pdfBuffer = Buffer.from(resp, 'base64');
        //Enviar el buffer como respuesta
        //res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(resp);
    });
}
function descargarJsonMh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const codigoGeneracion = req.body.codigoGeneracion;
        const urlLista = (process.env.MH_CONSULTA_JSON || "");
        let tkn = yield obtenerToken();
        let docJson;
        yield axios_1.default.post(urlLista, {
            codigoGeneracion: codigoGeneracion,
            tipoRpt: "E"
        }, {
            headers: {
                "Authorization": tkn
            }
        }).then((result) => {
            docJson = result.data.body[0];
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
    test
};
