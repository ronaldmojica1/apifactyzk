"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Dte_1 = __importDefault(require("./Dte"));
class Apendice extends sequelize_1.Model {
}
Apendice.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dte_1.default,
            key: 'id'
        }
    },
    campo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    etiqueta: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    valor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'Apendice',
    tableName: 'apendice',
});
Dte_1.default.hasMany(Apendice, { foreignKey: 'dteId', as: 'apendice' });
exports.default = Apendice;
