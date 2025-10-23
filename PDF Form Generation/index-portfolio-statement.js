const fs = require('fs');
const path = require('path');
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');

// Sample data for testing Portfolio Statement generation
const sampleData = {
  // Fund information
  fundName: 'Shanta Amanah Shariah Fund',
  registeredUnder: 'Securities & Exchange Commission (Mutual Fund) Rules, 2001',
  managedBy: 'Shanta Asset Management Limited',
  address: 'The Glass House (Level 13), S.E (B) - 2, 38 Gulshan Avenue, Gulshan - 1, Dhaka 1212',
  phone: '+88-02-48810551-2',
  fax: '+88-02-48810553',
  statementDate: '19-10-2025',
  
  // Investor information
  investorName: 'Md. Samiul Alim',
  registrationNo: '022002128-1',
  
  // Investment details
  fundDeposit: '200,000',
  dividendReinvested: '6,860',
  totalDeposit: '206,860',
  totalWithdrawal: '163,829',
  unitsPurchased: '16,963',
  cipUnits: '594',
  unitsSurrender: '17000',
  unitsHeld: '557',
  averageCostPerUnit: '11.7819',
  investmentAtCost: '6,563',
  currentNav: '10.07',
  currentNavDate: 'Oct 16, 2025',
  marketValue: '5,609',
  capitalGainRealized: '(36,463)',
  capitalGainUnrealized: '(954)',
  totalCapitalGain: '(37,416)',
  dividendIncome: '7,633',
  dividendReceivable: '0.00',
  totalReturn: '(29,783)',
  cashBalance: '6.23',
};

async function main() {
  try {
    console.log('Starting Portfolio Statement PDF Generation...');

    const portfolioStatementService = new PortfolioStatementService();

    // Generate PDF
    console.log('Generating Portfolio Statement PDF...');
    const pdfBuffer = await portfolioStatementService.generatePortfolioStatementPdf(sampleData);

    // Save the PDF
    const outputPath = path.join(__dirname, 'output-portfolio-statement.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`Portfolio Statement PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error generating Portfolio Statement PDF:', error.message);
    console.error(error.stack);
  }
}

main();
