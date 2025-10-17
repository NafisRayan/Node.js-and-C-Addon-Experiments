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

  async generateInvestorFormPdf(data) {
    const templatePath = path.join(
      __dirname,
      `templates/investor-forms/${data.templateName}-form.pdf`
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error('Investor registration form template not found');
    }

    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page1 = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const writeText = (opts) => this.writeText(page1, font, opts);

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

    // Principal Applicant section
    writeText({ text: data.registrationNumber, x: 188, y: 566, size: 7.5 });
    writeText({ text: data.investorName, x: 50, y: 553, size: 7.5 });
    writeText({ text: data.fatherName, x: 80, y: 540, size: 7.5 });
    writeText({ text: data.motherName, x: 85, y: 528.5, size: 7.5 });
    writeText({ text: data.spouseName, x: 85, y: 517, size: 7.5 });
    writeText({ text: data.dob, x: 75, y: 505, size: 7.5 });
    writeText({ text: data.occupation, x: 261, y: 505, size: 7.5 });
    writeText({ text: data.nationality, x: 68, y: 492, size: 7.5 });
    writeText({ text: data.nid, x: 267, y: 492, size: 7.5 });
    writeText({ text: data.presentAddress, x: 88, y: 480, size: 7.5 });
    writeText({ text: data.permanentAddress, x: 100, y: 467, size: 7.5 });
    writeText({ text: data.boAccount, x: 60, y: 456, size: 7.5 });
    writeText({ text: data.mobile, x: 265, y: 456, size: 7.5 });
    writeText({ text: data.email, x: 50, y: 444, size: 7.5 });
    writeText({ text: data.investorBankName, x: 240, y: 444, size: 7.5 });
    writeText({ text: data.investorBankBranchName, x: 53, y: 432, size: 7.5 });
    writeText({ text: data.investorBankAccountNumber, x: 248, y: 432, size: 7.5 });
    writeText({ text: data.investorBankRoutingNumber, x: 87, y: 419, size: 7.5 });
    writeText({ text: data.etin, x: 260, y: 419, size: 7.5 });

    // add investor photo
    if (data.investorPhotoUrl) {
      const investorPhotoImage = await this.embedImageFromUrl(
        pdfDoc,
        data.investorPhotoUrl,
        'Investor photo image must be a JPEG or PNG image'
      );

      page1.drawImage(investorPhotoImage, {
        x: 439,
        y: 440,
        width: 107,
        height: 105,
      });
    }

    // add investor signature
    if (data.investorSignatureUrl) {
      const investorSignatureImage = await this.embedImageFromUrl(
        pdfDoc,
        data.investorSignatureUrl,
        'Investor signature image must be a JPEG or PNG image'
      );

      page1.drawImage(investorSignatureImage, {
        x: 60,
        y: 60,
        width: 80,
        height: 30,
      });
    }

    // Joint Applicant section (using provided coordinates)
    writeText({ text: data.jointInvestorName, x: 50, y: 356, size: 7.5 });
    writeText({ text: data.jointFatherName, x: 78, y: 344, size: 7.5 });
    writeText({ text: data.jointMotherName, x: 84, y: 332, size: 7.5 });
    writeText({ text: data.jointSpouseName, x: 84, y: 320, size: 7.5 });
    writeText({ text: data.jointDob, x: 74, y: 307, size: 7.5 });
    writeText({ text: data.jointOccupation, x: 262, y: 308, size: 7.5 });
    writeText({ text: data.jointNationality, x: 68, y: 296, size: 7.5 });
    writeText({ text: data.jointNid, x: 260, y: 296, size: 7.5 });
    writeText({ text: data.jointPresentAddress, x: 86, y: 283, size: 7.5 });
    writeText({ text: data.jointPermanentAddress, x: 98, y: 271, size: 7.5 });
    writeText({ text: data.jointMobile, x: 104, y: 258, size: 7.5 });
    writeText({ text: data.jointEmail, x: 266, y: 259, size: 7.5 });

    // add joint applicant photo
    if (data.jointPhotoUrl) {
      const jointPhotoImage = await this.embedImageFromUrl(
        pdfDoc,
        data.jointPhotoUrl,
        'Joint applicant photo image must be a JPEG or PNG image'
      );

      page1.drawImage(jointPhotoImage, {
        x: 439,
        y: 270,
        width: 107,
        height: 105,
      });
    }

    // add joint applicant signature
    if (data.jointSignatureUrl) {
      const jointSignatureImage = await this.embedImageFromUrl(
        pdfDoc,
        data.jointSignatureUrl,
        'Joint applicant signature image must be a JPEG or PNG image'
      );

      page1.drawImage(jointSignatureImage, {
        x: 200,
        y: 60,
        width: 80,
        height: 30,
      });
    }

    // Nominee section (using coordinates from Nominee.json)
    writeText({ text: data.nomineeName, x: 52, y: 226, size: 7.5 });
    writeText({ text: data.nomineeFatherName, x: 82, y: 213, size: 7.5 });
    writeText({ text: data.nomineeMotherName, x: 85, y: 201, size: 7.5 });
    writeText({ text: data.nomineeSpouseName, x: 86, y: 190, size: 7.5 });
    writeText({ text: data.nomineeDob, x: 78, y: 176, size: 7.5 });
    writeText({ text: data.nomineeOccupation, x: 264, y: 176, size: 7.5 });
    writeText({ text: data.nomineeNationality, x: 70, y: 165, size: 7.5 });
    writeText({ text: data.nomineeNid, x: 264, y: 164, size: 7.5 });
    writeText({ text: data.nomineePresentAddress, x: 90, y: 153, size: 7.5 });
    writeText({ text: data.nomineePermanentAddress, x: 102, y: 140, size: 7.5 });
    writeText({ text: data.nomineeMobile, x: 106, y: 128, size: 7.5 });
    writeText({ text: data.nomineeEmail, x: 269, y: 128, size: 7.5 });

    // add nominee photo
    if (data.nomineePhotoUrl) {
      const nomineePhotoImage = await this.embedImageFromUrl(
        pdfDoc,
        data.nomineePhotoUrl,
        'Nominee photo image must be a JPEG or PNG image'
      );

      page1.drawImage(nomineePhotoImage, {
        x: 439,
        y: 130,
        width: 107,
        height: 105,
      });
    }

    // add nominee signature
    if (data.nomineeSignatureUrl) {
      const nomineeSignatureImage = await this.embedImageFromUrl(
        pdfDoc,
        data.nomineeSignatureUrl,
        'Nominee signature image must be a JPEG or PNG image'
      );

      page1.drawImage(nomineeSignatureImage, {
        x: 340,
        y: 60,
        width: 80,
        height: 30,
      });
    }

    return Buffer.from(await pdfDoc.save());
  }
}

module.exports = PdfService;
