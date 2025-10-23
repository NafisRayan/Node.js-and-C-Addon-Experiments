const { PDFDocument, StandardFonts } = require('pdf-lib');
const { PortfolioStatementPdfUtils } = require('./portfolio-statement-pdf-utils');

class PortfolioStatementService {
  async generatePortfolioStatementPdf(data) {
    console.log('Generating Portfolio Statement PDF with data:', data);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Fill up header section with fund information
    await PortfolioStatementPdfUtils.fillUpHeaderInfo(pdfDoc, page, font, boldFont, {
      fundName: data.fundName,
      registeredUnder: data.registeredUnder || 'Securities & Exchange Commission (Mutual Fund) Rules, 2001',
      managedBy: data.managedBy || 'Shanta Asset Management Limited',
      address: data.address || 'The Glass House (Level 13), S.E (B) - 2, 38 Gulshan Avenue, Gulshan - 1, Dhaka 1212',
      phone: data.phone || '+88-02-48810551-2',
      fax: data.fax || '+88-02-48810553',
      statementDate: data.statementDate,
    });

    // Fill up investor information
    await PortfolioStatementPdfUtils.fillUpInvestorInfo(page, font, boldFont, {
      investorName: data.investorName,
      registrationNo: data.registrationNo,
    });

    // Fill up investment table
    const tableEndY = await PortfolioStatementPdfUtils.fillUpInvestmentTable(page, font, boldFont, {
      fundDeposit: data.fundDeposit,
      dividendReinvested: data.dividendReinvested,
      totalDeposit: data.totalDeposit,
      totalWithdrawal: data.totalWithdrawal,
      unitsPurchased: data.unitsPurchased,
      cipUnits: data.cipUnits,
      unitsSurrender: data.unitsSurrender,
      unitsHeld: data.unitsHeld,
      averageCostPerUnit: data.averageCostPerUnit,
      investmentAtCost: data.investmentAtCost,
      currentNav: data.currentNav,
      currentNavDate: data.currentNavDate,
      marketValue: data.marketValue,
      capitalGainRealized: data.capitalGainRealized,
      capitalGainUnrealized: data.capitalGainUnrealized,
      totalCapitalGain: data.totalCapitalGain,
      dividendIncome: data.dividendIncome,
      dividendReceivable: data.dividendReceivable,
      totalReturn: data.totalReturn,
      cashBalance: data.cashBalance,
    });

    // Fill up footer note (2 lines under table)
    await PortfolioStatementPdfUtils.fillUpFooterNote(page, font, boldFont, tableEndY);

    return Buffer.from(await pdfDoc.save());
  }
}

module.exports = PortfolioStatementService;
