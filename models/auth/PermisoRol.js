"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Rol_1 = __importDefault(require("./Rol"));
class PermisoRol extends sequelize_1.Model {
}
PermisoRol.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rolId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rol_1.default,
            key: 'id'
        }
    },
    permiso: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'PermisoRol',
    tableName: 'permiso_rol',
});
//PermisoRol.belongsTo(Rol,{foreignKey:'rolId',as:'rol'});
Rol_1.default.hasMany(PermisoRol, { foreignKey: 'rolId', as: 'permisos' });
PermisoRol.belongsTo(Rol_1.default, { foreignKey: 'rolId', as: 'rol' });
//sequelize.sync();
exports.default = PermisoRol;
