"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTemplate = initTemplate;
const RptPdfUtils_1 = require("../utils/RptPdfUtils");
const Head_1 = require("./Head");
const Invoice_1 = require("./Invoice");
function initTemplate(param) {
    // Initialize document
    let doc = (0, RptPdfUtils_1.initDocCreation)(param);
    // Get document dimensions
    const docWidth = (0, RptPdfUtils_1.getDocWidth)(doc);
    const docHeight = (0, RptPdfUtils_1.getDocHeight)(doc);
    // Starting position for content
    let currentHeight = 15;
    // Apply custom document creation callback if provided
    if (param.onJsPDFDocCreation) {
        param.onJsPDFDocCreation(doc);
    }
    // Set header
    let head = (0, Head_1.initHead)(doc, param.head, currentHeight);
    currentHeight = head.currentHeight;
    // Set invoice
    let invObj = (0, Invoice_1.initInvoice)(doc, param.invoice, currentHeight, param.orientationLandscape);
    currentHeight = invObj.currentHeight;
    // Set footer if provided
    if (param.footer && param.footer.text) {
        renderFooter(doc, param.footer.text, docWidth);
    }
    // Add page numbers if enabled
    if (param.pageEnable) {
        addPageNumbers(doc, param.pageLabel || 'Page');
    }
    // Prepare return object
    let returnObj = {
        pagesNumber: doc.getNumberOfPages(),
    };
    // Add jsPDF object to return if requested
    if (param.returnJsPDFDocObject) {
        returnObj = Object.assign(Object.assign({}, returnObj), { jsPDFObject: doc });
    }
    // Handle different output types
    if (param.outputType === 'save') {
        doc.save(param.fileName);
    }
    else if (param.outputType === "blob") {
        const blobOutput = doc.output("blob");
        returnObj = Object.assign(Object.assign({}, returnObj), { blob: blobOutput });
    }
    else if (param.outputType === "datauristring") {
        returnObj = Object.assign(Object.assign({}, returnObj), { dataUriString: doc.output("datauristring", {
                filename: param.fileName,
            }) });
    }
    else if (param.outputType === "arraybuffer") {
        returnObj = Object.assign(Object.assign({}, returnObj), { arrayBuffer: doc.output("arraybuffer") });
    }
    else {
        doc.output(param.outputType, {
            filename: param.fileName,
        });
    }
    return returnObj;
}
/**
 * Renders a footer at the bottom of each page
 */
function renderFooter(doc, footerText, docWidth) {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const footerY = doc.internal.pageSize.height - 10;
        // Create a footer row with centered text
        const footerColumn = new RptPdfUtils_1.Column(12, footerText, undefined, {
            align: 'center',
            fontSize: 8
        });
        const footerRow = new RptPdfUtils_1.Row([footerColumn]);
        // Render the footer
        (0, RptPdfUtils_1.renderGrid)(doc, [footerRow], 10, footerY, docWidth - 20);
    }
}
/**
 * Adds page numbers to each page
 */
function addPageNumbers(doc, pageLabel) {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageNumberY = doc.internal.pageSize.height - 5;
        const pageNumberText = `${pageLabel} ${i} / ${totalPages}`;
        // Create a page number row with right-aligned text
        const pageNumberColumn = new RptPdfUtils_1.Column(12, pageNumberText, undefined, {
            align: 'right',
            fontSize: 8
        });
        const pageNumberRow = new RptPdfUtils_1.Row([pageNumberColumn]);
        // Render the page number
        (0, RptPdfUtils_1.renderGrid)(doc, [pageNumberRow], 10, pageNumberY, doc.internal.pageSize.width - 20);
    }
}
