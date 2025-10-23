# Quick Reference Card

## Installation

```bash
npm install
```

## Generate Documents

```bash
# COUA Letter
npm start

# Portfolio Statement
npm run portfolio
```

## Basic Usage

### COUA Letter

```javascript
const CouaLetterService = require('./coua-letter/coua-letter-service');
const service = new CouaLetterService();

const data = {
  date: '17 January 2024',
  investorId: 'INV-2024-001',
  fundName: 'Shanta Asset Securitization Fund',
  investorName: 'John Doe',
  // ... 12 more required fields
};

const pdf = await service.generateCouaLetterPdf(data);
fs.writeFileSync('coua.pdf', pdf);
```

### Portfolio Statement

```javascript
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');
const service = new PortfolioStatementService();

const data = {
  fundName: 'Shanta Amanah Shariah Fund',
  statementDate: '19-10-2025',
  investorName: 'Md. Samiul Alim',
  registrationNo: '022002128-1',
  // ... 20 more required fields
};

const pdf = await service.generatePortfolioStatementPdf(data);
fs.writeFileSync('statement.pdf', pdf);
```

## Required Fields

### COUA Letter (16 fields)
- date, investorId, regNumber, unitAllocationNo
- fundName, fundRegNo, fundSponsor, fundAssetManager
- fundTrustee, fundCustodian
- investorName, investorNid, investorFatherName
- numberOfUnits, averageBuyPrice, totalInvestmentValue

### Portfolio Statement (24 fields)
- fundName, statementDate, investorName, registrationNo
- fundDeposit, dividendReinvested, totalDeposit, totalWithdrawal
- unitsPurchased, cipUnits, unitsSurrender, unitsHeld
- averageCostPerUnit, investmentAtCost, currentNav, currentNavDate
- marketValue, capitalGainRealized, capitalGainUnrealized, totalCapitalGain
- dividendIncome, dividendReceivable, totalReturn, cashBalance

## File Structure

```
PDF Form Generation/
├── coua-letter/              # COUA module
├── portfolio-statement/      # Portfolio module
├── pdf-common-utils.js       # Shared utilities
├── index.js                  # COUA entry point
├── index-portfolio-statement.js  # Portfolio entry point
└── saml_logo.png            # Logo
```

## Common Utilities

```javascript
const { PdfCommonUtils } = require('./pdf-common-utils');

// Write text
PdfCommonUtils.writeText(page, font, {
  text: 'Hello',
  x: 100,
  y: 700,
  size: 12,
  xAlign: 'center'
});

// Multi-line text
PdfCommonUtils.writeMultiLineText(page, font, {
  text: 'Long text...',
  x: 50,
  y: 600,
  maxWidth: 500,
  align: 'justify'
});

// Draw table
PdfCommonUtils.drawTable(page, font, {
  rows: [
    { cells: [{ text: 'Label', bold: true }, { text: 'Value' }] }
  ],
  x: 50,
  y: 500,
  columnWidths: [200, 300]
});
```

## Value Formatting

```javascript
// Numbers
fundDeposit: '200,000'        // ✓ Comma separators
averageCostPerUnit: '11.7819' // ✓ Decimals

// Negative values
capitalGainRealized: '(36,463)'  // ✓ Parentheses
capitalGainRealized: '-36,463'   // ✗ Don't use minus

// Dates
date: '17 January 2024'          // COUA format
statementDate: '19-10-2025'      // Portfolio format
currentNavDate: 'Oct 16, 2025'   // NAV format
```

## Troubleshooting

**Logo not showing?**
- Ensure `saml_logo.png` exists in project root
- Check file format (JPEG or PNG)

**Text overlapping?**
- Adjust coordinates in `*-pdf-utils.js` files
- Reduce font sizes

**Missing dependencies?**
- Run `npm install`

## Documentation

| File | Description |
|------|-------------|
| README.md | Main documentation |
| GETTING-STARTED.md | Quick start guide |
| DOCUMENT-TYPES.md | Document comparison |
| PROJECT-SUMMARY.md | Project overview |
| CHANGELOG.md | Version history |
| coua-letter/README.md | COUA features |
| coua-letter/API-REFERENCE.md | COUA API |
| portfolio-statement/README.md | Portfolio features |
| portfolio-statement/API-REFERENCE.md | Portfolio API |

## Key Differences

| Feature | COUA Letter | Portfolio Statement |
|---------|-------------|---------------------|
| Purpose | Unit allocation certificate | Investment report |
| Fields | 16 required | 24 required |
| Table Rows | 6 | 19 |
| Bold Rows | 0 | 5 |
| Footer | Legal disclaimer | Currency note |

## Express.js Integration

```javascript
const express = require('express');
const app = express();

app.post('/api/coua', async (req, res) => {
  const service = new CouaLetterService();
  const pdf = await service.generateCouaLetterPdf(req.body);
  res.contentType('application/pdf').send(pdf);
});

app.post('/api/portfolio', async (req, res) => {
  const service = new PortfolioStatementService();
  const pdf = await service.generatePortfolioStatementPdf(req.body);
  res.contentType('application/pdf').send(pdf);
});
```

## Batch Processing

```javascript
const investors = await db.query('SELECT * FROM investors');

for (const investor of investors) {
  // COUA Letter
  const couaPdf = await couaService.generateCouaLetterPdf(investor);
  fs.writeFileSync(`coua/${investor.id}.pdf`, couaPdf);
  
  // Portfolio Statement
  const portfolioPdf = await portfolioService.generatePortfolioStatementPdf(investor);
  fs.writeFileSync(`portfolio/${investor.id}.pdf`, portfolioPdf);
}
```

## Support

For detailed information, see the full documentation files or contact the development team.
