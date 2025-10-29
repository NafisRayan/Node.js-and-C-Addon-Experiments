# Excel Generator

A Node.js application that generates Excel files with bank data, specifically designed to handle text-formatted cells with quote prefix functionality for proper Excel display.

## Description

This project creates an Excel workbook containing sample bank data (name, account number, routing number, amount) and applies special formatting to ensure that account and routing numbers are treated as text in Excel. It uses a custom XML manipulation technique to add the `quotePrefix` attribute to text-formatted cells, which causes Excel to display an apostrophe (') in the formula bar while keeping the cell value as text.

The application leverages:
- **ExcelJS**: For creating and manipulating Excel workbooks
- **JSZip**: For treating Excel files as ZIP archives and modifying internal XML files
- **fast-xml-parser**: For parsing and rebuilding XML structures safely

## Features

- Generates Excel files with predefined bank data columns
- Applies text formatting to account and routing number columns
- Modifies Excel styles XML to add quotePrefix for proper text display
- Outputs a ready-to-use Excel file (Output.xlsx)

## Requirements

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

Run the application using Node.js:

```bash
node app.js
```

This will generate an `Output.xlsx` file in the current directory containing the bank data with proper text formatting.

## Dependencies

- `exceljs` (^4.4.0): Excel file creation and manipulation
- `fast-xml-parser` (^5.3.0): Fast XML parsing and building
- `jszip` (^3.10.1): ZIP file handling for Excel manipulation

## How It Works

1. Creates a new Excel workbook with a "Bank Data" worksheet
2. Defines columns for Name, Account Number, Routing Number, and Amount
3. Adds sample data rows
4. Sets text number format (@) on account, routing, and amount columns
5. Writes the workbook to a buffer
6. Loads the buffer as a ZIP archive using JSZip
7. Parses the `xl/styles.xml` file using fast-xml-parser
8. Modifies text-formatted cell styles to include `quotePrefix="1"` and `applyNumberFormat="1"`
9. Rebuilds the XML and updates the ZIP archive
10. Saves the final Excel file

## Output

The generated `Output.xlsx` file will contain:
- Bold header row
- Sample bank data with 3 entries
- Account and routing numbers displayed as text with quote prefix
- Properly formatted Excel file ready for use

## License

ISC