"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Producto_1 = __importDefault(require("../inventario/Producto"));
const Dte_1 = __importDefault(require("./Dte"));
const RetencionMH_1 = __importDefault(require("./RetencionMH"));
const TipoDte_1 = __importDefault(require("./TipoDte"));
const TipoGeneracion_1 = __importDefault(require("./TipoGeneracion"));
const UnidadMedida_1 = __importDefault(require("../inventario/UnidadMedida"));
const TributosItem_1 = __importDefault(require("./TributosItem"));
const TipoItem_1 = __importDefault(require("../inventario/TipoItem"));
const TipoVenta_1 = __importDefault(require("../inventario/TipoVenta"));
const Tributo_1 = __importDefault(require("../inventario/Tributo"));
class CuerpoDocumento extends sequelize_1.Model {
}
CuerpoDocumento.init({
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
    numItem: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    productoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Producto_1.default,
            key: 'id'
        }
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    unidadMedidaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UnidadMedida_1.default,
            key: 'id'
        }
    },
    tipoItemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoItem_1.default,
            key: 'id'
        }
    },
    tipoVentaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoVenta_1.default,
            key: 'id'
        }
    },
    tributoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Tributo_1.default,
            key: 'id'
        }
    },
    numeroDocumento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    cantidad: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    precioUni: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ventaNoSuj: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    montoDescu: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ventaExenta: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ventaGravada: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    noGravado: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    dteItemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CuerpoDocumento,
            key: 'id'
        }
    },
    tipoDteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoDte_1.default,
            key: 'id'
        }
    },
    tipoGeneracionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoGeneracion_1.default,
            key: 'id'
        }
    },
    fechaEmision: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    montoSujetoGrav: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    retencionMhId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: RetencionMH_1.default,
            key: 'id'
        }
    },
    ivaRetenido: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    exportaciones: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    obsItem: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    periodoLiquidacionFechaInicio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    periodoLiquidacionFechaFin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    codLiquidacion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    cantidadDoc: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    valorOperaciones: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    montoSinPercepcion: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    descripSinPercepcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    subTotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    iva: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    montoSujetoPercepcion: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    ivaPercibido: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    comision: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    porcentComision: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ivaComision: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    liquidoApagar: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    totalLetras: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    compra: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    pesoBruto: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    pesoNeto: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    marca: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    serie: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    paisOrigen: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: database_1.default,
    modelName: 'CuerpoDocumento',
    tableName: 'cuerpo_documento',
});
//CuerpoDocumento.hasMany(TributosItem,{foreignKey:'itemId',as:'tributos'});
CuerpoDocumento.belongsTo(Producto_1.default, { foreignKey: 'productoId', as: 'producto' });
CuerpoDocumento.belongsTo(UnidadMedida_1.default, { foreignKey: 'unidadMedidaId', as: 'unidadMedida' });
//CuerpoDocumento.belongsTo(CuerpoDocumento,{foreignKey:'dteItemId' , as: 'dteItem'});
CuerpoDocumento.belongsTo(TipoDte_1.default, { foreignKey: 'tipoDteId', as: 'tipoDte' });
CuerpoDocumento.belongsTo(TipoGeneracion_1.default, { foreignKey: 'tipoGeneracionId', as: 'tipoGeneracion' });
CuerpoDocumento.belongsTo(RetencionMH_1.default, { foreignKey: 'retencionMhId', as: 'retencionMh' });
CuerpoDocumento.belongsTo(TipoItem_1.default, { foreignKey: 'tipoItemId', as: 'tipoItem' });
CuerpoDocumento.belongsTo(TipoVenta_1.default, { foreignKey: 'tipoVentaId', as: 'tipoVenta' });
CuerpoDocumento.belongsTo(Tributo_1.default, { foreignKey: 'tributoId', as: 'tributo' });
//Dte.hasMany(CuerpoDocumento,{foreignKey:'dteId', as :'items'});
CuerpoDocumento.hasMany(TributosItem_1.default, { foreignKey: 'itemId', as: 'tributos' });
//CuerpoDocumento.belongsTo(Dte,{foreignKey:'dteId',as:'dte'});
exports.default = CuerpoDocumento;
