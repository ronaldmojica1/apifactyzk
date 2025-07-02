"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const apiresponse_1 = require("../../config/apiresponse");
const PlantillaHtmlPdf_1 = require("./PlantillaHtmlPdf");
const path = __importStar(require("path"));
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const DteController_1 = __importDefault(require("../factura/DteController"));
const Configuracion_1 = __importDefault(require("../../models/configuracion/Configuracion"));
const QRCode = __importStar(require("qrcode"));
const iResumen_1 = require("../../interfaces/documentos/iResumen");
const fs = __importStar(require("fs"));
//Funcion para obtener el logo de la empresa
function getLogoEmpresa() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find the first configuration record or create one if it doesn't exist
            const [config] = yield Configuracion_1.default.findOrCreate({
                where: {},
                defaults: {
                    usarLogo: false,
                    nombreLogo: null
                }
            });
            // If using logo and logo file exists, add the logo file as base64 in the response
            if (config.usarLogo && config.nombreLogo) {
                const logoPath = path.join('uploads/', config.nombreLogo);
                if (fs.existsSync(logoPath)) {
                    // Read the file and convert to base64
                    const logoFile = fs.readFileSync(logoPath);
                    const logoBase64 = logoFile.toString('base64');
                    // Get file extension to determine mime type
                    const fileExt = path.extname(config.nombreLogo).toLowerCase();
                    let mimeType = 'image/png'; // Default mime type
                    // Set appropriate mime type based on file extension
                    if (fileExt === '.jpg' || fileExt === '.jpeg') {
                        mimeType = 'image/jpeg';
                    }
                    else if (fileExt === '.gif') {
                        mimeType = 'image/gif';
                    }
                    else if (fileExt === '.svg') {
                        mimeType = 'image/svg+xml';
                    }
                    // Add the logo data to the response
                    const logoData = `data:${mimeType};base64,${logoBase64}`;
                    // Keep the URL as well for convenience
                    return logoData;
                }
            }
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    });
}
// Function to generate QR code as base64 string
function generateQRCode(text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const qrDataURL = yield QRCode.toDataURL(text, {
                errorCorrectionLevel: 'M',
                margin: 1,
                width: 100,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            // Return the data URL which is already in base64 format
            return qrDataURL;
        }
        catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    });
}
function generar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Obtener el ID del DTE desde la solicitud
            const { cliente, nombrePlantilla } = req.body;
            const plantillaCliente = cliente.toLowerCase() + '/' + nombrePlantilla.toLowerCase() + '-template.html';
            const dteId = req.params.id || req.body.dteId;
            if (!dteId) {
                return (0, apiresponse_1.errorResponse)("Se requiere el ID del documento para generar el PDF");
            }
            // Crear una solicitud y respuesta simuladas para obtener los datos del DTE
            const dteReq = { params: { id: dteId } };
            let datosFactura = null;
            // Respuesta simulada que captura los datos
            const dteRes = {
                json: (response) => {
                    if (response.success && response.data) {
                        datosFactura = response.data;
                    }
                },
                status: () => {
                    return {
                        json: (response) => {
                            // No hacer nada, solo para simular la respuesta
                        }
                    };
                }
            };
            // Obtener los datos del DTE usando la función getR de DteController
            yield DteController_1.default.getR(dteReq, dteRes);
            if (!datosFactura) {
                return (0, apiresponse_1.errorResponse)("No se pudo obtener la información del documento");
            }
            // Convertir datosFactura a JSON
            const datosFacturaJSON = JSON.parse(JSON.stringify(datosFactura));
            const qrText = `https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=${(_a = datosFacturaJSON.ambiente) === null || _a === void 0 ? void 0 : _a.codigo}&codGen=${datosFacturaJSON.codigoGeneracion}&fechaEmi=${datosFacturaJSON.fecEmi}`;
            const qrCodeBase64 = yield generateQRCode(qrText);
            // Añadir el QR code a los datos de la factura
            datosFacturaJSON.qrCode = qrCodeBase64;
            //a;adir el logo de la empresa
            const logoEmpresa = yield getLogoEmpresa();
            datosFacturaJSON.logoEmpresa = logoEmpresa;
            //Agregar el resumen
            const dte = yield Dte_1.default.findByPk(dteId);
            const resumen = yield (0, iResumen_1.getResumen)(dte);
            datosFacturaJSON.resumen = resumen;
            // Generar la factura
            const fileSaveName = 'uploads/' + datosFacturaJSON.codigoGeneracion + '.pdf';
            console.log(datosFacturaJSON);
            yield (0, PlantillaHtmlPdf_1.generarFactura)(datosFacturaJSON, plantillaCliente, fileSaveName);
            // Leer el archivo PDF generado y convertirlo a base64 para enviarlo al frontend
            const pdfBuffer = fs.readFileSync(fileSaveName);
            const pdfBase64 = pdfBuffer.toString('base64');
            // Enviar respuesta con el PDF en base64
            res.json({
                success: true,
                message: 'Factura generada exitosamente',
                data: {
                    pdfBase64: pdfBase64,
                    fileName: datosFacturaJSON.codigoGeneracion + '.pdf',
                }
            });
        }
        catch (error) {
            console.error('Error al generar la factura:', error instanceof Error ? error.message : error);
            console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
            res.json({ success: false, message: 'Error al generar la factura' });
        }
    });
}
exports.default = {
    generar
};
