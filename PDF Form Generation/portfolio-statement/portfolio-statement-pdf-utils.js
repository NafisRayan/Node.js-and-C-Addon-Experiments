const path = require('path');
const { rgb } = require('pdf-lib');
const { PdfCommonUtils } = require('../pdf-common-utils');

const fillUpHeaderInfo = async (pdfDoc, page, font, boldFont, data) => {
  // Add logo - reduced height, increased width slightly, moved higher
  await PdfCommonUtils.embedAndDrawImage(
    pdfDoc,
    page,
    path.join(__dirname, '../saml_logo.png'),
    45,
    783,
    110,
    24,
    'Logo image must be a JPEG or PNG image',
  );

  // Fund name (bold, centered) - slightly smaller font (15), moved higher and more left
  const fundNameWidth = boldFont.widthOfTextAtSize(data.fundName.toUpperCase(), 15);
  const leftShift = 155; // More left from 160
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.fundName.toUpperCase(),
    x: leftShift + (page.getWidth() - leftShift - 50 - fundNameWidth) / 2,
    y: 805,
    size: 15,
    xAlign: 'left',
  });

  // Registered under - 30% bigger font (7 * 1.3 = 9.1) - more space
  const registeredText = `Registered under the ${data.registeredUnder}`;
  const registeredWidth = font.widthOfTextAtSize(registeredText, 9.1);
  PdfCommonUtils.writeText(page, font, {
    text: registeredText,
    x: leftShift + (page.getWidth() - leftShift - 50 - registeredWidth) / 2,
    y: 787,
    size: 9.1,
    xAlign: 'left',
  });

  // Managed by (bold) - 30% bigger font (7.5 * 1.3 = 9.75) - more space
  const managedByText = `Managed by ${data.managedBy}`;
  const managedByWidth = boldFont.widthOfTextAtSize(managedByText, 9.75);
  PdfCommonUtils.writeText(page, boldFont, {
    text: managedByText,
    x: leftShift + (page.getWidth() - leftShift - 50 - managedByWidth) / 2,
    y: 774,
    size: 9.75,
    xAlign: 'left',
  });

  // Address - 30% bigger font (6.5 * 1.3 = 8.45) - more space
  const addressText = `Address: ${data.address}`;
  const addressWidth = font.widthOfTextAtSize(addressText, 8.45);
  PdfCommonUtils.writeText(page, font, {
    text: addressText,
    x: leftShift + (page.getWidth() - leftShift - 50 - addressWidth) / 2,
    y: 761,
    size: 8.45,
    xAlign: 'left',
  });

  // Phone and Fax - 30% bigger font (6.5 * 1.3 = 8.45) - more space
  const phoneText = `Phone: ${data.phone}, Fax: ${data.fax}`;
  const phoneWidth = font.widthOfTextAtSize(phoneText, 8.45);
  PdfCommonUtils.writeText(page, font, {
    text: phoneText,
    x: leftShift + (page.getWidth() - leftShift - 50 - phoneWidth) / 2,
    y: 749,
    size: 8.45,
    xAlign: 'left',
  });

  // Draw horizontal line - 30% bigger (5.1 * 1.3 = 6.63)
  page.drawLine({
    start: { x: 45, y: 728 },
    end: { x: 550, y: 728 },
    thickness: 6.63,
    color: rgb(142 / 255, 138 / 255, 40 / 255), // rgb(142, 138, 40)
  });

  // Investment Statement title (bold, centered) - 10% bigger font (12 * 1.1 = 13.2)
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Investment Statement',
    x: 0,
    y: 695,
    size: 13.2,
    xAlign: 'center',
  });

  // Statement date (centered) - 10% bigger font (8 * 1.1 = 8.8)
  PdfCommonUtils.writeText(page, font, {
    text: `(As On ${data.statementDate})`,
    x: 0,
    y: 680,
    size: 8.8,
    xAlign: 'center',
  });
};

const fillUpInvestorInfo = (page, font, boldFont, data) => {
  const startY = 654; // Moved up by 1.5 lines (635 + 13*1.5 = 654.5 ≈ 654)

  // Investor's Name (bold label and value) - 10% bigger font (8 * 1.1 = 8.8)
  PdfCommonUtils.writeText(page, boldFont, {
    text: "Investor's Name : ",
    x: 45,
    y: startY,
    size: 8.8,
    xAlign: 'left',
  });

  const labelWidth = boldFont.widthOfTextAtSize("Investor's Name : ", 8.8);
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.investorName,
    x: 45 + labelWidth,
    y: startY,
    size: 8.8,
    xAlign: 'left',
  });

  // Registration No (bold label and value) - 10% bigger font (8 * 1.1 = 8.8)
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Registration No : ',
    x: 45,
    y: startY - 13,
    size: 8.8,
    xAlign: 'left',
  });

  const regLabelWidth = boldFont.widthOfTextAtSize('Registration No : ', 8.8);
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.registrationNo,
    x: 45 + regLabelWidth,
    y: startY - 13,
    size: 8.8,
    xAlign: 'left',
  });
};

const fillUpInvestmentTable = (page, font, boldFont, data) => {
  const tableX = 45;
  const tableY = 620; // Positioned lower
  const labelColumnWidth = 410;
  const valueColumnWidth = 100;
  const rowHeight = 24; // 20% bigger (20 * 1.2 = 24)

  // Table data rows
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

  // Draw table with right-aligned values
  rows.forEach((row, index) => {
    const currentY = tableY - (index * rowHeight);
    
    // Draw row border
    page.drawRectangle({
      x: tableX,
      y: currentY - rowHeight,
      width: labelColumnWidth + valueColumnWidth,
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.5,
    });
    
    // Draw vertical separator
    page.drawLine({
      start: { x: tableX + labelColumnWidth, y: currentY },
      end: { x: tableX + labelColumnWidth, y: currentY - rowHeight },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });
    
    // Draw horizontal separator (except for last row)
    if (index < rows.length - 1) {
      page.drawLine({
        start: { x: tableX, y: currentY - rowHeight },
        end: { x: tableX + labelColumnWidth + valueColumnWidth, y: currentY - rowHeight },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });
    }
    
    // Draw label (left-aligned) - 20% bigger font (8 * 1.2 = 9.6), centered vertically
    const cellFont = row.bold ? boldFont : font;
    const fontSize = 9.6;
    // Center text vertically in cell
    const textY = currentY - rowHeight / 2 - fontSize / 2;
    page.drawText(row.label, {
      x: tableX + 4,
      y: textY,
      size: fontSize,
      font: cellFont,
      color: rgb(0, 0, 0),
    });
    
    // Draw value (right-aligned) - 20% bigger font (8 * 1.2 = 9.6), centered vertically
    const valueWidth = cellFont.widthOfTextAtSize(row.value, fontSize);
    page.drawText(row.value, {
      x: tableX + labelColumnWidth + valueColumnWidth - valueWidth - 4,
      y: textY,
      size: fontSize,
      font: cellFont,
      color: rgb(0, 0, 0),
    });
  });
  
  // Return the end Y position of the table
  return tableY - (rows.length * rowHeight);
};

const fillUpFooterNote = (page, font, boldFont, tableEndY) => {
  // Gap reduced by 20%: 32 * 0.8 = 25.6
  const footerY = tableEndY - 25.6;

  // Font 20% bigger: 9.1 * 1.2 = 10.92
  const fontSize = 10.92;

  // Red asterisk
  PdfCommonUtils.writeText(page, boldFont, {
    text: '*',
    x: 45,
    y: footerY,
    size: fontSize,
    color: rgb(1, 0, 0), // Red color
    xAlign: 'left',
  });

  // Rest of the text in black (bold)
  const asteriskWidth = boldFont.widthOfTextAtSize('*', fontSize);
  PdfCommonUtils.writeText(page, boldFont, {
    text: ' All amounts are in BDT, otherwise mentioned.',
    x: 45 + asteriskWidth,
    y: footerY,
    size: fontSize,
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
