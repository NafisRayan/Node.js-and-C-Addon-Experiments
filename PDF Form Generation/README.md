# PDF Form Generation - Fund Document Generator

A standalone Node.js application for generating professional fund documents including **Certificate of Unit Allocation (COUA)** letters and **Investment Portfolio Statements**. This system creates professional, system-generated documents with precise text positioning, table generation, and image embedding capabilities.

## Features

✓ **Professional Layout** - Company branding with logo and structured sections  
✓ **Precise Text Positioning** - Coordinate-based placement with alignment options  
✓ **Multi-line Text** - Justified text with automatic line breaking  
✓ **Table Generation** - Flexible tables with customizable styling  
✓ **Image Embedding** - Logo placement with automatic format conversion  
✓ **Font Mixing** - Bold and regular fonts for emphasis  
✓ **Multiple Document Types** - COUA letters and Portfolio Statements  
✓ **System-Generated** - No signature required

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
   ```bash
   cd "PDF Form Generation"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure the logo file `saml_logo.png` is in the project root.

## Quick Start

### Generate COUA Letter

1. Run the COUA letter example:
   ```bash
   npm start
   ```

2. The generated PDF will be saved as `output-coua-letter.pdf` in the project root.

### Generate Portfolio Statement

1. Run the portfolio statement example:
   ```bash
   npm run portfolio
   ```

2. The generated PDF will be saved as `output-portfolio-statement.pdf` in the project root.

## Usage

### COUA Letter Example

```javascript
const CouaLetterService = require('./coua-letter/coua-letter-service');
const fs = require('fs');

const service = new CouaLetterService();

const data = {
  // Header information
  date: '17 January 2024',
  investorId: 'INV-2024-001',
  regNumber: 'REG-2024-001',
  unitAllocationNo: 'UA-2024-001',
  
  // Fund information
  fundName: 'Shanta Asset Securitization Fund',
  fundRegNo: '001234567890',
  fundSponsor: 'Shanta Securities Limited',
  fundAssetManager: 'Shanta Asset Management Limited',
  fundTrustee: 'IDLC Finance Limited',
  fundCustodian: 'Standard Chartered Bank',
  
  // Investor details
  investorName: 'John Doe',
  investorNid: '1234567890123',
  investorFatherName: 'Robert Doe',
  numberOfUnits: '1,000',
  averageBuyPrice: '12.50',
  totalInvestmentValue: 'BDT 12,500.00',
};

const pdfBuffer = await service.generateCouaLetterPdf(data);
fs.writeFileSync('coua-letter.pdf', pdfBuffer);
```

### Portfolio Statement Example

```javascript
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');
const fs = require('fs');

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
```

## Project Structure

```
PDF Form Generation/
├── coua-letter/
│   ├── coua-letter-service.js       # COUA letter service class
│   ├── coua-letter-pdf-utils.js     # COUA letter utilities
│   ├── README.md                    # COUA letter documentation
│   └── API-REFERENCE.md             # COUA letter API reference
├── portfolio-statement/
│   ├── portfolio-statement-service.js    # Portfolio statement service
│   ├── portfolio-statement-pdf-utils.js  # Portfolio statement utilities
│   ├── README.md                         # Portfolio statement documentation
│   └── API-REFERENCE.md                  # Portfolio statement API reference
├── pdf-common-utils.js              # Common PDF utilities
├── index.js                         # COUA letter entry point
├── index-portfolio-statement.js     # Portfolio statement entry point
├── package.json                     # Dependencies and scripts
├── saml_logo.png                    # Company logo
└── README.md                        # This file
```

## Document Types

### 1. COUA Letter (Certificate of Unit Allocation)

The COUA letter consists of three main sections:

### 1. Top Section (Header)
- Company logo (left side)
- Date, Investor ID, Registration Number, Unit Allocation No. (right side)
- Fund name (centered, large title)
- Fund registration details (centered)
- Fund sponsor, asset manager, trustee, custodian information

### 2. Middle Section (Investor Details Table)
- Title: "CONFIRMATION OF UNIT ALLOCATION"
- Description paragraph explaining the certificate
- Table with investor details:
  - Investor's Name
  - Investor NID
  - Father's Name
  - Number of Units
  - Average Buy Price (BDT)
  - Total Investment Value

### 3. Bottom Section (Legal Notes)
- Legal disclaimer about the document
- Contact information with phone and email

### 2. Portfolio Statement (Investment Statement)

The Portfolio Statement consists of four main sections:

#### 1. Header Section
- Company logo (left side)
- Fund name (centered, large title)
- Registration details (centered)
- Managed by information
- Address, phone, and fax
- Horizontal separator line
- "Investment Statement" title
- Statement date

#### 2. Investor Information Section
- Investor's Name
- Registration Number

#### 3. Investment Table Section
A comprehensive 19-row table showing:
- Fund Deposit
- Dividend Reinvested
- **Total Deposit** (bold)
- Total Withdrawal
- Units Purchased (Nos)
- CIP Units (Nos)
- Units Surrender (Nos)
- **Units Held (Nos)** (bold)
- Average Cost Price/Unit
- Investment at Cost
- Current NAV (with date)
- **Market Value of Investment** (bold)
- Capital Gain (Realized) (a)
- Capital Gain (Unrealized) (b)
- **Total Capital Gain (a+b)** (bold)
- Dividend Income (c)
- Dividend Receivable (d)
- **Total Return (a+b+c+d)** (bold)
- Cash Balance

#### 4. Footer Section
- Note: "All amounts are in BDT, otherwise mentioned."

## Data Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Date of certificate issuance |
| `investorId` | string | Unique investor identifier |
| `regNumber` | string | Registration number |
| `unitAllocationNo` | string | Unit allocation number |
| `fundName` | string | Name of the fund |
| `fundRegNo` | string | Fund registration number |
| `fundSponsor` | string | Fund sponsor name |
| `fundAssetManager` | string | Asset manager name |
| `fundTrustee` | string | Trustee name |
| `fundCustodian` | string | Custodian name |
| `investorName` | string | Investor's full name |
| `investorNid` | string | National ID number |
| `investorFatherName` | string | Father's name |
| `numberOfUnits` | string | Number of units allocated |
| `averageBuyPrice` | string | Average purchase price |
| `totalInvestmentValue` | string | Total investment amount |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `registeredUnder` | string | 'Bangladesh Securities and Exchange Commission (Mutual Fund) Rules, 2001' | Registration authority |
| `contactNumber` | string | '+88 09678 666 888' | Contact phone number |
| `contactEmail` | string | 'info@shanta-aml.com' | Contact email address |

## PDF Specifications

- **Page Size**: A4 (595.28 x 841.89 points)
- **Font**: Helvetica (regular and bold)
- **Logo**: PNG format, positioned at top-left
- **Text Alignment**: Mixed (left, center, right, justified)
- **Table**: 2-column layout with borders

## API Reference

### Service Classes

#### CouaLetterService

```javascript
const service = new CouaLetterService();
const pdfBuffer = await service.generateCouaLetterPdf(data);
```

See `coua-letter/API-REFERENCE.md` for complete COUA letter API documentation.

#### PortfolioStatementService

```javascript
const service = new PortfolioStatementService();
const pdfBuffer = await service.generatePortfolioStatementPdf(data);
```

See `portfolio-statement/API-REFERENCE.md` for complete portfolio statement API documentation.

### PdfCommonUtils

Utility functions for PDF manipulation:

- `writeText(page, font, opts)` - Write text with alignment
- `writeMultiLineText(page, font, opts)` - Multi-line text with justification
- `embedAndDrawImage(pdfDoc, page, imageUrl, x, y, width, height, errorMessage)` - Embed images
- `writeLabelAndValuePair(page, font, boldFont, opts)` - Label-value pairs
- `drawTable(page, font, opts)` - Table generation

These utilities are shared across all document types.

## Dependencies

```json
{
  "pdf-lib": "^1.17.1",
  "sharp": "^0.33.0"
}
```

- **pdf-lib** - PDF creation and manipulation
- **sharp** - Image processing (for logo conversion if needed)

## NPM Scripts

- `npm start` - Generate COUA letter with sample data
- `npm run generate` - Alias for npm start
- `npm run portfolio` - Generate portfolio statement with sample data

## Error Handling

The application handles common errors:

- **Image not found**: When logo file doesn't exist
- **Invalid image format**: When image is not JPEG or PNG
- **PDF generation failure**: When pdf-lib encounters an error
- **Missing required fields**: When required data fields are not provided

**Example:**
```javascript
try {
  const pdfBuffer = await service.generateCouaLetterPdf(data);
  fs.writeFileSync('output.pdf', pdfBuffer);
  console.log('PDF generated successfully!');
} catch (error) {
  console.error('Failed to generate COUA letter:', error.message);
}
```

## Customization

### Changing the Logo

Replace `saml_logo.png` with your own logo file (JPEG or PNG format).

### Modifying Layout

Edit coordinates in `coua-letter/coua-letter-pdf-utils.js`:
- `fillUpTopInfo()` - Header section positioning
- `fillUpMiddleTableInfo()` - Table positioning and styling
- `fillUpBottomNoteInfo()` - Footer section positioning

### Customizing Text

Modify text content in `coua-letter/coua-letter-pdf-utils.js` or pass custom values through the data object.

## Troubleshooting

**Issue: Logo not displaying**
- Ensure `saml_logo.png` exists in the project root
- Check file format (JPEG or PNG)
- Verify file permissions

**Issue: Text overlapping**
- Adjust coordinates in `coua-letter-pdf-utils.js`
- Modify font sizes if needed
- Check maxWidth for multi-line text

**Issue: Table not rendering correctly**
- Verify columnWidths match number of columns
- Check rowHeight and fontSize values
- Ensure boldFont is properly embedded

## Advanced Usage

### Batch Generation

Generate multiple COUA letters:

```javascript
const service = new CouaLetterService();

const investors = [
  { investorName: 'John Doe', /* ... */ },
  { investorName: 'Jane Smith', /* ... */ },
];

for (const investor of investors) {
  const pdfBuffer = await service.generateCouaLetterPdf(investor);
  fs.writeFileSync(`coua-${investor.investorId}.pdf`, pdfBuffer);
}
```

### Custom Styling

Modify table styling:

```javascript
PdfCommonUtils.drawTable(page, font, {
  rows: [...],
  borderColor: [0.5, 0.5, 0.5], // Gray borders
  textColor: [0, 0, 0.5],        // Dark blue text
  fontSize: 11,
  padding: 6,
  showVerticalBorders: false,    // Hide vertical lines
});
```

## License

ISC

## Documentation

### Quick References
- **GETTING-STARTED.md** - Quick start guide for new users
- **DOCUMENT-TYPES.md** - Comparison and guide for choosing document types
- **PROJECT-SUMMARY.md** - Project overview and status

### Module Documentation
- **coua-letter/README.md** - COUA letter features and usage
- **coua-letter/API-REFERENCE.md** - COUA letter API reference
- **portfolio-statement/README.md** - Portfolio statement features and usage
- **portfolio-statement/API-REFERENCE.md** - Portfolio statement API reference

## Support

For issues or questions, please contact the development team.

---

**Note**: All documents are system-generated and do not require authorized signatures.
