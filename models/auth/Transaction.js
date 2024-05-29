"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Usuario_1 = __importDefault(require("./Usuario"));
class Transaction extends sequelize_1.Model {
}
Transaction.init({
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
        },
    },
    accion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    registroId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    modelName: 'Transaction',
    tableName: 'transaction',
});
//sequelize.sync();
exports.default = Transaction;
