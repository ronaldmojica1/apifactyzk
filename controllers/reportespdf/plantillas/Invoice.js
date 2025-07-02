"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initInvoice = initInvoice;
const RptPdfUtils_1 = require("../utils/RptPdfUtils");
function initInvoice(doc, invoice, currentHeight, orientationLandscape = false) {
    var _a;
    const docWidth = (0, RptPdfUtils_1.getDocWidth)(doc);
    const useWidth = docWidth - 20; // 10px margin on each side
    // Set default styles
    doc.setTextColor(RptPdfUtils_1.colorBlack);
    doc.setFontSize(RptPdfUtils_1.pdfConfig.fieldTextSize);
    doc.setDrawColor(RptPdfUtils_1.colorGray);
    // Convert the traditional header to Row/Column format
    const headerRow = createHeaderRow(invoice, useWidth);
    // Render the header
    currentHeight += RptPdfUtils_1.pdfConfig.subLineHeight;
    const headerHeight = (0, RptPdfUtils_1.renderGrid)(doc, [headerRow], 10, currentHeight, useWidth);
    currentHeight += headerHeight;
    doc.setTextColor(RptPdfUtils_1.colorGray);
    // Process table rows
    const tableBodyLength = invoice.table.length;
    // Convert and render each table row
    for (let index = 0; index < tableBodyLength; index++) {
        const tableRow = invoice.table[index];
        // Convert the table row to Row/Column format
        const dataRow = createDataRow(tableRow, invoice.header, useWidth);
        // Render the row
        const rowHeight = (0, RptPdfUtils_1.renderGrid)(doc, [dataRow], 10, currentHeight, useWidth);
        currentHeight += rowHeight;
        // Check if we need to add a new page
        if (shouldAddNewPage(currentHeight, orientationLandscape, doc)) {
            doc.line(10, currentHeight - rowHeight, docWidth - 10, currentHeight - rowHeight);
            doc.addPage();
            currentHeight = 10;
            // If there are more rows, render the header again
            if (index + 1 < tableBodyLength) {
                const headerHeight = (0, RptPdfUtils_1.renderGrid)(doc, [headerRow], 10, currentHeight, useWidth);
                currentHeight += headerHeight;
            }
        }
    }
    // Add a line at the end of the table
    doc.line(10, currentHeight + 1, docWidth - 10, currentHeight + 1);
    // Calculate description height if exists
    const invDescSize = invoice.invDesc ? (0, RptPdfUtils_1.splitTextAndGetHeight)(invoice.invDesc, docWidth / 2, doc).height : 0;
    // Check if we need to add a new page for additional content
    if (shouldAddNewPageForAdditionalContent(currentHeight, invDescSize, orientationLandscape)) {
        doc.addPage();
        currentHeight = 10;
    }
    // Set styles for additional content
    doc.setTextColor(RptPdfUtils_1.colorBlack);
    doc.setFontSize(RptPdfUtils_1.pdfConfig.labelTextSize);
    currentHeight += RptPdfUtils_1.pdfConfig.lineHeight;
    // Render additional rows if they exist
    if (invoice.additionalRows && invoice.additionalRows.length > 0) {
        // Add a line before totals
        doc.line(docWidth / 2, currentHeight, docWidth - 10, currentHeight);
        currentHeight += RptPdfUtils_1.pdfConfig.lineHeight;
        // Process each additional row
        for (let i = 0; i < invoice.additionalRows.length; i++) {
            const additionalRow = invoice.additionalRows[i];
            currentHeight += RptPdfUtils_1.pdfConfig.lineHeight;
            // Apply custom font size if specified
            if ((_a = additionalRow.style) === null || _a === void 0 ? void 0 : _a.fontSize) {
                doc.setFontSize(additionalRow.style.fontSize);
            }
            // Render the columns with right alignment
            const textOptions = { align: "right" };
            if (additionalRow.col1)
                doc.text(additionalRow.col1, (docWidth / 1.5), currentHeight, textOptions);
            if (additionalRow.col2)
                doc.text(additionalRow.col2, docWidth - 25, currentHeight, textOptions);
            if (additionalRow.col3)
                doc.text(additionalRow.col3, docWidth - 10, currentHeight, textOptions);
            // Check if we need to add a new page
            if (shouldAddNewPageForAdditionalContent(currentHeight, invDescSize, orientationLandscape)) {
                doc.addPage();
                currentHeight = 10;
            }
        }
    }
    return {
        doc,
        currentHeight
    };
}
// Helper function to create a header row from the invoice header
function createHeaderRow(invoice, totalWidth) {
    const columns = invoice.header.map(header => {
        var _a, _b;
        // Create column style based on header properties
        const style = {
            fontStyle: 'bold',
            backgroundColor: RptPdfUtils_1.colorGray,
            textColor: RptPdfUtils_1.colorBlack,
            border: true,
            padding: 3,
            align: ((_a = header.style) === null || _a === void 0 ? void 0 : _a.right) ? 'right' : 'left'
        };
        // Calculate column size based on width
        const columnSize = ((_b = header.style) === null || _b === void 0 ? void 0 : _b.width)
            ? (header.style.width / totalWidth) * RptPdfUtils_1.pdfConfig.grid.columns
            : RptPdfUtils_1.pdfConfig.grid.columns / invoice.header.length;
        return new RptPdfUtils_1.Column(columnSize, header.title, undefined, style);
    });
    return new RptPdfUtils_1.Row(columns, { marginBottom: 2 });
}
// Helper function to create a data row from table data
function createDataRow(rowData, headers, totalWidth) {
    const columns = rowData.map((cellData, index) => {
        var _a, _b, _c, _d;
        // Create column style based on header properties
        const style = {
            border: true,
            padding: 3,
            align: ((_b = (_a = headers[index]) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.right) ? 'right' : 'left'
        };
        // Calculate column size based on header width
        const columnSize = ((_d = (_c = headers[index]) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.width)
            ? (headers[index].style.width / totalWidth) * RptPdfUtils_1.pdfConfig.grid.columns
            : RptPdfUtils_1.pdfConfig.grid.columns / headers.length;
        return new RptPdfUtils_1.Column(columnSize, cellData.toString(), undefined, style);
    });
    return new RptPdfUtils_1.Row(columns);
}
// Helper function to determine if a new page is needed
function shouldAddNewPage(currentHeight, orientationLandscape, doc) {
    if (orientationLandscape) {
        return currentHeight > 185 || (currentHeight > 178 && doc.getNumberOfPages() > 1);
    }
    else {
        return currentHeight > 265 || (currentHeight > 255 && doc.getNumberOfPages() > 1);
    }
}
// Helper function to determine if a new page is needed for additional content
function shouldAddNewPageForAdditionalContent(currentHeight, contentHeight, orientationLandscape) {
    if (orientationLandscape) {
        return currentHeight + contentHeight > 173;
    }
    else {
        return currentHeight + contentHeight > 270;
    }
}
