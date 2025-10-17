const fs = require('fs');
const path = require('path');
const PdfService = require('./SASF-Individual-form');

// Sample data for testing
const sampleData = {
  templateName: 'SASF-Individual',
  registrationNumber: 'REG-001',
  saleNumber: 'SALE-001',
  amount: '50000',
  amountInWords: 'Fifty Thousand Only',
  chequeNumber: 'CHQ-123456',
  bankName: 'Example Bank',
  bankBranchName: 'Main Branch',
  units: '100',
  unitPrice: '500',
  investorName: 'John Doe',
  fatherName: 'Robert Doe',
  motherName: 'Jane Doe',
  spouseName: 'Mary Doe',
  dob: '01/01/1990',
  occupation: 'Business',
  nationality: 'Bangladeshi',
  nid: '1234567890',
  presentAddress: '123 Main Street, Dhaka',
  permanentAddress: '456 Home Road, Dhaka',
  boAccount: 'BO-1234567',
  mobile: '+880 1711-123456',
  email: 'john.doe@example.com',
  investorBankName: 'Example Bank',
  investorBankBranchName: 'Dhaka Branch',
  investorBankAccountNumber: '1234567890123',
  investorBankRoutingNumber: '123456789',
  etin: 'ETIN-123456',
  residencyStatus: 'Resident',
  dividendOption: 'Cash',
  investmentOption: 'Long Term',
  investorPhotoUrl: '', // Leave empty if no photo
  investorSignatureUrl: '', // Leave empty if no signature
  // Joint Applicant Information
  jointInvestorName: 'Sarah Smith',
  jointFatherName: 'Michael Smith',
  jointMotherName: 'Elizabeth Smith',
  jointSpouseName: 'John Doe',
  jointDob: '15/05/1992',
  jointOccupation: 'Teacher',
  jointNationality: 'Bangladeshi',
  jointNid: '9876543210',
  jointPresentAddress: '789 Park Avenue, Dhaka',
  jointPermanentAddress: '321 Garden Road, Dhaka',
  jointMobile: '+880 1711-654321',
  jointEmail: 'sarah.smith@example.com',
  jointPhotoUrl: '',
  jointSignatureUrl: '',
  // Nominee Information
  nomineeName: 'Emma Doe',
  nomineeFatherName: 'John Doe',
  nomineeMotherName: 'Mary Doe',
  nomineeSpouseName: 'N/A',
  nomineeDob: '10/08/2015',
  nomineeOccupation: 'Student',
  nomineeNationality: 'Bangladeshi',
  nomineeNid: 'N/A',
  nomineePresentAddress: '123 Main Street, Dhaka',
  nomineePermanentAddress: '456 Home Road, Dhaka',
  nomineeMobile: '+880 1711-111222',
  nomineeEmail: 'emma.doe@example.com',
  nomineePhotoUrl: '',
  nomineeSignatureUrl: '',
};

async function main() {
  try {
    console.log('Starting PDF Form Filling Application...');
    
    const pdfService = new PdfService();
    
    // Generate PDF
    console.log('Generating PDF...');
    const pdfBuffer = await pdfService.generateInvestorFormPdf(sampleData);
    
    // Save the PDF
    const outputPath = path.join(__dirname, 'output.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error.message);
  }
}

main();
