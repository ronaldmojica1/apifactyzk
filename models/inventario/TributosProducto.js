"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Tributo_1 = __importDefault(require("./Tributo"));
const Producto_1 = __importDefault(require("./Producto"));
class TributosProducto extends sequelize_1.Model {
}
TributosProducto.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto_1.default,
            key: 'id',
        },
    },
    tributoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tributo_1.default,
            key: 'id',
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'TributosProducto',
    tableName: 'tributos_producto',
});
TributosProducto.belongsTo(Tributo_1.default, { foreignKey: 'tributoId', as: 'tributo' });
//sequelize.sync();
exports.default = TributosProducto;
