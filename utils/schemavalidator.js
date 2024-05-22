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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = exports.DteEschema = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
var DteEschema;
(function (DteEschema) {
    DteEschema["CCF"] = "fe-ccf-v3.json";
    DteEschema["CD"] = "fe-cd-v1.json";
    DteEschema["CL"] = "fe-cl-v1.json";
    DteEschema["CR"] = "fe-cr-v1.json";
    DteEschema["DCL"] = "fe-dcl-v1.json";
    DteEschema["FC"] = "fe-fc-v1.json";
    DteEschema["FEX"] = "fe-fex-v1.json";
    DteEschema["FSE"] = "fe-fse-v1.json";
    DteEschema["NC"] = "fe-nc-v3.json";
    DteEschema["ND"] = "fe-nd-v3.json";
    DteEschema["NR"] = "fe-nr-v3.json";
    DteEschema["ANULACION"] = "anulacion-schema-v2.json";
    DteEschema["CONTINGENCIA"] = "contingencia-schema-v3.json";
})(DteEschema || (exports.DteEschema = DteEschema = {}));
function loadSchemaFromFile(filename) {
    const filePath = path.join(__dirname, '../dte_schemas', filename);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
}
function validateSchema(fileName, jsonToValidate) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = yield loadSchemaFromFile(fileName);
        const cleanedData = cleanObject(jsonToValidate, schema);
        return cleanedData;
    });
}
exports.validateSchema = validateSchema;
function cleanObject(obj, schema) {
    const cleaned = {};
    // Verificar si obj es nulo o indefinido
    if (obj === null || typeof obj !== 'object') {
        if (typeof obj === 'string') { //Si es string
            return obj;
        }
        else {
            return null;
        }
    }
    Object.keys(obj).forEach((key) => {
        // Verificar si la propiedad está permitida en el esquema
        if (schema.properties && key in schema.properties) {
            const allowedTypes = schema.properties[key].type;
            const isObjectOrNull = Array.isArray(allowedTypes) && allowedTypes.includes('object') && allowedTypes.includes('null');
            // Si la propiedad es un objeto y tiene su propio esquema, aplica limpieza recursiva
            //if (typeof obj[key] === 'object' && schema.properties[key].type === 'object') {
            if (isObjectOrNull || allowedTypes === 'object') {
                // Si la propiedad es un objeto (o nulo) y tiene su propio esquema, aplica limpieza recursiva
                if (Array.isArray(obj[key]) && schema.properties[key].items) {
                    console.log(obj[key]);
                    // Si la propiedad es un array, aplica la limpieza a cada objeto dentro del array
                    cleaned[key] = obj[key].map((item) => cleanObject(item, schema.properties[key].items));
                }
                else {
                    cleaned[key] = cleanObject(obj[key], schema.properties[key]);
                }
                //console.log(key)
                //cleaned[key] = cleanObject(obj[key], schema.properties[key]);
            }
            else {
                if (Array.isArray(obj[key]) && schema.properties[key].items) {
                    // Si la propiedad es un array, aplica la limpieza a cada objeto dentro del array
                    cleaned[key] = obj[key].map((item) => cleanObject(item, schema.properties[key].items));
                }
                else {
                    cleaned[key] = obj[key];
                }
                // La propiedad es permitida según el esquema, la incluimos
                //cleaned[key] = obj[key];
            }
        }
        else {
            //console.warn(`Propiedad no permitida: ${key}`);
            // Puedes manejar la propiedad no permitida aquí, como ignorarla o registrar un aviso
        }
    });
    return cleaned;
}
