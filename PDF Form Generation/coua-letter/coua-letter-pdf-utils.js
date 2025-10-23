const path = require('path');
const { StandardFonts } = require('pdf-lib');
const { PdfCommonUtils } = require('../pdf-common-utils');

const fillUpTopInfo = async (pdfDoc, page, font, data) => {
  // add logo
  await PdfCommonUtils.embedAndDrawImage(
    pdfDoc,
    page,
    path.join(__dirname, '../saml_logo.png'),
    43.67, // Move logo to left side
    765.92,
    142,
    36,
    'Logo image must be a JPEG or PNG image',
  );
  // add labels and values after the logo(labels(bold) on left with left alignment and values on right with right alignment): Date:, Investor ID No.:, Registration Number:, Unit Allocation No.:.
  // set font bold for labels and write the labels
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const startingY = 784;
  const yIncrement = 12;
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Date:',
    x: 300,
    y: startingY,
    size: 10.5,
  });
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Investor ID No.:',
    x: 300,
    y: startingY - yIncrement,
    size: 10.5,
  });
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Registration Number:',
    x: 300,
    y: startingY - 2 * yIncrement,
    size: 10.5,
  });
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Unit Allocation No.:',
    x: 300,
    y: startingY - 3 * yIncrement,
    size: 10.5,
  });

  // write the values
  PdfCommonUtils.writeText(page, font, {
    text: data.date,
    x: 556,
    y: startingY,
    size: 10.5,
    xAlign: 'right',
  });
  PdfCommonUtils.writeText(page, font, {
    text: data.investorId,
    x: 556,
    y: startingY - yIncrement,
    size: 10.5,
    xAlign: 'right',
  });
  PdfCommonUtils.writeText(page, font, {
    text: data.regNumber,
    x: 556,
    y: startingY - 2 * yIncrement,
    size: 10.5,
    xAlign: 'right',
  });
  PdfCommonUtils.writeText(page, font, {
    text: data.unitAllocationNo,
    x: 556,
    y: startingY - 3 * yIncrement,
    size: 10.5,
    xAlign: 'right',
  });

  // fund name as title
  PdfCommonUtils.writeText(page, boldFont, {
    text: data.fundName,
    x: 118,
    y: 706,
    size: 22,
    xAlign: 'center',
  });
  // fund information
  const startingYForFundInfo = 665;
  const yIncrementForFundInfo = 14.5;
  PdfCommonUtils.writeText(page, font, {
    text: `Registered under the ${data.registeredUnder}`,
    x: 118,
    y: startingYForFundInfo,
    size: 10.5,
    xAlign: 'center',
  });
  PdfCommonUtils.writeLabelAndValuePair(page, font, boldFont, {
    label: 'Registration No.:',
    value: data.fundRegNo,
    x: 118,
    y: startingYForFundInfo - yIncrementForFundInfo,
    labelSize: 10.5,
    valueSize: 10.5,
    gap: 10,
    xAlign: 'center',
  });
  PdfCommonUtils.writeLabelAndValuePair(page, font, boldFont, {
    label: 'Sponsor:',
    value: data.fundSponsor,
    x: 118,
    y: startingYForFundInfo - 2 * yIncrementForFundInfo,
    labelSize: 10.5,
    valueSize: 10.5,
    gap: 10,
    xAlign: 'center',
  });
  PdfCommonUtils.writeLabelAndValuePair(page, font, boldFont, {
    label: 'Asset Manager:',
    value: data.fundAssetManager,
    x: 118,
    y: startingYForFundInfo - 3 * yIncrementForFundInfo,
    labelSize: 10.5,
    valueSize: 10.5,
    gap: 10,
    xAlign: 'center',
  });
  PdfCommonUtils.writeLabelAndValuePair(page, font, boldFont, {
    label: 'Trustee:',
    value: data.fundTrustee,
    x: 118,
    y: startingYForFundInfo - 4 * yIncrementForFundInfo,
    labelSize: 10.5,
    valueSize: 10.5,
    gap: 10,
    xAlign: 'center',
  });
  PdfCommonUtils.writeLabelAndValuePair(page, font, boldFont, {
    label: 'Custodian:',
    value: data.fundCustodian,
    x: 118,
    y: startingYForFundInfo - 5 * yIncrementForFundInfo,
    labelSize: 10.5,
    valueSize: 10.5,
    gap: 10,
    xAlign: 'center',
  });

  //
};

const fillUpMiddleTableInfo = async (pdfDoc, page, font, data) => {
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  // add the title "CONFIRMATION OF UNIT ALLOCATION"
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'CONFIRMATION OF UNIT ALLOCATION',
    x: 45,
    y: 554,
    size: 16,
    xAlign: 'center',
  });
  // add description "This is to confirm that the investor has been allocated the following units:"
  PdfCommonUtils.writeMultiLineText(page, font, {
    text: `This is to certify that the following person is a registered unit-holder of ${data.fundName} and has been allocated units of the fund issued by Shanta Asset Management Limited under the authority  provided in the trust deed of ${data.fundName}. Following are the details of the allotment as on ${data.date}:`,
    x: 45,
    y: 522,
    size: 10.5,
    align: 'justify',
    maxWidth: page.getWidth() - 90,
  });
  // add the table with investor details
  PdfCommonUtils.drawTable(page, font, {
    rows: [
      {
        cells: [
          { text: "Investor's Name:", bold: true },
          { text: `${data.investorName}` },
        ],
      },
      {
        cells: [
          { text: 'Investor NID:', bold: true },
          { text: `${data.investorNid}` },
        ],
      },
      {
        cells: [
          { text: "Father's Name:", bold: true },
          { text: `${data.investorFatherName}` },
        ],
      },
      {
        cells: [
          { text: 'Number of Units:', bold: true },
          { text: `${data.numberOfUnits}` },
        ],
      },
      {
        cells: [
          { text: 'Average Buy Price (BDT):', bold: true },
          { text: `${data.averageBuyPrice}` },
        ],
      },
      {
        cells: [
          { text: 'Total Investment Value:', bold: true },
          { text: `${data.totalInvestmentValue}` },
        ],
      },
    ],
    x: 45,
    y: 460, // Position below the multi-line text
    rowHeight: 20,
    columnWidths: [200, 300], // [labelWidth, valueWidth]
    fontSize: 10,
    borderColor: [0, 0, 0], // Black borders
    textColor: [0, 0, 0], // Black text
    boldFont: boldFont, // Bold font for labels
  });
};

const fillUpBottomNoteInfo = async (pdfDoc, page, font, data) => {
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Note section title
  PdfCommonUtils.writeText(page, boldFont, {
    text: 'Note:',
    x: 45,
    y: 310,
    size: 7.5,
  });

  // Legal disclaimer paragraph (justified)
  PdfCommonUtils.writeMultiLineText(page, font, {
    text: `This Confirmation is a confidential and legal document of subscribing ${data.fundName}. This Confirmation singly would provide legal right to unit holding for the investors. Unauthorized use, disclosure or copying of this document is unlawful and strictly prohibited, and shall be treated with appropriate measures of law. This Confirmation will be void as and when any new "Confirmation of Unit Allocation" is issued to the same investor. As this is a system-generated certificate, it does not require any authorized signature.`,
    x: 45,
    y: 295,
    size: 7.5,
    align: 'justify',
    maxWidth: page.getWidth() - 90,
  });

  // Contact information with bold phone and email
  const contactText =
    'For any query or changes to your personal details, please contact us at for any assistance ';
  const phoneText = data.contactNumber;
  const emailPrefixText = ' or send email to ';
  const emailText = data.contactEmail;
  const atText = ' at';
  const restText = 'any time.';

  // Calculate widths for positioning
  const contactTextWidth = font.widthOfTextAtSize(contactText, 7.5);
  const phoneWidth = boldFont.widthOfTextAtSize(phoneText, 7.5);
  const emailPrefixWidth = font.widthOfTextAtSize(emailPrefixText, 7.5);
  const emailWidth = boldFont.widthOfTextAtSize(emailText, 7.5);
  const atWidth = font.widthOfTextAtSize(atText, 7.5);
  const restTextWidth = font.widthOfTextAtSize(restText, 7.5);

  // Check if text fits on one line
  const maxWidth = page.getWidth() - 90; // 50px margin on each side
  const lineHeight = 7.5 * 1.2; // Line height for multi-line text

  let currentX = 45;
  let currentY = 250;

  // Regular text: "For any query or changes to your personal details, please contact us at "
  PdfCommonUtils.writeText(page, font, {
    text: contactText,
    x: currentX,
    y: currentY,
    size: 7.5,
    xAlign: 'left',
  });
  currentX += contactTextWidth;

  // Bold phone number
  PdfCommonUtils.writeText(page, boldFont, {
    text: phoneText,
    x: currentX,
    y: currentY,
    size: 7.5,
    xAlign: 'left',
  });
  currentX += phoneWidth;

  // Regular text: " or send email to "
  PdfCommonUtils.writeText(page, font, {
    text: emailPrefixText,
    x: currentX,
    y: currentY,
    size: 7.5,
    xAlign: 'left',
  });
  currentX += emailPrefixWidth;

  // Bold email
  PdfCommonUtils.writeText(page, boldFont, {
    text: emailText,
    x: currentX,
    y: currentY,
    size: 7.5,
    xAlign: 'left',
  });
  currentX += emailWidth;

  // Regular text: " at"
  PdfCommonUtils.writeText(page, font, {
    text: atText,
    x: currentX,
    y: currentY,
    size: 7.5,
    xAlign: 'left',
  });
  currentX += atWidth;

  // Check if we need to break the line before the rest of the text
  if (currentX + restTextWidth > maxWidth) {
    // Move to next line
    currentX = 45;
    currentY -= lineHeight;
  }

  // Regular text: " for any assistance at any time."
  PdfCommonUtils.writeText(page, font, {
    text: restText,
    x: currentX,
    y: currentY,
    size: 7.5,
    xAlign: 'left',
  });
};

const CouaLetterPdfUtils = {
  fillUpTopInfo,
  fillUpMiddleTableInfo,
  fillUpBottomNoteInfo,
};

module.exports = { CouaLetterPdfUtils };
