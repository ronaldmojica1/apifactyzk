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
const Configuracion_1 = __importDefault(require("../../models/configuracion/Configuracion"));
const apiresponse_1 = require("../../config/apiresponse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Get the single configuration record
 */
function getConfig(req, res) {
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
            // Create a response object from the config
            const responseData = config.toJSON();
            // If using logo and logo file exists, add the logo file as base64 in the response
            if (config.usarLogo && config.nombreLogo) {
                const logoPath = path_1.default.join('uploads/', config.nombreLogo);
                if (fs_1.default.existsSync(logoPath)) {
                    // Read the file and convert to base64
                    const logoFile = fs_1.default.readFileSync(logoPath);
                    const logoBase64 = logoFile.toString('base64');
                    // Get file extension to determine mime type
                    const fileExt = path_1.default.extname(config.nombreLogo).toLowerCase();
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
                    responseData.logoData = `data:${mimeType};base64,${logoBase64}`;
                    // Keep the URL as well for convenience
                    responseData.logoUrl = `/uploads/${config.nombreLogo}`;
                }
            }
            res.status(200).json((0, apiresponse_1.successResponse)(responseData, ''));
        }
        catch (error) {
            console.error(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener la configuración'));
        }
    });
}
/**
 * Create or update the configuration record
 */
function updateConfig(req, res) {
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
            // Update the configuration with the request body
            yield config.update(req.body);
            res.status(200).json((0, apiresponse_1.successResponse)(config, 'Configuración actualizada con éxito'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al actualizar la configuración'));
        }
    });
}
exports.default = {
    getConfig,
    updateConfig,
};
