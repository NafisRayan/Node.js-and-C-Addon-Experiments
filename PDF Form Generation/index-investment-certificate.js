const fs = require('fs');
const path = require('path');
const InvestmentCertificateService = require('./investment-certificate/investment-certificate-service');

// Sample data for testing Investment Certificate generation
const sampleData = {
  // Fund information
  fundName: 'Shanta First Income Unit Fund',
  registeredUnder: 'Bangladesh Securities & Exchange Commission (Mutual Fund) Rules, 2001',
  managedBy: 'Shanta Asset Management Limited',
  address: 'The Glass House (Level 13), S.E (B) - 2, 38 GULSHAN AVENUE, DHAKA 1212',
  phone: '+88-02-48810551-2',
  fax: '+88-02-48810553',

  // Investor information
  date: '10-Jul-2025',
  registrationNo: '012002128-1',
  boAccountNo: '1203490076006677',
  name: 'Md. Samiul Alim',
  investorAddress: 'House : 45, Road : 12, Nikunja -2,Khilkhet Dhaka 1229',

  // Investment period
  startDate: '01 Jul, 2024',
  endDate: '30 Jun, 2025',

  // Investment details
  openingBalance: '99,999.00',
  closingBalance: '0.00',
  investmentDuringYear: '0.00',
  redemptionDuringYear: '96,318.23',
  costValueSecurities: '0.00',
  marketValueSecurities: '0.00',
  realizedGainLoss: '-3,680.77',
  unrealizedGainLoss: '0.00',
  dividendIncome: '0.00',
  taxDeductedDividend: '0.00',
};

async function main() {
  try {
    console.log('Starting Investment Certificate PDF Generation...');

    const investmentCertificateService = new InvestmentCertificateService();

    // Generate PDF
    console.log('Generating Investment Certificate PDF...');
    const pdfBuffer = await investmentCertificateService.generateInvestmentCertificatePdf(sampleData);

    // Save the PDF
    const outputPath = path.join(__dirname, 'output-investment-certificate.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`Investment Certificate PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error generating Investment Certificate PDF:', error.message);
    console.error(error.stack);
  }
}

main();
