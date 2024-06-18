"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Usuario_1 = __importDefault(require("./Usuario"));
class PermisoUsuario extends sequelize_1.Model {
}
PermisoUsuario.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuarioId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario_1.default,
            key: 'id'
        }
    },
    permiso: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'PermisoUsuario',
    tableName: 'permiso_usuario',
});
//sequelize.sync();
Usuario_1.default.hasMany(PermisoUsuario, { foreignKey: 'usuarioId', as: 'permisosDirectos' });
PermisoUsuario.belongsTo(Usuario_1.default, { foreignKey: 'usuarioId', as: 'usuario' });
exports.default = PermisoUsuario;
