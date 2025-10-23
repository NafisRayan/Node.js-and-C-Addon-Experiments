# COUA Letter API Reference

## CouaLetterService

Main service class for generating COUA (Certificate of Unit Allocation) letters.

### Constructor

```javascript
const CouaLetterService = require('./coua-letter/coua-letter-service');
const service = new CouaLetterService();
```

### Methods

#### `generateCouaLetterPdf(data)`

Generates a COUA letter PDF document.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | Object | Yes | COUA letter data object |

**Data Object Structure:**

```javascript
{
  // Header Information
  date: string,                    // Date of issuance (e.g., "17 January 2024")
  investorId: string,              // Unique investor ID (e.g., "INV-2024-001")
  regNumber: string,               // Registration number (e.g., "REG-2024-001")
  unitAllocationNo: string,        // Unit allocation number (e.g., "UA-2024-001")
  
  // Fund Information
  fundName: string,                // Fund name (e.g., "Shanta Asset Securitization Fund")
  registeredUnder: string,         // Registration authority (optional, has default)
  fundRegNo: string,               // Fund registration number
  fundSponsor: string,             // Sponsor organization name
  fundAssetManager: string,        // Asset manager name
  fundTrustee: string,             // Trustee name
  fundCustodian: string,           // Custodian name
  
  // Investor Details
  investorName: string,            // Full name of investor
  investorNid: string,             // National ID number
  investorFatherName: string,      // Father's name
  numberOfUnits: string,           // Number of units (e.g., "1,000")
  averageBuyPrice: string,         // Average purchase price (e.g., "12.50")
  totalInvestmentValue: string,    // Total value (e.g., "BDT 12,500.00")
  
  // Contact Information (optional)
  contactNumber: string,           // Contact phone (optional, has default)
  contactEmail: string             // Contact email (optional, has default)
}
```

**Returns:** `Promise<Buffer>` - PDF document as a Buffer

**Example:**

```javascript
const fs = require('fs');
const CouaLetterService = require('./coua-letter/coua-letter-service');

async function generateCouaLetter() {
  const service = new CouaLetterService();
  
  const data = {
    date: '17 January 2024',
    investorId: 'INV-2024-001',
    regNumber: 'REG-2024-001',
    unitAllocationNo: 'UA-2024-001',
    fundName: 'Shanta Asset Securitization Fund',
    fundRegNo: '001234567890',
    fundSponsor: 'Shanta Securities Limited',
    fundAssetManager: 'Shanta Asset Management Limited',
    fundTrustee: 'IDLC Finance Limited',
    fundCustodian: 'Standard Chartered Bank',
    investorName: 'John Doe',
    investorNid: '1234567890123',
    investorFatherName: 'Robert Doe',
    numberOfUnits: '1,000',
    averageBuyPrice: '12.50',
    totalInvestmentValue: 'BDT 12,500.00',
  };
  
  const pdfBuffer = await service.generateCouaLetterPdf(data);
  fs.writeFileSync('coua-letter.pdf', pdfBuffer);
  console.log('COUA letter generated successfully!');
}

generateCouaLetter();
```

---

## PdfCommonUtils

Utility functions for PDF manipulation (used internally by COUA letter generator).

### Methods

#### `writeText(page, font, opts)`

Writes text on a PDF page with alignment options.

**Parameters:**
- `page` - PDFPage object
- `font` - PDFFont object
- `opts` - Options object:
  ```javascript
  {
    text: string,           // Text to write
    x: number,              // X coordinate
    y: number,              // Y coordinate
    size: number,           // Font size (default: 8)
    color: Color,           // Text color (default: black)
    xAlign: string,         // 'left' | 'center' | 'right' (default: 'left')
    yAlign: string          // 'top' | 'center' | 'bottom' (default: 'top')
  }
  ```

#### `writeMultiLineText(page, font, opts)`

Writes multi-line text with automatic line breaking and justification.

**Parameters:**
- `page` - PDFPage object
- `font` - PDFFont object
- `opts` - Options object:
  ```javascript
  {
    text: string,           // Text to write (can include \n for paragraphs)
    x: number,              // X coordinate
    y: number,              // Y coordinate
    maxWidth: number,       // Maximum width for text wrapping
    size: number,           // Font size (default: 8)
    color: Color,           // Text color (default: black)
    lineHeight: number,     // Line height (default: size * 1.2)
    align: string           // 'left' | 'right' | 'center' | 'justify' (default: 'justify')
  }
  ```

#### `embedAndDrawImage(pdfDoc, page, imageUrl, x, y, width, height, errorMessage)`

Embeds and draws an image on a PDF page.

**Parameters:**
- `pdfDoc` - PDFDocument object
- `page` - PDFPage object
- `imageUrl` - Image URL or local file path
- `x` - X coordinate
- `y` - Y coordinate
- `width` - Image width
- `height` - Image height
- `errorMessage` - Custom error message (optional)

**Supports:**
- Remote URLs (http://, https://)
- Local file paths (absolute or relative)
- JPEG and PNG formats
- Automatic format conversion using Sharp

#### `writeLabelAndValuePair(page, font, boldFont, opts)`

Writes a label-value pair with bold label and regular value.

**Parameters:**
- `page` - PDFPage object
- `font` - Regular PDFFont object
- `boldFont` - Bold PDFFont object
- `opts` - Options object:
  ```javascript
  {
    label: string,          // Label text (will be bold)
    value: string,          // Value text (regular)
    x: number,              // X coordinate
    y: number,              // Y coordinate
    labelSize: number,      // Label font size
    valueSize: number,      // Value font size
    gap: number,            // Gap between label and value (default: 10)
    xAlign: string          // 'left' | 'center' | 'right' (default: 'left')
  }
  ```

#### `drawTable(page, font, opts)`

Draws a table with customizable styling.

**Parameters:**
- `page` - PDFPage object
- `font` - PDFFont object
- `opts` - Options object:
  ```javascript
  {
    rows: Array<{           // Array of row objects
      cells: Array<{        // Array of cell objects
        text: string,       // Cell text
        font: PDFFont,      // Optional font override
        bold: boolean       // Use bold font if true
      }>
    }>,
    x: number,              // X coordinate
    y: number,              // Y coordinate
    rowHeight: number,      // Height of each row (default: 20)
    columnWidths: number[], // Array of column widths
    fontSize: number,       // Font size (default: 10)
    borderColor: [r, g, b], // Border color RGB (default: [0, 0, 0])
    textColor: [r, g, b],   // Text color RGB (default: [0, 0, 0])
    boldFont: PDFFont,      // Bold font for bold cells
    padding: number,        // Cell padding (default: 4)
    showBorders: boolean,   // Show outer borders (default: true)
    showVerticalBorders: boolean,   // Show vertical lines (default: true)
    showHorizontalBorders: boolean  // Show horizontal lines (default: true)
  }
  ```

**Example:**

```javascript
const { PdfCommonUtils } = require('./pdf-common-utils');

PdfCommonUtils.drawTable(page, font, {
  rows: [
    {
      cells: [
        { text: 'Name:', bold: true },
        { text: 'John Doe' }
      ]
    },
    {
      cells: [
        { text: 'ID:', bold: true },
        { text: '123456' }
      ]
    }
  ],
  x: 50,
  y: 400,
  rowHeight: 25,
  columnWidths: [150, 300],
  fontSize: 11,
  boldFont: boldFont
});
```

---

## CouaLetterPdfUtils

Internal utility functions for COUA letter sections (not typically called directly).

### Methods

#### `fillUpTopInfo(pdfDoc, page, font, data)`

Fills the top section of the COUA letter (logo, header info, fund details).

#### `fillUpMiddleTableInfo(pdfDoc, page, font, data)`

Fills the middle section with investor details table.

#### `fillUpBottomNoteInfo(pdfDoc, page, font, data)`

Fills the bottom section with legal notes and contact information.

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
  const pdfBuffer = await service.generateCouaLetterPdf(data);
  fs.writeFileSync('output.pdf', pdfBuffer);
} catch (error) {
  console.error('Failed to generate COUA letter:', error.message);
  // Handle error appropriately
}
```

---

## Constants and Defaults

### Default Values

| Field | Default Value |
|-------|---------------|
| `registeredUnder` | 'Bangladesh Securities and Exchange Commission (Mutual Fund) Rules, 2001' |
| `contactNumber` | '+88 09678 666 888' |
| `contactEmail` | 'info@shanta-aml.com' |

### PDF Specifications

| Property | Value |
|----------|-------|
| Page Size | A4 (595.28 x 841.89 points) |
| Default Font | Helvetica |
| Bold Font | Helvetica-Bold |
| Logo Position | (43.67, 765.92) |
| Logo Size | 142 x 36 points |

### Color Values

Colors are specified as RGB arrays:
- Black: `[0, 0, 0]`
- White: `[1, 1, 1]`
- Custom: `[r, g, b]` where r, g, b are 0-1

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

- [COUA Letter README](./README.md) - Feature overview and usage guide
- [Main README](../README.md) - Project documentation
- [pdf-lib Documentation](https://pdf-lib.js.org/) - PDF manipulation library
