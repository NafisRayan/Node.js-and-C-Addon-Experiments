# COUA Letter PDF Generator

## Overview

This module generates **Certificate of Unit Allocation (COUA)** letters for fund investors. The COUA letter is a formal document confirming unit allocation details for registered unit-holders.

## Files

- `coua-letter-service.js` - Main service class for generating COUA letters
- `coua-letter-pdf-utils.js` - Utility functions for filling different sections of the COUA letter
- `../pdf-common-utils.js` - Common PDF utilities (text writing, tables, images, etc.)

## Usage

### Basic Example

```javascript
const CouaLetterService = require('./coua-letter/coua-letter-service');

const couaLetterService = new CouaLetterService();

const data = {
  // Header information
  date: '17 January 2024',
  investorId: 'INV-2024-001',
  regNumber: 'REG-2024-001',
  unitAllocationNo: 'UA-2024-001',
  
  // Fund information
  fundName: 'Shanta Asset Securitization Fund',
  registeredUnder: 'Bangladesh Securities and Exchange Commission (Mutual Fund) Rules, 2001',
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
  
  // Contact information (optional)
  contactNumber: '+88 09678 666 888',
  contactEmail: 'info@shanta-aml.com',
};

const pdfBuffer = await couaLetterService.generateCouaLetterPdf(data);
fs.writeFileSync('output.pdf', pdfBuffer);
```

### Run the Example

```bash
npm run coua
```

This will generate `output-coua-letter.pdf` in the project root.

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

## Features

✓ Professional layout with company branding
✓ Precise text positioning and alignment
✓ Multi-line text with justification support
✓ Table generation with customizable styling
✓ Image embedding (logo)
✓ Bold and regular font mixing
✓ Legal disclaimer section
✓ System-generated certificate (no signature required)

## Dependencies

- `pdf-lib` - PDF creation and manipulation
- `sharp` - Image processing (for logo conversion if needed)

## Notes

- The logo file should be located at `../saml_logo.png` relative to the coua-letter folder
- The certificate is system-generated and does not require authorized signatures
- All text uses justified alignment for professional appearance
- The document includes legal disclaimers about confidentiality and unauthorized use
