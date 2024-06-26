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
const Usuario_1 = __importDefault(require("../../models/auth/Usuario"));
const apiresponse_1 = require("../../config/apiresponse");
const encript_1 = require("../../utils/encript");
const usejwt_1 = require("../../utils/usejwt");
const RolUsuario_1 = __importDefault(require("../../models/auth/RolUsuario"));
const PermisoRol_1 = __importDefault(require("../../models/auth/PermisoRol"));
const Rol_1 = __importDefault(require("../../models/auth/Rol"));
const PermisoUsuario_1 = __importDefault(require("../../models/auth/PermisoUsuario"));
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const acts = yield Usuario_1.default.findAll();
            res.status(201).json((0, apiresponse_1.successResponse)(acts, ''));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function createR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.body.clave = yield (0, encript_1.encrypt)(req.body.clave);
            req.body.usuario = req.body.usuario.toLowerCase();
            const act = yield Usuario_1.default.create(req.body);
            res.status(201).json((0, apiresponse_1.successResponse)(act, 'Creado con exito!'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al crear'));
        }
        console.log(req.body);
    });
}
function updateR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Usuario_1.default.findByPk(req.params.id);
            req.body.usuario = req.body.usuario.toLowerCase();
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            if (req.body.clave != null) {
                req.body.clave = yield (0, encript_1.encrypt)(req.body.clave);
                yield act.update(req.body);
            }
            else {
                req.body.clave = act.clave;
                yield act.update(req.body);
            }
            res.status(201).json((0, apiresponse_1.successResponse)(act, 'Actualizado con exito'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al actualizar'));
        }
    });
}
function deleteR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Usuario_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Eliminar Relaciones
            //Eliminar los roles del usuario
            yield RolUsuario_1.default.destroy({
                where: {
                    usuarioId: act.id
                }
            });
            yield PermisoUsuario_1.default.destroy({
                where: {
                    usuarioId: act.id
                }
            });
            //Eliminar
            yield act.destroy();
            res.status(201).json((0, apiresponse_1.successResponse)(act, 'Eliminado con exito!'));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al eliminar'));
        }
    });
}
function getR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Usuario_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Ver
            res.status(201).json((0, apiresponse_1.successResponse)(act, ''));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al buscar'));
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.body.usuario = req.body.usuario.toLowerCase();
        const checkIs = yield Usuario_1.default.findOne({
            where: {
                usuario: req.body.usuario
            }
        });
        if (!checkIs)
            return res.status(200).json((0, apiresponse_1.errorResponse)("NOT_FOUND_USER"));
        const passwordHash = checkIs.clave;
        const isCorrect = yield (0, encript_1.verified)(req.body.clave, passwordHash);
        if (!isCorrect)
            return res.status(200).json((0, apiresponse_1.errorResponse)("PASSWORD_INCORRECT"));
        const token = (0, usejwt_1.generateToken)(checkIs.id);
        const decodToken = (0, usejwt_1.verifyToken)(token);
        const data = {
            token,
            user: checkIs,
            expires: new Date().toLocaleDateString()
        };
        res.json((0, apiresponse_1.successResponse)(data, 'Login Success'));
    });
}
function getPermisosUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            //Obtener los roles del usuario
            const rolesUsuario = yield RolUsuario_1.default.findAll({
                where: { usuarioId: id },
                include: [{
                        model: Rol_1.default,
                        as: 'rol',
                        include: [{
                                model: PermisoRol_1.default,
                                as: 'permisos',
                                attributes: ['permiso']
                            }]
                    }]
            });
            //obtener los permisos de los roles
            const permisosRol = rolesUsuario.flatMap((rolUsuario) => {
                return rolUsuario.rol.permisos.map((permisoRol) => permisoRol.permiso);
            });
            // Obtener los permisos asignados directamente al usuario
            const permisosUsuario = yield PermisoUsuario_1.default.findAll({
                where: { usuarioId: id },
                attributes: ['permiso']
            });
            const permisosUsuarioList = permisosUsuario.map(p => p.permiso);
            // Combinar ambas listas de permisos y eliminar duplicados
            const permisosTotales = [...new Set([...permisosRol, ...permisosUsuarioList])];
            res.status(201).json((0, apiresponse_1.successResponse)(permisosTotales, 'Success!'));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)("Error al obtener"));
        }
    });
}
exports.default = {
    getAllR,
    createR,
    updateR,
    deleteR,
    getR,
    getPermisosUsuario,
    login
};
