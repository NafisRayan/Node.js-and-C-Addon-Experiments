const fs = require('fs');
const path = require('path');
const CouaLetterService = require('./coua-letter/coua-letter-service');

// Sample data for testing COUA Letter generation
const sampleData = {
  date: '17 January 2024',
  investorId: 'INV-2024-001',
  regNumber: 'REG-2024-001',
  unitAllocationNo: 'UA-2024-001',
  fundName: 'Shanta Asset Securitization Fund',
  registeredUnder:
    'Bangladesh Securities and Exchange Commission (Mutual Fund) Rules, 2001',
  fundRegNo: '001234567890',
  fundSponsor: 'Shanta Securities Limited',
  fundAssetManager: 'Shanta Asset Management Limited',
  fundTrustee: 'IDLC Finance Limited',
  fundCustodian: 'Standard Chartered Bank',
  // Investor details for table
  investorName: 'John Doe',
  investorNid: '1234567890123',
  investorFatherName: 'Robert Doe',
  numberOfUnits: '1,000',
  averageBuyPrice: '12.50',
  totalInvestmentValue: 'BDT 12,500.00',
  // Contact information
  contactNumber: '+88 09678 666 888',
  contactEmail: 'info@shanta-aml.com',
};

async function main() {
  try {
    console.log('Starting COUA Letter PDF Generation...');

    const couaLetterService = new CouaLetterService();

    // Generate PDF
    console.log('Generating COUA Letter PDF...');
    const pdfBuffer =
      await couaLetterService.generateCouaLetterPdf(sampleData);

    // Save the PDF
    const outputPath = path.join(__dirname, 'output-coua-letter.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`COUA Letter PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error generating COUA Letter PDF:', error.message);
    console.error(error.stack);
  }
}

main();
