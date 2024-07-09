"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = exports.Column = exports.colorGray = exports.colorBlack = exports.pdfConfig = exports.getDocHeight = exports.getDocWidth = exports.splitTextAndGetHeight = exports.initDocCreation = void 0;
const jspdf_1 = __importDefault(require("jspdf"));
function initDocCreation(param) {
    const options = {
        orientation: param.orientationLandscape ? "landscape" : "portrait",
        compress: param.compress
    };
    let doc = new jspdf_1.default(options);
    return doc;
}
exports.initDocCreation = initDocCreation;
function splitTextAndGetHeight(text, size, doc) {
    const lines = doc.splitTextToSize(text, size);
    return {
        text: lines,
        height: doc.getTextDimensions(lines).h
    };
}
exports.splitTextAndGetHeight = splitTextAndGetHeight;
function getDocWidth(doc) {
    return doc.internal.pageSize.width;
}
exports.getDocWidth = getDocWidth;
function getDocHeight(doc) {
    return doc.internal.pageSize.height;
}
exports.getDocHeight = getDocHeight;
exports.pdfConfig = {
    headerTextSize: 10,
    labelTextSize: 9,
    fieldTextSize: 7.5,
    lineHeight: 6,
    subLineHeight: 4,
};
exports.colorBlack = "#000000";
exports.colorGray = "#4d4e53";
// Define una clase para las columnas
class Column {
    constructor(size, content, rows) {
        this.size = size;
        this.content = content;
        this.rows = rows;
    }
}
exports.Column = Column;
// Define una clase para las filas
class Row {
    constructor(columns) {
        this.columns = columns;
    }
}
exports.Row = Row;
;
