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
exports.descifrarCadena = exports.cifrarCadena = exports.verified = exports.encrypt = void 0;
const bcryptjs_1 = require("bcryptjs");
const cryptr_1 = __importDefault(require("cryptr"));
const cryptr = new cryptr_1.default('Agifact24');
const encrypt = (pass) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = yield (0, bcryptjs_1.hash)(pass, 8);
    return passwordHash;
});
exports.encrypt = encrypt;
const verified = (pass, passHash) => __awaiter(void 0, void 0, void 0, function* () {
    const isCorrect = yield (0, bcryptjs_1.compare)(pass, passHash);
    return isCorrect;
});
exports.verified = verified;
const cifrarCadena = (cadena) => __awaiter(void 0, void 0, void 0, function* () {
    const encripted = cryptr.encrypt(cadena);
    return encripted;
});
exports.cifrarCadena = cifrarCadena;
const descifrarCadena = (cadena) => __awaiter(void 0, void 0, void 0, function* () {
    const decripted = cryptr.decrypt(cadena);
    return decripted;
});
exports.descifrarCadena = descifrarCadena;
