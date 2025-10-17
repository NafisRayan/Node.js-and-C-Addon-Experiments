const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const sharp = require('sharp');

class PdfService {
  writeText(page, font, opts) {
    const { text, x, y, size = 8 } = opts;
    page.drawText(String(text), { x, y, size, font, color: rgb(0, 0, 0) });
  }

  async embedImageFromUrl(pdfDoc, url, errorMessage) {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    const arrayBuffer = await res.arrayBuffer();

    if (
      contentType?.toLowerCase().includes('jpeg') ||
      contentType?.toLowerCase().includes('jpg')
    ) {
      try {
        return await pdfDoc.embedJpg(arrayBuffer);
      } catch {
        const fixedBuffer = await sharp(arrayBuffer).jpeg().toBuffer();
        return await pdfDoc.embedJpg(fixedBuffer);
      }
    } else if (contentType?.toLowerCase().includes('png')) {
      try {
        return await pdfDoc.embedPng(arrayBuffer);
      } catch {
        const fixedBuffer = await sharp(arrayBuffer).png().toBuffer();
        return await pdfDoc.embedPng(fixedBuffer);
      }
    }
    throw new Error(errorMessage);
  }

  async generateInstitutionFormPdf(data) {
    const templatePath = path.join(
      __dirname,
      `templates/investor-forms/${data.templateName}-form.pdf`
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error('Institution registration form template not found');
    }

    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const page1 = pages[0];
    const page2 = pages[1];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const writeTextPage1 = (opts) => this.writeText(page1, font, opts);
    const writeTextPage2 = (opts) => this.writeText(page2, font, opts);

  // PAGE 1 - Institution Details (INSTITUTE VERSION)
  // Top section (added individual-style top fields + date/amounts)
    // top section: registration number, sale number, amount, bank info, unit price
    writeText({ text: data.registrationNumber, x: 524, y: 695, size: 7.5 });
    writeText({ text: data.saleNumber, x: 524, y: 683, size: 7.5 });
    writeText({ text: data.amount, x: 90, y: 633, size: 7.5 });
    writeText({ text: data.amountInWords, x: 270, y: 633, size: 7.5 });
    writeText({ text: data.chequeNumber, x: 120, y: 620, size: 7.5 });
    writeText({ text: data.bankName, x: 247, y: 620, size: 7.5 });
    writeText({ text: data.bankBranchName, x: 420, y: 620, size: 7.5 });
    writeText({ text: data.unitPrice, x: 120, y: 608, size: 7.5 });
    writeText({ text: data.units, x: 415, y: 608, size: 7.5 });

    // Registration / Top-right
    writeTextPage1({ text: data.registrationNumber, x: 527.11, y: 693.67, size: 7.5 });

    // Cheque / P.O. / D.D. information
    writeTextPage1({ text: data.chequeNumber, x: 120.44, y: 609.67, size: 7.5 });
    writeTextPage1({ text: data.chequeBank, x: 247.78, y: 609, size: 7.5 });
    writeTextPage1({ text: data.chequeBranch, x: 421.78, y: 609, size: 7.5 });

    // Type of institution (single value used; no multi-choice)
    writeTextPage1({ text: data.institutionType, x: 70, y: 179, size: 7.5 });

  // Institution details (positions updated per latest coordinates)
  // Name of the institution
  writeTextPage1({ text: data.institutionName, x: 107.56, y: 556.56, size: 7.5 });
  // Registration number with Shanta
  writeTextPage1({ text: data.institutionRegistrationNo, x: 28.22, y: 568.33, size: 7.5 });
  // Registration (other)
  writeTextPage1({ text: data.registrationLabel, x: 84.89, y: 526.33, size: 7.5 });
  // Address
  writeTextPage1({ text: data.institutionAddress, x: 60.22, y: 515.45, size: 7.5 });
  // Telephone
  writeTextPage1({ text: data.telephoneNo, x: 80.22, y: 501.67, size: 7.5 });
  // Fax
  writeTextPage1({ text: data.faxNo, x: 246.22, y: 502.11, size: 7.5 });
  // Email
  writeTextPage1({ text: data.email, x: 406.89, y: 503, size: 7.5 });
  // Bank Name
  writeTextPage1({ text: data.bankName, x: 45.56, y: 490.33, size: 7.5 });
  // Bank Branch
  writeTextPage1({ text: data.bankBranch, x: 318.22, y: 490.33, size: 7.5 });
  // Account number
  writeTextPage1({ text: data.accountNumber, x: 58.89, y: 478.11, size: 7.5 });
  // Bank routing number
  writeTextPage1({ text: data.bankRoutingNo, x: 337.56, y: 477.45, size: 7.5 });
  // BO number
  writeTextPage1({ text: data.boAccount, x: 58.89, y: 466.33, size: 7.5 });
  // ETIN
  writeTextPage1({ text: data.etin, x: 310.22, y: 465.67, size: 7.5 });

  // Managing Director/CEO details (position updated)
  writeTextPage1({ text: data.managingDirectorName, x: 219.56, y: 433, size: 7.5 });

  // Add Managing Director/CEO photo
  if (data.managingDirectorPhotoUrl) {
      const mdPhotoImage = await this.embedImageFromUrl(
        pdfDoc,
        data.managingDirectorPhotoUrl,
        'Managing Director photo must be a JPEG or PNG image'
      );

      page1.drawImage(mdPhotoImage, {
        x: 60,
        y: 360,
        width: 100,
        height: 120,
      });
    }

  // Authorized persons (positions updated)
  writeTextPage1({ text: data.authorizedPerson1Name, x: 73.56, y: 385.67, size: 7.5 });
  writeTextPage1({ text: data.authorizedPerson1Designation, x: 249.56, y: 385.45, size: 7.5 });
  writeTextPage1({ text: data.authorizedPerson2Name, x: 74.44, y: 355, size: 7.5 });
  writeTextPage1({ text: data.authorizedPerson2Designation, x: 249.78, y: 353.89, size: 7.5 });

  // Date of application
  writeTextPage1({ text: data.applicationDate, x: 97.56, y: 33.89, size: 7.5 });

  // Add Authorized Person 1 signature
    if (data.authorizedPerson1SignatureUrl) {
      const auth1SigImage = await this.embedImageFromUrl(
        pdfDoc,
        data.authorizedPerson1SignatureUrl,
        'Authorized Person 1 signature must be a JPEG or PNG image'
      );

      page1.drawImage(auth1SigImage, {
        x: 240,
        y: 380,
        width: 80,
        height: 30,
      });
    }

    // Add Authorized Person 2 signature
    if (data.authorizedPerson2SignatureUrl) {
      const auth2SigImage = await this.embedImageFromUrl(
        pdfDoc,
        data.authorizedPerson2SignatureUrl,
        'Authorized Person 2 signature must be a JPEG or PNG image'
      );

      page1.drawImage(auth2SigImage, {
        x: 360,
        y: 380,
        width: 80,
        height: 30,
      });
    }

    // PAGE 2 - FOR OFFICIAL USE ONLY
    writeTextPage2({ text: data.registrationNo, x: 104, y: 381, size: 7.5 });
    writeTextPage2({ text: data.saleNo, x: 360, y: 380, size: 7.5 });
    writeTextPage2({ text: data.date, x: 64, y: 365, size: 7.5 });
    writeTextPage2({ text: data.unitAllocationConfirmation, x: 386, y: 365, size: 7.5 });
    writeTextPage2({ text: data.noOfUnits, x: 88, y: 349, size: 7.5 });

    return Buffer.from(await pdfDoc.save());
  }
}

module.exports = PdfService;
