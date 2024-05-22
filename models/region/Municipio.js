"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Departamento_1 = __importDefault(require("./Departamento"));
class Municipio extends sequelize_1.Model {
}
Municipio.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    municipio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    departamentoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Departamento_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'Municipio',
    tableName: 'municipio',
});
Municipio.belongsTo(Departamento_1.default, { foreignKey: 'departamentoId', as: 'departamento' });
//sequelize.sync();
exports.default = Municipio;
