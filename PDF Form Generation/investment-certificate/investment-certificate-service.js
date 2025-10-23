const { PDFDocument, StandardFonts } = require('pdf-lib');
const { InvestmentCertificatePdfUtils } = require('./investment-certificate-pdf-utils');

class InvestmentCertificateService {
  async generateInvestmentCertificatePdf(data) {
    console.log('Generating Investment Certificate PDF with data:', data);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Fill up header section
    await InvestmentCertificatePdfUtils.fillUpHeaderInfo(pdfDoc, page, font, boldFont, {
      fundName: data.fundName,
      registeredUnder: data.registeredUnder || 'Bangladesh Securities & Exchange Commission (Mutual Fund) Rules, 2001',
      managedBy: data.managedBy || 'Shanta Asset Management Limited',
      address: data.address || 'The Glass House (Level 13), S.E (B) - 2, 38 GULSHAN AVENUE, DHAKA 1212',
      phone: data.phone || '+88-02-48810551-2',
      fax: data.fax || '+88-02-48810553',
    });

    // Fill up investor info box
    await InvestmentCertificatePdfUtils.fillUpInvestorInfoBox(page, font, boldFont, {
      date: data.date,
      registrationNo: data.registrationNo,
      boAccountNo: data.boAccountNo,
      name: data.name,
      address: data.investorAddress,
    });

    // Fill up certificate title
    await InvestmentCertificatePdfUtils.fillUpCertificateTitle(page, boldFont);

    // Fill up certificate text
    await InvestmentCertificatePdfUtils.fillUpCertificateText(page, font, boldFont, {
      name: data.name,
      fundName: data.fundName,
    });

    // Fill up investment period
    await InvestmentCertificatePdfUtils.fillUpInvestmentPeriod(page, font, boldFont, {
      startDate: data.startDate,
      endDate: data.endDate,
    });

    // Fill up investment table
    await InvestmentCertificatePdfUtils.fillUpInvestmentTable(page, font, boldFont, {
      openingBalance: data.openingBalance,
      closingBalance: data.closingBalance,
      investmentDuringYear: data.investmentDuringYear,
      redemptionDuringYear: data.redemptionDuringYear,
      costValueSecurities: data.costValueSecurities,
      marketValueSecurities: data.marketValueSecurities,
      realizedGainLoss: data.realizedGainLoss,
      unrealizedGainLoss: data.unrealizedGainLoss,
      dividendIncome: data.dividendIncome,
      taxDeductedDividend: data.taxDeductedDividend,
    });

    // Fill up footer note
    await InvestmentCertificatePdfUtils.fillUpFooterNote(page, font);

    // Fill up signature section
    await InvestmentCertificatePdfUtils.fillUpSignatureSection(page, font, boldFont, {
      fundName: data.fundName,
    });

    return Buffer.from(await pdfDoc.save());
  }
}

module.exports = InvestmentCertificateService;
