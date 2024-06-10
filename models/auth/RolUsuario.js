"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Rol_1 = __importDefault(require("./Rol"));
const Usuario_1 = __importDefault(require("./Usuario"));
class RolUsuario extends sequelize_1.Model {
}
RolUsuario.init({
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
    usuarioId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'RolUsuario',
    tableName: 'rol_usuario',
});
//sequelize.sync();
RolUsuario.belongsTo(Rol_1.default, { foreignKey: 'rolId', as: "rol" });
//RolUsuario.belongsTo(Usuario,{foreignKey:'rolId',as:"usuario"});
exports.default = RolUsuario;
