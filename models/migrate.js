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
const fs_1 = require("fs");
const database_1 = __importDefault(require("../config/database"));
const path = require('path');
const PATH_ROUTER = `${__dirname}`;
const JSON_ROUTER = path.join(PATH_ROUTER, '../migrations/data/');
/**
 *
 * @returns
 */
const cleanFileName = (fileName) => {
    const file = fileName.split(".").shift();
    return file;
};
//Importar los modelos para poder trabajar
(0, fs_1.readdirSync)(PATH_ROUTER).filter((folderName) => {
    const cleanFolder = cleanFileName(folderName);
    if (cleanFolder !== "migrate" && cleanFolder !== "createbd") {
        (0, fs_1.readdirSync)(PATH_ROUTER + '/' + cleanFolder).filter((fileName) => {
            const cleanName = cleanFileName(fileName);
            Promise.resolve(`${`./${cleanFolder}/${cleanName}`}`).then(s => __importStar(require(s)));
        });
    }
});
//Importar los JSON
const fileNames = (0, fs_1.readdirSync)(JSON_ROUTER);
// Ordena los nombres de archivo numéricamente
const sortedFileNames = fileNames.sort((a, b) => {
    var _a, _b;
    const numA = parseInt(((_a = a.match(/^\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '0', 10);
    const numB = parseInt(((_b = b.match(/^\d+/)) === null || _b === void 0 ? void 0 : _b[0]) || '0', 10);
    return numA - numB;
});
sortedFileNames.forEach((fName) => {
    Promise.resolve(`${`${JSON_ROUTER}${fName}`}`).then(s => __importStar(require(s))).then((jsonFile) => __awaiter(void 0, void 0, void 0, function* () {
        //await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        //await sequelize.model(jsonFile.model).destroy({truncate:true,cascade:true});        
        yield database_1.default.model(jsonFile.model).bulkCreate(jsonFile.data);
    }));
});
//sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
//process.exit();
