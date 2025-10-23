# Portfolio Statement PDF Generator

## Overview

This module generates **Investment Portfolio Statements** for fund investors. The Portfolio Statement is a comprehensive document showing investment details, holdings, returns, and capital gains.

## Files

- `portfolio-statement-service.js` - Main service class for generating portfolio statements
- `portfolio-statement-pdf-utils.js` - Utility functions for filling different sections
- `../pdf-common-utils.js` - Common PDF utilities (text writing, tables, images, etc.)

## Usage

### Basic Example

```javascript
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');

const service = new PortfolioStatementService();

const data = {
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

const pdfBuffer = await service.generatePortfolioStatementPdf(data);
fs.writeFileSync('portfolio-statement.pdf', pdfBuffer);
```

## Document Structure

The Portfolio Statement consists of four main sections:

### 1. Header Section
- Company logo (left side)
- Fund name (centered, large title)
- Registration details (centered)
- Managed by information
- Address, phone, and fax
- Horizontal separator line
- "Investment Statement" title
- Statement date

### 2. Investor Information Section
- Investor's Name
- Registration Number

### 3. Investment Table Section
A comprehensive table with 19 rows showing:
- Fund Deposit
- Dividend Reinvested
- Total Deposit (bold)
- Total Withdrawal
- Units Purchased (Nos)
- CIP Units (Nos)
- Units Surrender (Nos)
- Units Held (Nos) (bold)
- Average Cost Price/Unit
- Investment at Cost
- Current NAV (with date)
- Market Value of Investment (bold)
- Capital Gain (Realized) (a)
- Capital Gain (Unrealized) (b)
- Total Capital Gain (a+b) (bold)
- Dividend Income (c)
- Dividend Receivable (d)
- Total Return (a+b+c+d) (bold)
- Cash Balance

### 4. Footer Section
- Note: "All amounts are in BDT, otherwise mentioned."

## Data Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `fundName` | string | Name of the fund |
| `statementDate` | string | Date of the statement (e.g., "19-10-2025") |
| `investorName` | string | Investor's full name |
| `registrationNo` | string | Registration number |
| `fundDeposit` | string | Fund deposit amount |
| `dividendReinvested` | string | Dividend reinvested amount |
| `totalDeposit` | string | Total deposit amount |
| `totalWithdrawal` | string | Total withdrawal amount |
| `unitsPurchased` | string | Number of units purchased |
| `cipUnits` | string | CIP units |
| `unitsSurrender` | string | Units surrendered |
| `unitsHeld` | string | Units currently held |
| `averageCostPerUnit` | string | Average cost per unit |
| `investmentAtCost` | string | Investment at cost |
| `currentNav` | string | Current NAV value |
| `currentNavDate` | string | NAV date (e.g., "Oct 16, 2025") |
| `marketValue` | string | Market value of investment |
| `capitalGainRealized` | string | Realized capital gain |
| `capitalGainUnrealized` | string | Unrealized capital gain |
| `totalCapitalGain` | string | Total capital gain |
| `dividendIncome` | string | Dividend income |
| `dividendReceivable` | string | Dividend receivable |
| `totalReturn` | string | Total return |
| `cashBalance` | string | Cash balance |

### Optional Fields (with defaults)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `registeredUnder` | string | 'Securities & Exchange Commission (Mutual Fund) Rules, 2001' | Registration authority |
| `managedBy` | string | 'Shanta Asset Management Limited' | Asset manager |
| `address` | string | 'The Glass House (Level 13)...' | Company address |
| `phone` | string | '+88-02-48810551-2' | Contact phone |
| `fax` | string | '+88-02-48810553' | Fax number |

## PDF Specifications

- **Page Size**: A4 (595.28 x 841.89 points)
- **Font**: Helvetica (regular and bold)
- **Logo**: PNG format, positioned at top-left
- **Table**: 2-column layout (label + value) with borders
- **Bold Rows**: Total Deposit, Units Held, Market Value, Total Capital Gain, Total Return

## Features

✓ Professional layout with company branding
✓ Comprehensive investment details table
✓ Bold highlighting for key totals
✓ Precise text positioning and alignment
✓ Table generation with borders
✓ Image embedding (logo)
✓ Clean, readable format
✓ Negative values support (parentheses)

## Dependencies

- `pdf-lib` - PDF creation and manipulation
- `sharp` - Image processing (for logo conversion if needed)

## Notes

- The logo file should be located at `../saml_logo.png` relative to the portfolio-statement folder
- Negative values are typically shown in parentheses (e.g., "(36,463)")
- All amounts are in BDT unless otherwise mentioned
- Bold rows highlight important totals and summary values
