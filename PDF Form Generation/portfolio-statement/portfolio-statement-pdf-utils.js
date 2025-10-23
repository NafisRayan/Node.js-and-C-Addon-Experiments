const path = require('path');
const { rgb } = require('pdf-lib');
const { PdfCommonUtils } = require('../pdf-common-utils');

const fillUpHeaderInfo = async (pdfDoc, page, font, boldFont, data) => {
  // Add logo
  await PdfCommonUtils.embedAndDrawImage(
    pdfDoc,
    page,
    path.join(__dirname, '../saml_logo.png'),
    50,
    765,
    120,
    35,
    'Logo image must be a JPEG or PNG image',
  );

  // Fund name (large, bold, centered) - positioned right to avoid logo overlap
  const fundNameWidth = boldFont.widthOfTextAtSize(data.fundName.toUpperCase(), 16);
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.fundName.toUpperCase(),
    x: 180 + (page.getWidth() - 180 - 50 - fundNameWidth) / 2,
    y: 785,
    size: 16,
    xAlign: 'left',
  });

  // Registered under - centered in available space
  const registeredText = `Registered under the ${data.registeredUnder}`;
  const registeredWidth = font.widthOfTextAtSize(registeredText, 8.5);
  PdfCommonUtils.writeText(page, font, {
    text: registeredText,
    x: 180 + (page.getWidth() - 180 - 50 - registeredWidth) / 2,
    y: 768,
    size: 8.5,
    xAlign: 'left',
  });

  // Managed by (bold) - centered in available space
  const managedByText = `Managed by ${data.managedBy}`;
  const managedByWidth = boldFont.widthOfTextAtSize(managedByText, 9);
  PdfCommonUtils.writeText(page, boldFont, {
    text: managedByText,
    x: 180 + (page.getWidth() - 180 - 50 - managedByWidth) / 2,
    y: 755,
    size: 9,
    xAlign: 'left',
  });

  // Address - centered in available space
  const addressText = `Address: ${data.address}`;
  const addressWidth = font.widthOfTextAtSize(addressText, 7.5);
  PdfCommonUtils.writeText(page, font, {
    text: addressText,
    x: 180 + (page.getWidth() - 180 - 50 - addressWidth) / 2,
    y: 742,
    size: 7.5,
    xAlign: 'left',
  });

  // Phone and Fax - centered in available space
  const phoneText = `Phone: ${data.phone}, Fax: ${data.fax}`;
  const phoneWidth = font.widthOfTextAtSize(phoneText, 7.5);
  PdfCommonUtils.writeText(page, font, {
    text: phoneText,
    x: 180 + (page.getWidth() - 180 - 50 - phoneWidth) / 2,
    y: 730,
    size: 7.5,
    xAlign: 'left',
  });

  // Draw horizontal line
  page.drawLine({
    start: { x: 50, y: 720 },
    end: { x: 545, y: 720 },
    thickness: 4.5, // 3x the original 1.5
    color: rgb(142 / 255, 138 / 255, 40 / 255), // rgb(142, 138, 40)
  });

  // Investment Statement title (bold, centered)
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Investment Statement',
    x: 0,
    y: 690,
    size: 14,
    xAlign: 'center',
  });

  // Statement date (centered)
  PdfCommonUtils.writeText(page, font, {
    text: `(As On ${data.statementDate})`,
    x: 0,
    y: 675,
    size: 9,
    xAlign: 'center',
  });
};

const fillUpInvestorInfo = (page, font, boldFont, data) => {
  const startY = 645;

  // Investor's Name (bold label and value)
  PdfCommonUtils.writeText(page, boldFont, {
    text: "Investor's Name : ",
    x: 50,
    y: startY,
    size: 9,
    xAlign: 'left',
  });

  const labelWidth = boldFont.widthOfTextAtSize("Investor's Name : ", 9);
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.investorName,
    x: 50 + labelWidth,
    y: startY,
    size: 9,
    xAlign: 'left',
  });

  // Registration No (bold label and value)
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Registration No : ',
    x: 50,
    y: startY - 15,
    size: 9,
    xAlign: 'left',
  });

  const regLabelWidth = boldFont.widthOfTextAtSize('Registration No : ', 9);
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.registrationNo,
    x: 50 + regLabelWidth,
    y: startY - 15,
    size: 9,
    xAlign: 'left',
  });
};

const fillUpInvestmentTable = (page, font, boldFont, data) => {
  const tableX = 50; // Aligned with other elements
  const tableY = 600;
  const labelColumnWidth = 395; // Increased to maintain same ending position
  const valueColumnWidth = 100;
  const rowHeight = 20;

  // Table data rows (removed bold from Total Deposit, Units Held, Total Capital Gain, Total Return)
  const rows = [
    { label: 'Fund Deposit', value: data.fundDeposit },
    { label: 'Dividend Reinvested', value: data.dividendReinvested },
    { label: 'Total Deposit', value: data.totalDeposit },
    { label: 'Total Withdrawal', value: data.totalWithdrawal },
    { label: 'Units Purchased (Nos)', value: data.unitsPurchased },
    { label: 'CIP Units (Nos)', value: data.cipUnits },
    { label: 'Units Surrender (Nos)', value: data.unitsSurrender },
    { label: 'Units Held (Nos)', value: data.unitsHeld },
    { label: 'Average Cost Price/Unit', value: data.averageCostPerUnit },
    { label: 'Investment at Cost', value: data.investmentAtCost },
    { label: `Current NAV (As On ${data.currentNavDate})`, value: data.currentNav },
    { label: 'Market Value of Investment', value: data.marketValue, bold: true },
    { label: 'Capital Gain (Realized) (a)', value: data.capitalGainRealized },
    { label: 'Capital Gain (Unrealized) (b)', value: data.capitalGainUnrealized },
    { label: 'Total Capital Gain (a+b)', value: data.totalCapitalGain },
    { label: 'Dividend Income (c)', value: data.dividendIncome },
    { label: 'Dividend Receivable (d)', value: data.dividendReceivable },
    { label: 'Total Return (a+b+c+d)', value: data.totalReturn },
    { label: 'Cash Balance', value: data.cashBalance },
  ];

  // Draw table
  PdfCommonUtils.drawTable(page, font, {
    rows: rows.map(row => ({
      cells: [
        { text: row.label, bold: row.bold },
        { text: row.value, bold: row.bold },
      ],
    })),
    x: tableX,
    y: tableY,
    rowHeight: rowHeight,
    columnWidths: [labelColumnWidth, valueColumnWidth],
    fontSize: 9,
    borderColor: [0, 0, 0],
    textColor: [0, 0, 0],
    boldFont: boldFont,
    padding: 5,
    showBorders: true,
    showVerticalBorders: true,
    showHorizontalBorders: true,
  });
};

const fillUpFooterNote = (page, font, boldFont) => {
  // Add gap before footer note
  const footerY = 195;

  // Red asterisk
  PdfCommonUtils.writeText(page, boldFont, {
    text: '*',
    x: 50,
    y: footerY,
    size: 8,
    color: rgb(1, 0, 0), // Red color
    xAlign: 'left',
  });

  // Rest of the text in black (bold)
  const asteriskWidth = boldFont.widthOfTextAtSize('*', 8);
  PdfCommonUtils.writeText(page, boldFont, {
    text: ' All amounts are in BDT, otherwise mentioned.',
    x: 50 + asteriskWidth,
    y: footerY,
    size: 8,
    xAlign: 'left',
  });
};

const PortfolioStatementPdfUtils = {
  fillUpHeaderInfo,
  fillUpInvestorInfo,
  fillUpInvestmentTable,
  fillUpFooterNote,
};

module.exports = { PortfolioStatementPdfUtils };
