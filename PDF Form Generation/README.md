# PDF Form Generation - COUA Letter Generator

A standalone Node.js application for generating **Certificate of Unit Allocation (COUA)** letters for fund investors. This system creates professional, system-generated certificates with precise text positioning, table generation, and image embedding capabilities.

## Features

✓ **Professional Layout** - Company branding with logo and structured sections  
✓ **Precise Text Positioning** - Coordinate-based placement with alignment options  
✓ **Multi-line Text** - Justified text with automatic line breaking  
✓ **Table Generation** - Flexible tables with customizable styling  
✓ **Image Embedding** - Logo placement with automatic format conversion  
✓ **Font Mixing** - Bold and regular fonts for emphasis  
✓ **Legal Disclaimers** - Built-in legal text and contact information  
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

1. Run the example:
   ```bash
   npm start
   ```

2. The generated PDF will be saved as `output-coua-letter.pdf` in the project root.

## Usage

### Basic Example

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
fs.writeFileSync('output.pdf', pdfBuffer);
```

## Project Structure

```
PDF Form Generation/
├── coua-letter/
│   ├── coua-letter-service.js       # Main service class
│   ├── coua-letter-pdf-utils.js     # Section-specific utilities
│   ├── README.md                    # Detailed feature documentation
│   └── API-REFERENCE.md             # Complete API documentation
├── pdf-common-utils.js              # Common PDF utilities
├── index.js                         # Entry point with sample data
├── package.json                     # Dependencies and scripts
├── saml_logo.png                    # Company logo
└── README.md                        # This file
```

## Document Structure

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

### CouaLetterService

#### `generateCouaLetterPdf(data)`

Generates a COUA letter PDF document.

**Parameters:**
- `data` (Object) - COUA letter data object (see Data Fields above)

**Returns:** `Promise<Buffer>` - PDF document as a Buffer

**Example:**
```javascript
const service = new CouaLetterService();
const pdfBuffer = await service.generateCouaLetterPdf(data);
```

### PdfCommonUtils

Utility functions for PDF manipulation:

- `writeText(page, font, opts)` - Write text with alignment
- `writeMultiLineText(page, font, opts)` - Multi-line text with justification
- `embedAndDrawImage(pdfDoc, page, imageUrl, x, y, width, height, errorMessage)` - Embed images
- `writeLabelAndValuePair(page, font, boldFont, opts)` - Label-value pairs
- `drawTable(page, font, opts)` - Table generation

See `coua-letter/API-REFERENCE.md` for complete API documentation.

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

## Support

For issues or questions, please contact the development team.

---

**Note**: This is a system-generated certificate and does not require authorized signatures. The document includes legal disclaimers about confidentiality and unauthorized use.
