"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Emisor_1 = __importDefault(require("./Emisor"));
const TipoItem_1 = __importDefault(require("../inventario/TipoItem"));
const Regimen_1 = __importDefault(require("./Regimen"));
const Receptor_1 = __importDefault(require("./Receptor"));
const TipoDte_1 = __importDefault(require("./TipoDte"));
const Ambiente_1 = __importDefault(require("./Ambiente"));
const TipoModelo_1 = __importDefault(require("./TipoModelo"));
const TipoOperacion_1 = __importDefault(require("./TipoOperacion"));
const TipoContingencia_1 = __importDefault(require("./TipoContingencia"));
const RecintoFiscal_1 = __importDefault(require("./RecintoFiscal"));
const Incoterms_1 = __importDefault(require("./Incoterms"));
const CondicionOperacions_1 = __importDefault(require("./CondicionOperacions"));
const CuerpoDocumento_1 = __importDefault(require("./CuerpoDocumento"));
const DocumentosRelacionados_1 = __importDefault(require("./DocumentosRelacionados"));
const OtrosDocumentos_1 = __importDefault(require("./OtrosDocumentos"));
const PagoDte_1 = __importDefault(require("./PagoDte"));
const TipoInvalidacion_1 = __importDefault(require("./TipoInvalidacion"));
const ResponsableAnulacion_1 = __importDefault(require("./ResponsableAnulacion"));
const TributosItem_1 = __importDefault(require("./TributosItem"));
const TituloBien_1 = __importDefault(require("./TituloBien"));
const Usuario_1 = __importDefault(require("../auth/Usuario"));
class Dte extends sequelize_1.Model {
}
Dte.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    emisorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Emisor_1.default,
            key: 'id'
        }
    },
    tipoItemExpoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoItem_1.default,
            key: 'id'
        }
    },
    regimenId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Regimen_1.default,
            key: 'id'
        }
    },
    recintoFiscalId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: RecintoFiscal_1.default,
            key: 'id'
        }
    },
    incotermId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Incoterms_1.default,
            key: 'id'
        }
    },
    seguro: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    flete: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    receptorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Receptor_1.default,
            key: 'id'
        }
    },
    tipoDteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDte_1.default,
            key: 'id'
        }
    },
    ambienteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Ambiente_1.default,
            key: 'id'
        }
    },
    numeroControl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    codigoGeneracion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tipoModeloId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoModelo_1.default,
            key: 'id'
        }
    },
    tipoOperacionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoOperacion_1.default,
            key: 'id'
        }
    },
    tipoContingenciaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoContingencia_1.default,
            key: 'id'
        }
    },
    motivoContingencia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    fecEmi: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    horEmi: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipoMoneda: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD'
    },
    esVentaTercero: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ventaTerceroNit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    ventaTerceroNombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    descuNoSuj: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    descuExenta: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    descuGravada: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    ivaRete1: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    ivaPerci1: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    reteRenta: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    saldoFavor: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    condicionOperacionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CondicionOperacions_1.default,
            key: 'id'
        }
    },
    numPagoElectronico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    habilitarExtension: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    nombEntrega: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    docuEntrega: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nombRecibe: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    docuRecibe: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    placaVehiculo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    codEmpleado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    selloRecibido: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    docAnulado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fecAnula: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    horAnula: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipoInvalidacionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoInvalidacion_1.default,
            key: 'id'
        }
    },
    motivoInvalidacion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    responsableAnulacionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ResponsableAnulacion_1.default,
            key: 'id'
        }
    },
    solicitaAnulacionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ResponsableAnulacion_1.default,
            key: 'id'
        }
    },
    codigoAnulacion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    selloAnulacion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    cobrarAId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Receptor_1.default,
            key: 'id'
        }
    },
    embarcarAId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Receptor_1.default,
            key: 'id'
        }
    },
    noViaje: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    carier: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    descIncoterms: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    booking: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    detalleEmbalaje: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    pesoNeto: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    pesoBruto: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    bultos: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    tituloBienId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TituloBien_1.default,
            key: 'id'
        }
    },
    creadoPorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario_1.default,
            key: 'id'
        }
    },
    transmitidoPorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'Dte',
    tableName: 'dte',
});
Dte.belongsTo(Emisor_1.default, { foreignKey: 'emisorId', as: 'emisor' });
Dte.belongsTo(TipoItem_1.default, { foreignKey: 'tipoItemExpoId', as: 'tipoItemExpo' });
Dte.belongsTo(Regimen_1.default, { foreignKey: 'regimenId', as: 'regimen' });
Dte.belongsTo(RecintoFiscal_1.default, { foreignKey: 'recintoFiscalId', as: 'recintoFiscal' });
Dte.belongsTo(Incoterms_1.default, { foreignKey: 'incotermId', as: 'incoterm' });
Dte.belongsTo(Receptor_1.default, { foreignKey: 'receptorId', as: 'receptor' });
Dte.belongsTo(TipoDte_1.default, { foreignKey: 'tipoDteId', as: 'tipoDte' });
Dte.belongsTo(Ambiente_1.default, { foreignKey: 'ambienteId', as: 'ambiente' });
Dte.belongsTo(TipoModelo_1.default, { foreignKey: 'tipoModeloId', as: 'tipoModelo' });
Dte.belongsTo(TipoOperacion_1.default, { foreignKey: 'tipoOperacionId', as: 'tipoOperacion' });
Dte.belongsTo(TipoContingencia_1.default, { foreignKey: 'tipoContingenciaId', as: 'tipoContingencia' });
Dte.belongsTo(CondicionOperacions_1.default, { foreignKey: 'condicionOperacionId', as: 'condicionOperacion' });
Dte.belongsTo(TipoInvalidacion_1.default, { foreignKey: 'tipoInvalidacionId', as: 'tipoInvalidacion' });
Dte.belongsTo(ResponsableAnulacion_1.default, { foreignKey: 'responsableAnulacionId', as: 'responsableAnulacion' });
Dte.belongsTo(ResponsableAnulacion_1.default, { foreignKey: 'solicitaAnulacionId', as: 'solicitaAnulacion' });
CuerpoDocumento_1.default.belongsTo(Dte, { foreignKey: 'dteId', as: 'dte' });
Dte.hasMany(CuerpoDocumento_1.default, { foreignKey: 'dteId', as: 'items' });
Dte.hasMany(TributosItem_1.default, { foreignKey: 'dteId', as: 'tributos' });
Dte.hasMany(DocumentosRelacionados_1.default, { foreignKey: 'dteId', as: 'docsRel' });
Dte.hasMany(OtrosDocumentos_1.default, { foreignKey: 'dteId', as: 'otrosDoc' });
Dte.hasMany(PagoDte_1.default, { foreignKey: 'dteId', as: 'pagoInfo' });
Dte.belongsTo(Receptor_1.default, { foreignKey: 'cobrarAId', as: 'cobrarA' });
Dte.belongsTo(Receptor_1.default, { foreignKey: 'embarcarAId', as: 'embarcarA' });
Dte.belongsTo(TituloBien_1.default, { foreignKey: 'tituloBienId', as: 'tiuloBien' });
Dte.belongsTo(Usuario_1.default, { foreignKey: 'creadoPorId', as: 'creadoPor' });
Dte.belongsTo(Usuario_1.default, { foreignKey: 'transmitidoPorId', as: 'transmitidoPor' });
exports.default = Dte;
