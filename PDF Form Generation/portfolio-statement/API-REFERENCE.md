# Portfolio Statement API Reference

## PortfolioStatementService

Main service class for generating Investment Portfolio Statements.

### Constructor

```javascript
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');
const service = new PortfolioStatementService();
```

### Methods

#### `generatePortfolioStatementPdf(data)`

Generates a Portfolio Statement PDF document.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | Object | Yes | Portfolio statement data object |

**Data Object Structure:**

```javascript
{
  // Fund Information
  fundName: string,                // Fund name (e.g., "Shanta Amanah Shariah Fund")
  registeredUnder: string,         // Registration authority (optional, has default)
  managedBy: string,               // Asset manager (optional, has default)
  address: string,                 // Company address (optional, has default)
  phone: string,                   // Contact phone (optional, has default)
  fax: string,                     // Fax number (optional, has default)
  statementDate: string,           // Statement date (e.g., "19-10-2025")
  
  // Investor Information
  investorName: string,            // Full name of investor
  registrationNo: string,          // Registration number
  
  // Investment Details
  fundDeposit: string,             // Fund deposit amount
  dividendReinvested: string,      // Dividend reinvested
  totalDeposit: string,            // Total deposit
  totalWithdrawal: string,         // Total withdrawal
  unitsPurchased: string,          // Units purchased
  cipUnits: string,                // CIP units
  unitsSurrender: string,          // Units surrendered
  unitsHeld: string,               // Units held
  averageCostPerUnit: string,      // Average cost per unit
  investmentAtCost: string,        // Investment at cost
  currentNav: string,              // Current NAV
  currentNavDate: string,          // NAV date (e.g., "Oct 16, 2025")
  marketValue: string,             // Market value
  capitalGainRealized: string,     // Realized capital gain
  capitalGainUnrealized: string,   // Unrealized capital gain
  totalCapitalGain: string,        // Total capital gain
  dividendIncome: string,          // Dividend income
  dividendReceivable: string,      // Dividend receivable
  totalReturn: string,             // Total return
  cashBalance: string              // Cash balance
}
```

**Returns:** `Promise<Buffer>` - PDF document as a Buffer

**Example:**

```javascript
const fs = require('fs');
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');

async function generateStatement() {
  const service = new PortfolioStatementService();
  
  const data = {
    fundName: 'Shanta Amanah Shariah Fund',
    statementDate: '19-10-2025',
    investorName: 'Md. Samiul Alim',
    registrationNo: '022002128-1',
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
  
  const pdfBuffer = await service.generatePortfolioStatementPdf(data);
  fs.writeFileSync('portfolio-statement.pdf', pdfBuffer);
  console.log('Portfolio statement generated successfully!');
}

generateStatement();
```

---

## PortfolioStatementPdfUtils

Internal utility functions for Portfolio Statement sections (not typically called directly).

### Methods

#### `fillUpHeaderInfo(pdfDoc, page, font, boldFont, data)`

Fills the header section of the portfolio statement.

**Parameters:**
- `pdfDoc` - PDFDocument object
- `page` - PDFPage object
- `font` - Regular PDFFont object
- `boldFont` - Bold PDFFont object
- `data` - Header data object

**Renders:**
- Company logo
- Fund name (large, bold, centered)
- Registration details
- Managed by information
- Address, phone, fax
- Horizontal separator line
- "Investment Statement" title
- Statement date

#### `fillUpInvestorInfo(page, font, boldFont, data)`

Fills the investor information section.

**Parameters:**
- `page` - PDFPage object
- `font` - Regular PDFFont object
- `boldFont` - Bold PDFFont object
- `data` - Investor data object

**Renders:**
- Investor's Name
- Registration Number

#### `fillUpInvestmentTable(page, font, boldFont, data)`

Fills the investment details table.

**Parameters:**
- `page` - PDFPage object
- `font` - Regular PDFFont object
- `boldFont` - Bold PDFFont object
- `data` - Investment data object

**Renders:**
19-row table with all investment details, with bold highlighting for:
- Total Deposit
- Units Held
- Market Value of Investment
- Total Capital Gain
- Total Return

#### `fillUpFooterNote(page, font)`

Fills the footer note section.

**Parameters:**
- `page` - PDFPage object
- `font` - Regular PDFFont object

**Renders:**
- Currency disclaimer note

---

## Error Handling

All methods may throw errors in the following cases:

- **Image not found**: When logo file doesn't exist
- **Invalid image format**: When image is not JPEG or PNG
- **PDF generation failure**: When pdf-lib encounters an error
- **Missing required fields**: When required data fields are not provided

**Example Error Handling:**

```javascript
try {
  const pdfBuffer = await service.generatePortfolioStatementPdf(data);
  fs.writeFileSync('output.pdf', pdfBuffer);
} catch (error) {
  console.error('Failed to generate portfolio statement:', error.message);
  // Handle error appropriately
}
```

---

## Constants and Defaults

### Default Values

| Field | Default Value |
|-------|---------------|
| `registeredUnder` | 'Securities & Exchange Commission (Mutual Fund) Rules, 2001' |
| `managedBy` | 'Shanta Asset Management Limited' |
| `address` | 'The Glass House (Level 13), S.E (B) - 2, 38 Gulshan Avenue, Gulshan - 1, Dhaka 1212' |
| `phone` | '+88-02-48810551-2' |
| `fax` | '+88-02-48810553' |

### PDF Specifications

| Property | Value |
|----------|-------|
| Page Size | A4 (595.28 x 841.89 points) |
| Default Font | Helvetica |
| Bold Font | Helvetica-Bold |
| Logo Position | (50, 765) |
| Logo Size | 120 x 35 points |
| Table Columns | 2 (Label: 380pt, Value: 100pt) |
| Row Height | 20 points |

### Table Layout

- **Label Column Width**: 380 points
- **Value Column Width**: 100 points
- **Row Height**: 20 points
- **Font Size**: 9 points
- **Padding**: 5 points
- **Borders**: All borders shown

### Bold Rows

The following rows are displayed in bold:
- Total Deposit
- Units Held (Nos)
- Market Value of Investment
- Total Capital Gain (a+b)
- Total Return (a+b+c+d)

---

## Value Formatting

### Negative Values

Negative values should be formatted with parentheses:
- Correct: `"(36,463)"`
- Incorrect: `"-36,463"`

### Number Formatting

- Use comma separators for thousands: `"200,000"`
- Decimal values: `"11.7819"`
- Currency amounts: `"6,563"` (BDT assumed)

### Date Formatting

- Statement date: `"19-10-2025"` (DD-MM-YYYY)
- NAV date: `"Oct 16, 2025"` (Month DD, YYYY)

---

## Integration Example

### Express.js API

```javascript
const express = require('express');
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');

const app = express();
app.use(express.json());

app.post('/api/generate-portfolio-statement', async (req, res) => {
  try {
    const service = new PortfolioStatementService();
    const pdfBuffer = await service.generatePortfolioStatementPdf(req.body);
    
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio-statement.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Batch Generation

```javascript
const service = new PortfolioStatementService();

const investors = await db.query('SELECT * FROM portfolio_data WHERE statement_date = ?', ['2025-10-19']);

for (const investor of investors) {
  const pdfBuffer = await service.generatePortfolioStatementPdf(investor);
  fs.writeFileSync(`statements/${investor.registrationNo}.pdf`, pdfBuffer);
  console.log(`Generated statement for ${investor.investorName}`);
}
```

---

## Dependencies

```json
{
  "pdf-lib": "^1.17.1",
  "sharp": "^0.33.0"
}
```

---

## See Also

- [Portfolio Statement README](./README.md) - Feature overview and usage guide
- [Main README](../README.md) - Project documentation
- [pdf-lib Documentation](https://pdf-lib.js.org/) - PDF manipulation library
