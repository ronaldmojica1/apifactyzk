"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Tributo_1 = __importDefault(require("../inventario/Tributo"));
const CuerpoDocumento_1 = __importDefault(require("./CuerpoDocumento"));
const Dte_1 = __importDefault(require("./Dte"));
class TributosItem extends sequelize_1.Model {
}
TributosItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    itemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CuerpoDocumento_1.default,
            key: 'id',
        },
    },
    dteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dte_1.default,
            key: 'id'
        }
    },
    tributoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tributo_1.default,
            key: 'id',
        }
    },
    subTotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    sequelize: database_1.default,
    modelName: 'TributosItem',
    tableName: 'tributos_item',
});
TributosItem.belongsTo(Tributo_1.default, { foreignKey: 'tributoId', as: 'tributo' });
//sequelize.sync();
exports.default = TributosItem;
