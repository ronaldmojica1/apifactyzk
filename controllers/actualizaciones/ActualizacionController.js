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
const apiresponse_1 = require("../../config/apiresponse");
const child_process_1 = require("child_process");
function verificarActualizaciones(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currVersion = req.body.currentVersion;
            const response = yield axios_1.default.get(process.env.URL_CHECK_REPO_GIT || '', {
                headers: {
                    "Content-Type": 'application/JSON',
                    "Authorization": 'Bearer ' + process.env.TOKEN_GIT
                }
            });
            const latestVersion = response.data.tag_name;
            const currentVersion = currVersion; // Aquí deberías obtener la versión actual de tu aplicación
            let resp;
            if (latestVersion !== currentVersion) {
                resp = { disponible: true, version: latestVersion };
            }
            else {
                resp = { disponible: false };
            }
            res.status(201).json((0, apiresponse_1.successResponse)(resp, "Verificado"));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)(error));
        }
    });
}
function actualizar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield intentActualizar();
            res.status(201).json((0, apiresponse_1.successResponse)(null, "Actualizado"));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)(error));
        }
    });
}
function intentActualizar() {
    return __awaiter(this, void 0, void 0, function* () {
        //const comando = "CD " + (process.env.RUTA_APP || "") + " && git pull && npm install && npm run build";
        const comando = "CD " + (process.env.RUTA_APP || "") + " && git pull && CD " + (process.env.RUTA_API || "") + " && git pull";
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(comando, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error al actualizar la aplicación:', error);
                    reject(error);
                }
                else {
                    console.log('Aplicación actualizada exitosamente');
                    resolve(null);
                }
            });
        });
    });
}
exports.default = {
    verificarActualizaciones,
    actualizar
};
