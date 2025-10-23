const { PDFDocument, StandardFonts } = require('pdf-lib');
const { CouaLetterPdfUtils } = require('./coua-letter-pdf-utils');

class CouaLetterService {
  async generateCouaLetterPdf(data) {
    console.log('Generating COUA Letter PDF with data:', data);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Fill up top section with fund and investor information
    await CouaLetterPdfUtils.fillUpTopInfo(pdfDoc, page, font, {
      date: data.date,
      investorId: data.investorId,
      regNumber: data.regNumber,
      unitAllocationNo: data.unitAllocationNo,
      fundName: data.fundName,
      registeredUnder:
        data.registeredUnder ||
        'Bangladesh Securities and Exchange Commission (Mutual Fund) Rules, 2001',
      fundRegNo: data.fundRegNo,
      fundSponsor: data.fundSponsor,
      fundAssetManager: data.fundAssetManager,
      fundTrustee: data.fundTrustee,
      fundCustodian: data.fundCustodian,
    });

    // Fill up middle section with investor details table
    await CouaLetterPdfUtils.fillUpMiddleTableInfo(pdfDoc, page, font, {
      fundName: data.fundName,
      date: data.date,
      investorName: data.investorName,
      investorNid: data.investorNid,
      investorFatherName: data.investorFatherName,
      numberOfUnits: data.numberOfUnits,
      averageBuyPrice: data.averageBuyPrice,
      totalInvestmentValue: data.totalInvestmentValue,
    });

    // Fill up bottom section with notes and contact information
    await CouaLetterPdfUtils.fillUpBottomNoteInfo(pdfDoc, page, font, {
      fundName: data.fundName,
      contactNumber: data.contactNumber || '+88 09678 666 888',
      contactEmail: data.contactEmail || 'info@shanta-aml.com',
    });

    return Buffer.from(await pdfDoc.save());
  }
}

module.exports = CouaLetterService;
