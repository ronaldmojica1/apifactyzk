"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagenABase64 = imagenABase64;
exports.generarFactura = generarFactura;
const puppeteer_1 = __importDefault(require("puppeteer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Registrar helper para formatear precios
handlebars_1.default.registerHelper('formatPrice', function (value) {
    // Formatear el número con 2 decimales y símbolo de dólar
    return new Intl.NumberFormat('es-SV', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
});
// Función para leer plantilla
function cargarPlantilla(nombreArchivo) {
    return __awaiter(this, void 0, void 0, function* () {
        const ruta = path_1.default.resolve(__dirname, '../../plantillashtml', nombreArchivo);
        return fs_1.default.promises.readFile(ruta, 'utf8');
    });
}
// Función para convertir imagen a Base64
function imagenABase64(rutaImagen) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.resolve(__dirname, 'templates', 'assets', rutaImagen);
        const imageBuffer = yield fs_1.default.promises.readFile(filePath);
        return `data:image/png;base64,${imageBuffer.toString('base64')}`;
    });
}
// Función para generar factura
function generarFactura(datosFactura, plantillaCliente, salidaPDF) {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlPlantilla = yield cargarPlantilla(plantillaCliente);
        const template = handlebars_1.default.compile(htmlPlantilla);
        const htmlFinal = template(datosFactura);
        const browser = yield puppeteer_1.default.launch({
            headless: true, // O 'new' dependiendo de tu versión/preferencia
            // AÑADE ESTOS ARGUMENTOS:
            args: [
                '--no-sandbox', // Desactiva el sandbox (necesario para root en Docker)
                '--disable-setuid-sandbox', // Otra medida relacionada con el sandbox en Linux
                // '--disable-dev-shm-usage',   // Opcional: A veces útil en Docker si /dev/shm es pequeño
                // '--disable-gpu',             // Opcional: Generalmente no necesaria para headless
            ]
        });
        const page = yield browser.newPage();
        yield page.setContent(htmlFinal, { waitUntil: 'domcontentloaded' });
        yield page.addStyleTag({ url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' });
        yield page.pdf({
            path: salidaPDF,
            format: 'A4',
            printBackground: true,
        });
        console.log(`✅ Factura generada: ${salidaPDF}`);
        yield browser.close();
    });
}
