# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-10-23

### Added
- **Portfolio Statement Generator** - New module for generating Investment Portfolio Statements
  - `portfolio-statement/portfolio-statement-service.js` - Main service class
  - `portfolio-statement/portfolio-statement-pdf-utils.js` - Utility functions
  - `portfolio-statement/README.md` - Feature documentation
  - `portfolio-statement/API-REFERENCE.md` - Complete API reference
  - `index-portfolio-statement.js` - Entry point with sample data
  - `npm run portfolio` script for quick generation

### Enhanced
- **Documentation**
  - Added `DOCUMENT-TYPES.md` - Comprehensive comparison guide for both document types
  - Updated `README.md` to include both COUA letter and Portfolio Statement
  - Updated `GETTING-STARTED.md` with examples for both document types
  - Updated `PROJECT-SUMMARY.md` to reflect new module
  - Added `CHANGELOG.md` to track project changes

### Features
- 19-row comprehensive investment table
- Bold highlighting for key totals (Total Deposit, Units Held, Market Value, Total Capital Gain, Total Return)
- Support for negative values with parentheses notation
- Professional header with fund information
- Investor information section
- Currency disclaimer footer
- Reuses existing `pdf-common-utils.js` for consistency

### Technical Details
- Page Size: A4 (595.28 x 841.89 points)
- Fonts: Helvetica (regular and bold)
- Table: 2-column layout (380pt label + 100pt value)
- Row Height: 20 points
- Font Size: 9 points for table, 8.5-16 points for headers

---

## [1.0.0] - 2025-10-23

### Initial Release
- **COUA Letter Generator** - Certificate of Unit Allocation document generation
  - `coua-letter/coua-letter-service.js` - Main service class
  - `coua-letter/coua-letter-pdf-utils.js` - Utility functions
  - `coua-letter/README.md` - Feature documentation
  - `coua-letter/API-REFERENCE.md` - Complete API reference
  - `index.js` - Entry point with sample data

### Core Features
- PDF generation from scratch (no templates)
- Precise text positioning with alignment options
- Multi-line justified text with automatic line breaking
- Table generation with customizable styling
- Image embedding with automatic format conversion
- Bold and regular font mixing
- Professional layout with company branding
- Legal disclaimers and contact information
- System-generated (no signature required)

### Common Utilities
- `pdf-common-utils.js` - Reusable PDF utilities
  - `writeText()` - Text with alignment
  - `writeMultiLineText()` - Multi-line justified text
  - `embedAndDrawImage()` - Image embedding
  - `writeLabelAndValuePair()` - Label-value pairs
  - `drawTable()` - Table generation

### Dependencies
- `pdf-lib` ^1.17.1 - PDF creation and manipulation
- `sharp` ^0.33.0 - Image processing

### Documentation
- `README.md` - Main project documentation
- `GETTING-STARTED.md` - Quick start guide
- `PROJECT-SUMMARY.md` - Project overview

### NPM Scripts
- `npm start` - Generate COUA letter with sample data
- `npm run generate` - Alias for npm start

---

## Version History Summary

| Version | Date | Description |
|---------|------|-------------|
| 1.1.0 | 2025-10-23 | Added Portfolio Statement generator |
| 1.0.0 | 2025-10-23 | Initial release with COUA letter generator |

---

## Upgrade Guide

### From 1.0.0 to 1.1.0

No breaking changes. The Portfolio Statement module is completely independent and doesn't affect existing COUA letter functionality.

**New Features Available:**
```javascript
// New Portfolio Statement Service
const PortfolioStatementService = require('./portfolio-statement/portfolio-statement-service');
const service = new PortfolioStatementService();
const pdf = await service.generatePortfolioStatementPdf(data);
```

**New NPM Script:**
```bash
npm run portfolio
```

**Existing Code:**
All existing COUA letter code continues to work without any changes.

---

## Future Roadmap

### Planned Features
- [ ] Additional document types (transaction statements, tax reports)
- [ ] Multi-page support for large datasets
- [ ] Custom styling/theming options
- [ ] PDF merging utilities
- [ ] Batch generation optimization
- [ ] Email delivery integration
- [ ] Database integration examples
- [ ] REST API wrapper
- [ ] Unit tests
- [ ] Performance benchmarks

### Under Consideration
- [ ] TypeScript type definitions
- [ ] React/Vue component wrappers
- [ ] Cloud storage integration
- [ ] Digital signature support
- [ ] Internationalization (i18n)
- [ ] Custom font support
- [ ] Watermark support
- [ ] QR code generation

---

## Contributing

When contributing, please:
1. Update this CHANGELOG.md with your changes
2. Follow the existing code structure
3. Add documentation for new features
4. Include sample data in index files
5. Test PDF generation before submitting

---

## Support

For issues, questions, or feature requests, please contact the development team.
