# Document Types Reference

This application supports two types of fund documents:

## 1. COUA Letter (Certificate of Unit Allocation)

### Purpose
Formal certificate confirming unit allocation for fund investors.

### When to Use
- After initial unit allocation
- When units are allocated to new investors
- For official confirmation of unit holdings

### Key Features
- Legal certificate with disclaimer
- System-generated (no signature required)
- Includes fund sponsor, manager, trustee, custodian details
- 6-row investor details table

### Entry Point
```bash
npm start
# or
node index.js
```

### Output
`output-coua-letter.pdf`

### Sample Data Structure
```javascript
{
  // Header
  date: '17 January 2024',
  investorId: 'INV-2024-001',
  regNumber: 'REG-2024-001',
  unitAllocationNo: 'UA-2024-001',
  
  // Fund
  fundName: 'Shanta Asset Securitization Fund',
  fundRegNo: '001234567890',
  fundSponsor: 'Shanta Securities Limited',
  fundAssetManager: 'Shanta Asset Management Limited',
  fundTrustee: 'IDLC Finance Limited',
  fundCustodian: 'Standard Chartered Bank',
  
  // Investor
  investorName: 'John Doe',
  investorNid: '1234567890123',
  investorFatherName: 'Robert Doe',
  numberOfUnits: '1,000',
  averageBuyPrice: '12.50',
  totalInvestmentValue: 'BDT 12,500.00',
}
```

### Documentation
- `coua-letter/README.md` - Features and usage
- `coua-letter/API-REFERENCE.md` - Complete API documentation

---

## 2. Portfolio Statement (Investment Statement)

### Purpose
Comprehensive investment report showing holdings, returns, and capital gains.

### When to Use
- Periodic investor reporting (monthly, quarterly, annual)
- On-demand investor statements
- Portfolio performance tracking
- Tax reporting purposes

### Key Features
- Comprehensive 19-row investment table
- Bold highlighting for key totals
- Deposits, withdrawals, units, NAV, gains, returns
- Current market value and cash balance

### Entry Point
```bash
npm run portfolio
# or
node index-portfolio-statement.js
```

### Output
`output-portfolio-statement.pdf`

### Sample Data Structure
```javascript
{
  // Fund
  fundName: 'Shanta Amanah Shariah Fund',
  statementDate: '19-10-2025',
  
  // Investor
  investorName: 'Md. Samiul Alim',
  registrationNo: '022002128-1',
  
  // Investment Details (19 fields)
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
}
```

### Documentation
- `portfolio-statement/README.md` - Features and usage
- `portfolio-statement/API-REFERENCE.md` - Complete API documentation

---

## Comparison

| Feature | COUA Letter | Portfolio Statement |
|---------|-------------|---------------------|
| **Purpose** | Unit allocation certificate | Investment performance report |
| **Frequency** | One-time per allocation | Periodic (monthly/quarterly) |
| **Data Points** | 16 required fields | 24 required fields |
| **Table Rows** | 6 rows | 19 rows |
| **Legal Status** | Official certificate | Informational statement |
| **Signature** | Not required (system-generated) | Not required |
| **Key Info** | Unit allocation details | Investment performance & returns |
| **Bold Rows** | None | 5 key totals |
| **Footer** | Legal disclaimer + contact | Currency disclaimer |

---

## Common Features

Both document types share:

✓ Professional layout with company branding  
✓ Company logo embedding  
✓ A4 page size (595.28 x 841.89 points)  
✓ Helvetica fonts (regular and bold)  
✓ Precise text positioning  
✓ Table generation with borders  
✓ Clean, readable format  
✓ BDT currency (Bangladesh Taka)  

---

## Integration Patterns

### Single Document Generation

```javascript
// COUA Letter
const couaService = new CouaLetterService();
const couaPdf = await couaService.generateCouaLetterPdf(couaData);

// Portfolio Statement
const portfolioService = new PortfolioStatementService();
const portfolioPdf = await portfolioService.generatePortfolioStatementPdf(portfolioData);
```

### Batch Generation

```javascript
// Generate both documents for an investor
async function generateInvestorDocuments(investorData) {
  const couaService = new CouaLetterService();
  const portfolioService = new PortfolioStatementService();
  
  // Generate COUA letter
  const couaPdf = await couaService.generateCouaLetterPdf({
    date: investorData.allocationDate,
    investorId: investorData.id,
    investorName: investorData.name,
    // ... more COUA fields
  });
  
  // Generate portfolio statement
  const portfolioPdf = await portfolioService.generatePortfolioStatementPdf({
    statementDate: investorData.statementDate,
    investorName: investorData.name,
    registrationNo: investorData.regNo,
    // ... more portfolio fields
  });
  
  return { couaPdf, portfolioPdf };
}
```

### API Endpoint Example

```javascript
// Express.js endpoints
app.post('/api/documents/coua', async (req, res) => {
  const service = new CouaLetterService();
  const pdf = await service.generateCouaLetterPdf(req.body);
  res.contentType('application/pdf').send(pdf);
});

app.post('/api/documents/portfolio', async (req, res) => {
  const service = new PortfolioStatementService();
  const pdf = await service.generatePortfolioStatementPdf(req.body);
  res.contentType('application/pdf').send(pdf);
});
```

---

## Value Formatting Guidelines

### Numbers
- Use comma separators: `"200,000"`
- Decimals: `"11.7819"`
- No currency symbols in values (mentioned in labels)

### Negative Values
- Use parentheses: `"(36,463)"`
- Not minus signs: ~~`"-36,463"`~~

### Dates
- COUA Letter: `"17 January 2024"` (DD Month YYYY)
- Portfolio Statement: `"19-10-2025"` (DD-MM-YYYY)
- NAV Date: `"Oct 16, 2025"` (Month DD, YYYY)

### Currency
- All amounts in BDT (Bangladesh Taka)
- Mentioned in footer/labels, not in values

---

## Choosing the Right Document

**Use COUA Letter when:**
- Confirming new unit allocations
- Providing official allocation certificates
- Investor requests allocation confirmation
- Legal documentation required

**Use Portfolio Statement when:**
- Providing periodic performance reports
- Investor requests current holdings
- Tax reporting season
- Portfolio review meetings
- Showing investment returns and gains

**Generate Both when:**
- Onboarding new investors (COUA first, then statement)
- Quarterly reporting (statement) with new allocations (COUA)
- Comprehensive investor packages

---

## Support

For detailed information:
- See individual README files in each module folder
- Check API-REFERENCE.md for complete API documentation
- Review sample data in index files
