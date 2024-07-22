"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const MigracionController_1 = __importDefault(require("./controllers/actualizaciones/MigracionController"));
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production';
dotenv_1.default.config({ path: envFile });
const PORT = process.env.PORT || 3001;
const enviroment = process.env.NODE_ENV || "";
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.router);
MigracionController_1.default.verificarMigracion();
app.listen(PORT, () => {
    console.log(`Servidor iniciado en ${PORT}`);
    console.log(`Entorno ${enviroment}`);
});
