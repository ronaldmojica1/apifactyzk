"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initInvoice = void 0;
const RptPdfUtils_1 = require("../utils/RptPdfUtils");
function initInvoice(doc, invoice, currentHeight, orientationLandscape = false) {
    var _a, _b;
    const docWidth = (0, RptPdfUtils_1.getDocWidth)(doc);
    let tdWidth = (docWidth - 20) / invoice.header.length;
    if (invoice.header.length > 2) {
        const customColumNo = invoice.header.map(x => { var _a; return ((_a = x === null || x === void 0 ? void 0 : x.style) === null || _a === void 0 ? void 0 : _a.width) || 0; }).filter(x => x > 0);
        let customWidthOfAllColumns = customColumNo.reduce((a, b) => a + b, 0);
        tdWidth = (docWidth - 20 - customWidthOfAllColumns) / (invoice.header.length - customColumNo.length);
    }
    const addTableHeaderBorder = (lineHeight) => {
        var _a, _b, _c, _d;
        currentHeight += 2;
        //const lineHeight = 7;
        let startWidth = 0;
        for (let i = 0; i < invoice.header.length; i++) {
            const currentTdWidth = ((_b = (_a = invoice.header[i]) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.width) || tdWidth;
            if (i === 0)
                doc.rect(10, currentHeight, currentTdWidth, lineHeight);
            else {
                const previousTdWidth = ((_d = (_c = invoice.header[i - 1]) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.width) || tdWidth;
                const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
                startWidth += widthToUse;
                doc.rect(startWidth + 10, currentHeight, currentTdWidth, lineHeight);
            }
        }
        currentHeight -= 2;
    };
    const addTableBodyBorder = (lineHeight) => {
        var _a, _b, _c, _d;
        let startWidth = 0;
        for (let i = 0; i < invoice.header.length; i++) {
            const currentTdWidth = ((_b = (_a = invoice.header[i]) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.width) || tdWidth;
            if (i === 0)
                doc.rect(10, currentHeight, currentTdWidth, lineHeight);
            else {
                const previousTdWidth = ((_d = (_c = invoice.header[i - 1]) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.width) || tdWidth;
                const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
                startWidth += widthToUse;
                doc.rect(startWidth + 10, currentHeight, currentTdWidth, lineHeight);
            }
        }
    };
    const addTableBodyLines = (lineHeight) => {
        var _a, _b, _c, _d, _e, _f;
        let startWidth = 0;
        for (let i = 0; i < invoice.header.length; i++) {
            const currentTdWidth = ((_b = (_a = invoice.header[i]) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.width) || tdWidth;
            if (i === 0)
                doc.line(10, currentHeight, 10, currentHeight + lineHeight);
            else {
                const previousTdWidth = ((_d = (_c = invoice.header[i - 1]) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.width) || tdWidth;
                const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
                startWidth += widthToUse;
                doc.line(startWidth + 10, currentHeight, startWidth + 10, currentHeight + lineHeight);
            }
            if (i === invoice.header.length - 1) {
                const previousTdWidth = ((_f = (_e = invoice.header[i - 1]) === null || _e === void 0 ? void 0 : _e.style) === null || _f === void 0 ? void 0 : _f.width) || tdWidth;
                const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
                startWidth += widthToUse;
                doc.line(startWidth + 10, currentHeight, startWidth + 10, currentHeight + lineHeight);
            }
        }
    };
    /*const getHeadersHeight = function () {
      let headerHeight: any = [];
      invoice.header.forEach(function (hh, index: number) {
        const widthToUse = hh.style?.width || tdWidth;
        let item = splitTextAndGetHeight(hh.title.toString(), widthToUse - 1, doc); //minus 1, to fix the padding issue between borders
        headerHeight.push(item.height);
      });
      return headerHeight;
    };
    let maxHeaderHeight = Math.max(...getHeadersHeight());*/
    const addTableHeader = () => {
        if (invoice.headerBorder)
            addTableHeaderBorder(8);
        currentHeight += RptPdfUtils_1.pdfConfig.subLineHeight;
        doc.setTextColor(RptPdfUtils_1.colorBlack);
        doc.setFontSize(RptPdfUtils_1.pdfConfig.fieldTextSize);
        //border color
        doc.setDrawColor(RptPdfUtils_1.colorGray);
        currentHeight += 2;
        let startWidth = 0;
        invoice.header.forEach(function (row, index) {
            var _a, _b, _c;
            const currentTdWidth = ((_a = row === null || row === void 0 ? void 0 : row.style) === null || _a === void 0 ? void 0 : _a.width) || tdWidth;
            const previousTdWidth = ((_c = (_b = invoice.header[index - 1]) === null || _b === void 0 ? void 0 : _b.style) === null || _c === void 0 ? void 0 : _c.width) || tdWidth;
            const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
            let item = (0, RptPdfUtils_1.splitTextAndGetHeight)(row.title.toString(), currentTdWidth - 1, doc); //minus 1, to fix the padding issue between borders
            if (index == 0)
                doc.text(item.text, 11, currentHeight);
            else {
                startWidth += widthToUse;
                doc.text(item.text, startWidth + 11, currentHeight);
            }
        });
        currentHeight += RptPdfUtils_1.pdfConfig.subLineHeight - 1;
        doc.setTextColor(RptPdfUtils_1.colorGray);
    };
    addTableHeader();
    const tableBodyLength = invoice.table.length;
    const txtOptionsLght = {
        align: "right"
    };
    invoice.table.forEach(function (row, index) {
        //doc.line(10, currentHeight, docWidth - 10, currentHeight);//Esto inserta una linea divisora por cada item
        //get nax height for the current row
        const getRowsHeight = function () {
            let rowsHeight = [];
            row.forEach(function (rr, index) {
                var _a, _b;
                const widthToUse = ((_b = (_a = invoice.header[index]) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.width) || tdWidth;
                let item = (0, RptPdfUtils_1.splitTextAndGetHeight)(rr.toString(), widthToUse - 1, doc); //minus 1, to fix the padding issue between borders
                rowsHeight.push(item.height);
            });
            return rowsHeight;
        };
        let maxHeight = Math.max(...getRowsHeight());
        //body borders
        if (invoice.tableBodyBorder)
            addTableBodyLines(maxHeight + 2);
        let startWidth = 0;
        row.forEach(function (rr, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const widthToUse = ((_b = (_a = invoice.header[index]) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.width) || tdWidth;
            let item = (0, RptPdfUtils_1.splitTextAndGetHeight)(rr.toString(), widthToUse - 1, doc); //minus 1, to fix the padding issue between borders    
            if (index == 0)
                doc.text(item.text, 11, currentHeight + 4);
            else {
                const currentTdWidth = ((_c = rr === null || rr === void 0 ? void 0 : rr.style) === null || _c === void 0 ? void 0 : _c.width) || tdWidth; //a esto no le encuentro mucho sentido pero como alguien dijo si funciona no lo mueva
                const previousTdWidth = ((_e = (_d = invoice.header[index - 1]) === null || _d === void 0 ? void 0 : _d.style) === null || _e === void 0 ? void 0 : _e.width) || tdWidth;
                const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth; //aca se declara nuevamente constante (algo to fix)
                const nextTdWidth = index < invoice.header.length ? (((_g = (_f = invoice.header[index + 1]) === null || _f === void 0 ? void 0 : _f.style) === null || _g === void 0 ? void 0 : _g.width) || tdWidth) : 0;
                startWidth += widthToUse;
                const rightWidth = startWidth + nextTdWidth - 1.5; //1.5 para corregir el padding
                //Verificar si se alinea a la izquierda
                if ((_j = (_h = invoice.header[index]) === null || _h === void 0 ? void 0 : _h.style) === null || _j === void 0 ? void 0 : _j.right) {
                    doc.text(item.text, 11 + rightWidth, currentHeight + 4, txtOptionsLght);
                }
                else {
                    doc.text(item.text, 11 + startWidth, currentHeight + 4);
                }
            }
        });
        currentHeight += maxHeight - 4;
        //td border height
        currentHeight += 5;
        //pre-increase currentHeight to check the height based on next row
        if (index + 1 < tableBodyLength)
            currentHeight += maxHeight;
        if (orientationLandscape &&
            (currentHeight > 185 ||
                (currentHeight > 178 && doc.getNumberOfPages() > 1))) {
            doc.line(10, currentHeight - (maxHeight), docWidth - 10, currentHeight - (maxHeight));
            doc.addPage();
            currentHeight = 10;
            if (index + 1 < tableBodyLength)
                addTableHeader();
        }
        if (!orientationLandscape &&
            (currentHeight > 265 ||
                (currentHeight > 255 && doc.getNumberOfPages() > 1))) {
            doc.line(10, currentHeight - (maxHeight), docWidth - 10, currentHeight - (maxHeight));
            doc.addPage();
            currentHeight = 10;
            if (index + 1 < tableBodyLength)
                addTableHeader();
            //else
            //currentHeight += pdfConfig.subLineHeight + 2 + pdfConfig.subLineHeight - 1; //same as in addtableHeader
        }
        //reset the height that was increased to check the next row
        if (index + 1 < tableBodyLength && currentHeight > 30)
            // check if new page
            currentHeight -= maxHeight;
    });
    //TO DO: completar tabla hasta el final del footer
    //Agregar una linea al final de la tabla de items
    doc.line(10, currentHeight + 1, docWidth - 10, currentHeight + 1);
    var invDescSize = invoice.invDesc ? (0, RptPdfUtils_1.splitTextAndGetHeight)(invoice.invDesc, docWidth / 2, doc).height : 0;
    const checkAndAddPageLandscape = () => {
        if (!orientationLandscape && currentHeight + invDescSize > 270) {
            doc.addPage();
            currentHeight = 10;
        }
    };
    const checkAndAddPageNotLandscape = function (heightLimit = 173) {
        if (orientationLandscape && currentHeight + invDescSize > heightLimit) {
            doc.addPage();
            currentHeight = 10;
        }
    };
    const checkAndAddPage = function () {
        checkAndAddPageNotLandscape();
        checkAndAddPageLandscape();
    };
    checkAndAddPage();
    doc.setTextColor(RptPdfUtils_1.colorBlack);
    doc.setFontSize(RptPdfUtils_1.pdfConfig.labelTextSize);
    currentHeight += RptPdfUtils_1.pdfConfig.lineHeight;
    if (invoice.additionalRows) {
        if (((_a = invoice.additionalRows) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            //#region Line breaker before invoce total
            doc.line(docWidth / 2, currentHeight, docWidth - 10, currentHeight);
            currentHeight += RptPdfUtils_1.pdfConfig.lineHeight;
            //#endregion
            if (invoice.additionalRows != undefined) {
                for (let i = 0; i < invoice.additionalRows.length; i++) {
                    currentHeight += RptPdfUtils_1.pdfConfig.lineHeight;
                    if (invoice.additionalRows[i].style != undefined) {
                        doc.setFontSize(((_b = invoice.additionalRows[i].style) === null || _b === void 0 ? void 0 : _b.fontSize) || 0);
                    }
                    if (invoice.additionalRows[i].col1 != undefined)
                        doc.text(invoice.additionalRows[i].col1 || "", (docWidth / 1.5), currentHeight, txtOptionsLght);
                    if (invoice.additionalRows[i].col2 != undefined)
                        doc.text(invoice.additionalRows[i].col2 || "", docWidth - 25, currentHeight, txtOptionsLght);
                    if (invoice.additionalRows[i].col3 != undefined)
                        doc.text(invoice.additionalRows[i].col3 || "", docWidth - 10, currentHeight, txtOptionsLght);
                    checkAndAddPage();
                }
            }
        }
    }
    checkAndAddPage();
    return {
        doc,
        currentHeight
    };
}
exports.initInvoice = initInvoice;
