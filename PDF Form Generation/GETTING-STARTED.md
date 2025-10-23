# Getting Started with PDF Form Generation

Welcome! This guide will help you get up and running with the COUA Letter Generator in just a few minutes.

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `pdf-lib` - For PDF creation and manipulation
- `sharp` - For image processing

### 2. Run the Example

```bash
npm start
```

This generates a sample COUA letter with demo data.

### 3. Check the Output

Look for `output-coua-letter.pdf` in the project folder. Open it to see your generated certificate!

## What Just Happened?

The application:
1. ✓ Created a new PDF document (A4 size)
2. ✓ Embedded the company logo
3. ✓ Added header information (date, IDs, registration numbers)
4. ✓ Placed fund details (name, sponsor, manager, etc.)
5. ✓ Generated an investor details table
6. ✓ Added legal disclaimers and contact information
7. ✓ Saved the complete PDF

## Next Steps

### Customize the Data

Edit `index.js` and modify the `sampleData` object:

```javascript
const sampleData = {
  date: '17 January 2024',           // Change to your date
  investorId: 'INV-2024-001',        // Your investor ID
  investorName: 'John Doe',          // Investor name
  // ... modify other fields
};
```

Then run `npm start` again to generate a new PDF with your data.

### Use in Your Application

```javascript
const CouaLetterService = require('./coua-letter/coua-letter-service');
const fs = require('fs');

async function generateLetter() {
  const service = new CouaLetterService();
  
  const data = {
    // Your data here
  };
  
  const pdfBuffer = await service.generateCouaLetterPdf(data);
  fs.writeFileSync('my-letter.pdf', pdfBuffer);
}

generateLetter();
```

### Batch Generation

Generate multiple letters at once:

```javascript
const investors = [
  { investorName: 'John Doe', investorId: 'INV-001', /* ... */ },
  { investorName: 'Jane Smith', investorId: 'INV-002', /* ... */ },
];

for (const investor of investors) {
  const pdfBuffer = await service.generateCouaLetterPdf(investor);
  fs.writeFileSync(`letter-${investor.investorId}.pdf`, pdfBuffer);
}
```

## Project Structure

```
PDF Form Generation/
├── coua-letter/              # COUA letter specific code
│   ├── coua-letter-service.js
│   ├── coua-letter-pdf-utils.js
│   ├── README.md
│   └── API-REFERENCE.md
├── pdf-common-utils.js       # Reusable PDF utilities
├── index.js                  # Example/entry point
├── package.json              # Dependencies
├── saml_logo.png            # Company logo
└── README.md                # Main documentation
```

## Common Tasks

### Change the Logo

Replace `saml_logo.png` with your logo (JPEG or PNG format).

### Modify Layout

Edit `coua-letter/coua-letter-pdf-utils.js`:
- `fillUpTopInfo()` - Header section
- `fillUpMiddleTableInfo()` - Table section
- `fillUpBottomNoteInfo()` - Footer section

### Adjust Coordinates

All positioning uses x,y coordinates (bottom-left origin):
- X increases from left to right
- Y increases from bottom to top
- Page size: 595.28 x 841.89 points (A4)

### Change Fonts

Currently uses Helvetica (regular and bold). To use different fonts, modify the font embedding in the service files.

## Troubleshooting

### Logo Not Showing

**Problem**: Logo doesn't appear in the PDF  
**Solution**: Ensure `saml_logo.png` exists in the project root

### Text Overlapping

**Problem**: Text overlaps or doesn't fit  
**Solution**: Adjust coordinates in `coua-letter-pdf-utils.js` or reduce font sizes

### Missing Dependencies

**Problem**: Error about missing modules  
**Solution**: Run `npm install` again

### PDF Generation Fails

**Problem**: Error during PDF generation  
**Solution**: Check that all required data fields are provided

## Need Help?

- **Full Documentation**: See `README.md`
- **API Reference**: See `coua-letter/API-REFERENCE.md`
- **Feature Details**: See `coua-letter/README.md`

## Example Output

The generated COUA letter includes:

1. **Header**
   - Company logo
   - Date, Investor ID, Registration Number, Unit Allocation No.

2. **Fund Information**
   - Fund name (large title)
   - Registration details
   - Sponsor, Asset Manager, Trustee, Custodian

3. **Investor Details Table**
   - Investor's Name
   - NID Number
   - Father's Name
   - Number of Units
   - Average Buy Price
   - Total Investment Value

4. **Legal Notes**
   - Confidentiality disclaimer
   - Contact information

## Tips

✓ **Test First**: Always test with sample data before production use  
✓ **Validate Data**: Ensure all required fields are provided  
✓ **Check Output**: Review generated PDFs for accuracy  
✓ **Backup Logo**: Keep a backup of your logo file  
✓ **Version Control**: Use git to track changes to coordinates and layouts

## What's Next?

Now that you have the basics working, you can:

1. Integrate with your database or API
2. Add validation for input data
3. Customize the layout and styling
4. Add more certificate types
5. Implement batch processing
6. Add email delivery functionality

Happy generating! 🎉
