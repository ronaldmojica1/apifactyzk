"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const RolUsuario_1 = __importDefault(require("./RolUsuario"));
class Usuario extends sequelize_1.Model {
}
Usuario.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    usuario: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    clave: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    admin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Usuario',
    tableName: 'usuario',
});
//sequelize.sync();
Usuario.hasMany(RolUsuario_1.default, { foreignKey: 'usuarioId', as: 'roles' });
//Usuario.hasMany(PermisoUsuario,{foreignKey:'usuarioId',as:'permisosDirectos'});
//PermisoUsuario.belongsTo(Usuario,{foreignKey:'usuarioId',as:'usuario'});
exports.default = Usuario;
