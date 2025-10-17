const fs = require('fs');
const path = require('path');
const PdfService = require('./SASF-Institution-form');

// Sample data for Institution form
const sampleData = {
  templateName: 'SASF-Institution',
  
  // Top section
  dateField: '17-01-2023',
  amount: '3,410,000',
  amountInWords: 'THIRTY-NINE MILLION, NINE HUNDRED AND NINETY ONE THOUSANDS, THREE',
  unitAmount: '3,410,000',
  unitPrice: 'BDT 12.73',
  
  // Registration section
  registrationNumber: '022000002-1',
  
  // Institution type (e.g., Local Company, Foreign Company, Trust, Society, Other)
  institutionType: 'Local Company',
  
  // Institution details
  institutionRegistrationNo: '022000002-1',
  institutionName: 'Shanta Asset Management Limited',
  registrationLabel: 'Registration:',
  institutionAddress: 'Biman Bhaban, 16th, Gulshan C/A, Dhaka-1212, 1000',
  telephoneNo: '01234567890',
  faxNo: '02-9876543',
  email: 'info@shanta.com.bd',
  boAccount: 'BOA',
  accountNumber: '2011000021495',
  etin: '1234567890123',
  bankName: 'BRAC BANK',
  bankBranch: 'GULSHAN',
  bankRoutingNo: '070337601',
  chequeNumber: 'CHQ-123456',
  chequeBank: 'Dhaka Bank Ltd.',
  chequeBranch: 'GULSHAN',
  
  // Options
  dividendOption: 'Cash',
  investmentOption: 'SIP',
  
  // Managing Director/CEO
  managingDirectorName: 'Dwaraka Kharu',
  authorizedPersonName: 'Dwaraka Kharu',
  managingDirectorPhotoUrl: '',
  
  // Authorized Persons
  authorizedPerson1Name: 'Dwaraka Kharu',
  authorizedPerson1Designation: 'Chief Financial Officer',
  authorizedPerson1SignatureUrl: '',
  
  authorizedPerson2Name: 'Mark Le Hioan',
  authorizedPerson2Designation: 'Head of Risk Management Division',
  authorizedPerson2SignatureUrl: '',
  
  // Page 2 - Official Use Only
  registrationNo: '022000002-1',
  saleNo: '0200000001',
  date: '17-01-2023',
  unitAllocationConfirmation: '0200000001',
  noOfUnits: '3,410,000',
  applicationDate: '17-01-2023'
};

async function main() {
  try {
    console.log('Starting Institution PDF Form Filling Application...');
    
    const pdfService = new PdfService();
    
    // Generate PDF
    console.log('Generating Institution PDF...');
    const pdfBuffer = await pdfService.generateInstitutionFormPdf(sampleData);
    
    // Save the PDF
    const outputPath = path.join(__dirname, 'output-institution.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`Institution PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error generating Institution PDF:', error.message);
  }
}

main();
