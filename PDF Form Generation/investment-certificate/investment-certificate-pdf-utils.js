const path = require('path');
const { rgb } = require('pdf-lib');
const { PdfCommonUtils } = require('../pdf-common-utils');

const VERTICAL_OFFSET = 7; // Everything moves down 7 pixels
const CONTENT_GAP = 15; // Additional gap for content below header
const HEADER_GAP = 18; // 3 lines gap reduced by half (36 / 2 = 18)
const CERTIFICATE_SECTION_GAP = 36; // Move Investment Certificate section down 3 lines

const fillUpHeaderInfo = async (pdfDoc, page, font, boldFont, data) => {
  // Fund info vertical range: 800 to 742 = 58 pixels
  // Fund info center Y: (800 + 742) / 2 = 771
  const fundInfoCenterY = 771 - VERTICAL_OFFSET;

  // Logo height and position - center exactly at fund info center
  const logoHeight = 42;
  const logoY = fundInfoCenterY - logoHeight / 2;

  await PdfCommonUtils.embedAndDrawImage(
    pdfDoc,
    page,
    path.join(__dirname, '../saml_logo.png'),
    45,
    logoY,
    143,
    logoHeight,
    'Logo image must be a JPEG or PNG image',
  );

  // Fund info starts from a little right of logo end (45 + 143 + 10 = 198)
  const fundInfoStartX = 198;

  // Fund name (bold)
  const fundNameWidth = boldFont.widthOfTextAtSize(data.fundName, 18);
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.fundName,
    x: fundInfoStartX + (page.getWidth() - fundInfoStartX - 50 - fundNameWidth) / 2,
    y: 800 - VERTICAL_OFFSET,
    size: 18,
    xAlign: 'left',
  });

  // Registered under (smaller)
  const registeredText = `Registered under the ${data.registeredUnder}`;
  const registeredWidth = font.widthOfTextAtSize(registeredText, 8);
  PdfCommonUtils.writeText(page, font, {
    text: registeredText,
    x: fundInfoStartX + (page.getWidth() - fundInfoStartX - 50 - registeredWidth) / 2,
    y: 782 - VERTICAL_OFFSET,
    size: 8,
    xAlign: 'left',
  });

  // Managed by (bold)
  const managedByText = `Managed By ${data.managedBy}`;
  const managedByWidth = boldFont.widthOfTextAtSize(managedByText, 10);
  PdfCommonUtils.writeText(page, boldFont, {
    text: managedByText,
    x: fundInfoStartX + (page.getWidth() - fundInfoStartX - 50 - managedByWidth) / 2,
    y: 768 - VERTICAL_OFFSET,
    size: 10,
    xAlign: 'left',
  });

  // Address
  const addressWidth = font.widthOfTextAtSize(`Address: ${data.address}`, 8);
  PdfCommonUtils.writeText(page, font, {
    text: `Address: ${data.address}`,
    x: fundInfoStartX + (page.getWidth() - fundInfoStartX - 50 - addressWidth) / 2,
    y: 754 - VERTICAL_OFFSET,
    size: 8,
    xAlign: 'left',
  });

  // Phone and Fax
  const phoneText = `Phone: ${data.phone}, Fax: ${data.fax}`;
  const phoneWidth = font.widthOfTextAtSize(phoneText, 8);
  PdfCommonUtils.writeText(page, font, {
    text: phoneText,
    x: fundInfoStartX + (page.getWidth() - fundInfoStartX - 50 - phoneWidth) / 2,
    y: 742 - VERTICAL_OFFSET,
    size: 8,
    xAlign: 'left',
  });

  // Draw horizontal line (olive/gold color) - with 3 lines gap after
  page.drawLine({
    start: { x: 45, y: 730 - VERTICAL_OFFSET - HEADER_GAP },
    end: { x: 550, y: 730 - VERTICAL_OFFSET - HEADER_GAP },
    thickness: 6,
    color: rgb(142 / 255, 138 / 255, 40 / 255),
  });
};

const fillUpInvestorInfoBox = (page, font, boldFont, data) => {
  const boxX = 50;
  const moveUp = 36; // Move up 3 lines (12pt * 3 = 36)
  const boxY = 710 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP + moveUp;
  const boxWidth = 495;
  const boxHeight = 100; // Increased to add more gap at bottom

  // Reduce gap between colored rectangles by 1/3
  const reducedGap = CERTIFICATE_SECTION_GAP * (2 / 3); // Reduce by 1/3 means keep 2/3

  // Draw box with olive/gold border
  page.drawRectangle({
    x: boxX,
    y: boxY - boxHeight - reducedGap,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(142 / 255, 138 / 255, 40 / 255),
    borderWidth: 2,
  });

  let currentY = boxY - 20 - reducedGap;
  const lineHeight = 16;

  // Date - all bold
  PdfCommonUtils.writeText(page, boldFont, {
    text: `Date: ${data.date}`,
    x: boxX + 10,
    y: currentY,
    size: 10,
    xAlign: 'left',
  });

  currentY -= lineHeight;

  // Registration No - all bold
  PdfCommonUtils.writeText(page, boldFont, {
    text: `Registration No.: ${data.registrationNo}`,
    x: boxX + 10,
    y: currentY,
    size: 10,
    xAlign: 'left',
  });

  currentY -= lineHeight;

  // BO Account No - all bold
  PdfCommonUtils.writeText(page, boldFont, {
    text: `BO Account No.: ${data.boAccountNo}`,
    x: boxX + 10,
    y: currentY,
    size: 10,
    xAlign: 'left',
  });

  currentY -= lineHeight;

  // Name - all bold
  PdfCommonUtils.writeText(page, boldFont, {
    text: `Name: ${data.name}`,
    x: boxX + 10,
    y: currentY,
    size: 10,
    xAlign: 'left',
  });

  currentY -= lineHeight;

  // Address - all bold
  PdfCommonUtils.writeText(page, boldFont, {
    text: `Address: ${data.address}`,
    x: boxX + 10,
    y: currentY,
    size: 10,
    xAlign: 'left',
  });
};

const fillUpCertificateTitle = (page, boldFont) => {
  // 35% smaller font (16 * 0.65 = 10.4)
  const fontSize = 10.4;
  const titleText = 'Investment Certificate';
  const titleTextWidth = boldFont.widthOfTextAtSize(titleText, fontSize);

  // Width reduced by half, 20% more height
  const titleWidth = (titleTextWidth + 40) * 3 / 2; // Reduced by half
  const titleHeight = 28 * 1.2; // 20% more height = 33.6
  const titleX = page.getWidth() / 2;
  const reducedBoxGap = 12; // Reduced gap under investor info box
  const moveUp = 12; // Move up 1 line
  const titleY = 595 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap + moveUp;

  // Draw rounded rectangle
  const radius = 10; // Corner radius
  const x = titleX - titleWidth / 2;
  const y = titleY - titleHeight / 2;
  
  // Draw main rectangle (pdf-lib doesn't support rounded corners natively)
  const borderColor = rgb(142 / 255, 138 / 255, 40 / 255);
  const borderWidth = 2;
  
  page.drawRectangle({
    x: x,
    y: y,
    width: titleWidth,
    height: titleHeight,
    borderColor: borderColor,
    borderWidth: borderWidth,
  });

  // Center the text in the rectangle
  PdfCommonUtils.writeText(page, boldFont, {
    text: titleText,
    x: (page.getWidth() - titleTextWidth) / 2,
    y: titleY - fontSize / 2,
    size: fontSize,
    xAlign: 'left',
  });
};

const fillUpCertificateText = (page, font, boldFont, data) => {
  const reducedBoxGap = 12; // Reduced gap under investor info box
  const startY = 550 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap;
  const maxWidth = 500;

  // Full text with name in bold - aligned left
  const fullText = `This is to certify that ${data.name} is a registered unit-holder of ${data.fundName}. His/Her detailed information is provided below:`;

  // Use multi-line text with left alignment
  PdfCommonUtils.writeMultiLineText(page, font, {
    text: fullText,
    x: 50,
    y: startY,
    maxWidth: maxWidth,
    size: 10,
    align: 'left',
  });
};

const fillUpInvestmentPeriod = (page, font, boldFont, data) => {
  const reducedBoxGap = 12; // Reduced gap under investor info box
  const periodText = `Investment Period: ${data.startDate} to ${data.endDate}`;
  PdfCommonUtils.writeText(page, boldFont, {
    text: periodText,
    x: 50,
    y: 505 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap,
    size: 10,
    xAlign: 'left',
  });
};

const fillUpInvestmentTable = (page, font, boldFont, data) => {
  const tableX = 50;
  const reducedBoxGap = 12; // Reduced gap under investor info box
  const tableY = 485 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap;
  const leftColumnWidth = 270;
  const rightColumnWidth = 225;
  const rowHeight = 22 * 1.2; // 20% larger (22 * 1.2 = 26.4)

  const rows = [
    { left: `Opening Investment Balance: ${data.openingBalance}`, right: `Closing Investment Balance: ${data.closingBalance}` },
    { left: `Investment During this Year: ${data.investmentDuringYear}`, right: `Redemption During this Year: ${data.redemptionDuringYear}` },
    { left: `Cost Value of Securities: ${data.costValueSecurities}`, right: `Market value of Securities: ${data.marketValueSecurities}` },
    { left: `Realized Gain/ Loss: ${data.realizedGainLoss}`, right: `Unrealized Gain/ Loss: ${data.unrealizedGainLoss}` },
    { left: `Dividend Income: ${data.dividendIncome}`, right: `Tax Deducted on Dividend: ${data.taxDeductedDividend}` },
  ];

  rows.forEach((row, index) => {
    const currentY = tableY - (index * rowHeight);

    // Draw row border
    page.drawRectangle({
      x: tableX,
      y: currentY - rowHeight,
      width: leftColumnWidth + rightColumnWidth,
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.5,
    });

    // Draw vertical separator
    page.drawLine({
      start: { x: tableX + leftColumnWidth, y: currentY },
      end: { x: tableX + leftColumnWidth, y: currentY - rowHeight },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });

    // Draw horizontal separator (except for last row)
    if (index < rows.length - 1) {
      page.drawLine({
        start: { x: tableX, y: currentY - rowHeight },
        end: { x: tableX + leftColumnWidth + rightColumnWidth, y: currentY - rowHeight },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });
    }

    // Draw left cell text - 20% larger font (9 * 1.2 = 10.8)
    const fontSize = 10.8;
    const textY = currentY - rowHeight / 2 - fontSize / 2;
    page.drawText(row.left, {
      x: tableX + 5,
      y: textY,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Draw right cell text - 20% larger font
    page.drawText(row.right, {
      x: tableX + leftColumnWidth + 5,
      y: textY,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  });
};

const fillUpFooterNote = (page, font) => {
  const reducedBoxGap = 12; // Reduced gap under investor info box
  const moveDown = 10; // Move down a little
  const fontSize = 9 * 0.8; // 20% smaller (9 * 0.8 = 7.2)
  
  PdfCommonUtils.writeText(page, font, {
    text: '(All figures in Bangladeshi Taka)',
    x: 50,
    y: 355 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap - moveDown,
    size: fontSize,
    xAlign: 'left',
  });
};

const fillUpSignatureSection = (page, font, boldFont, data) => {
  const reducedBoxGap = 12; // Reduced gap under investor info box
  const moveDown = 10; // Move down a little
  const fontSize = 10 * 0.8; // 20% smaller (10 * 0.8 = 8)
  const startY = 330 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap - moveDown;

  PdfCommonUtils.writeText(page, boldFont, {
    text: 'For & on behalf of',
    x: 50,
    y: startY,
    size: fontSize,
    xAlign: 'left',
  });

  PdfCommonUtils.writeText(page, boldFont, {
    text: data.fundName,
    x: 50,
    y: startY - 12,
    size: fontSize,
    xAlign: 'left',
  });

  // Signature placeholder
  PdfCommonUtils.writeText(page, font, {
    text: '___________________',
    x: 50,
    y: 220 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap - moveDown,
    size: fontSize,
    xAlign: 'left',
  });

  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Authorized Signature',
    x: 50,
    y: 205 - VERTICAL_OFFSET - CONTENT_GAP - HEADER_GAP - CERTIFICATE_SECTION_GAP + reducedBoxGap - moveDown,
    size: fontSize,
    xAlign: 'left',
  });
};

const InvestmentCertificatePdfUtils = {
  fillUpHeaderInfo,
  fillUpInvestorInfoBox,
  fillUpCertificateTitle,
  fillUpCertificateText,
  fillUpInvestmentPeriod,
  fillUpInvestmentTable,
  fillUpFooterNote,
  fillUpSignatureSection,
};

module.exports = { InvestmentCertificatePdfUtils };
