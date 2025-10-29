// safe-quotePrefix-export.js
const ExcelJS = require('exceljs');


// JSZip: A JavaScript library for creating, reading, and editing .zip files in memory.
// In this code, JSZip is used to treat the Excel file (which is a ZIP archive containing XML files)
// as a zip container. It allows loading the Excel buffer, extracting specific XML files like 'xl/styles.xml',
// modifying them, and then regenerating the zip archive back into a buffer for saving.
// This is essential because Excel files (.xlsx) are essentially ZIP archives with structured XML content.
const JSZip = require('jszip');


// fast-xml-parser: A fast and efficient XML parser and builder for JavaScript.
// XMLParser converts XML strings into JavaScript objects for easy manipulation.
// XMLBuilder converts JavaScript objects back into XML strings.
// In this code, they are used to parse the 'xl/styles.xml' file from the Excel workbook into a manipulable object,
// modify the XML structure to add 'quotePrefix' attributes to text-formatted cells,
// and then rebuild the XML string to write back into the zip archive.
// This approach avoids using regex on XML (which can be error-prone) and ensures proper XML structure.
const { XMLParser, XMLBuilder } = require('fast-xml-parser');


const fs = require('fs');

async function exportBankDataWithQuotePrefix() {
  // ExcelJS: Create workbook, worksheet, columns, and add data
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Bank Data');

  ws.columns = [
    { header: 'Name',            key: 'name',    width: 18 },
    { header: 'Account Number',  key: 'account', width: 22 },
    { header: 'Routing Number',  key: 'routing', width: 18 },
    { header: 'Amount',          key: 'amount',  width: 16 },
  ];

  // Make header row bold
  ws.getRow(1).font = { bold: true };

  const rows = [
    { name: 'Alice', account: '001234567890', routing: '021000021', amount: '1234.00' },
    { name: 'Bob',   account: '000045678901', routing: '026009593', amount: '9999999999999999.99' },
    { name: 'Carol', account: '123456789',    routing: '111000025', amount: '45.67' },
  ];

  // Add data rows as plain strings and set TEXT number format on B,C,D
  rows.forEach(r => {
    const row = ws.addRow([r.name, r.account, r.routing, r.amount]);
    ['B', 'C', 'D'].forEach(col => {
      const cell = ws.getCell(`${col}${row.number}`);
      cell.numFmt = '@'; // Text format; keeps value as text
    });
  });

  // Write to buffer (no streaming, so styles are present)
  const buffer = await wb.xlsx.writeBuffer();

  // Patch ONLY xl/styles.xml using a real XML parser (no regex on XML structure)
  // Load the Excel buffer as a JSZip object. This treats the Excel file as a zip archive,
  // allowing access to individual XML files within it for modification.
  const zip = await JSZip.loadAsync(buffer);
  const stylesPath = 'xl/styles.xml';
  // Extract the styles.xml file content as a string from the zip archive.
  const stylesXml = await zip.file(stylesPath).async('string');

  // Create XMLParser and XMLBuilder instances with options:
  // - ignoreAttributes: false means attributes are included in the parsed object
  // - attributeNamePrefix: '' means attribute names are not prefixed (e.g., 'id' instead of '@id')
  // This configuration makes the parsed XML easier to manipulate as a JavaScript object.
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '' });

  // Parse the styles.xml string into a JavaScript object. This converts the XML structure
  // into a nested object where XML elements become object properties and attributes become
  // object keys, allowing for programmatic modification of the Excel styles.
  const styles = parser.parse(stylesXml);

  // Build a map of numFmtId -> formatCode for custom formats (if any)
  const numFmtCode = new Map();
  const numFmts = styles?.styleSheet?.numFmts?.numFmt;
  if (numFmts) {
    const list = Array.isArray(numFmts) ? numFmts : [numFmts];
    for (const n of list) {
      if (n.numFmtId != null && n.formatCode != null) {
        numFmtCode.set(String(n.numFmtId), String(n.formatCode));
      }
    }
  }

  // Get the cell formats array (<cellXfs><xf .../>)
  const cellXfs = styles?.styleSheet?.cellXfs;
  let xfs = cellXfs?.xf ? cellXfs.xf : [];
  if (!Array.isArray(xfs)) xfs = [xfs];

  // Modify existing XFs that represent TEXT cells:
  // - built-in Text numFmtId = "49" OR
  // - custom numFmt whose formatCode is "@"
  for (const xf of xfs) {
    const id = xf.numFmtId ? String(xf.numFmtId) : null;
    const code = id ? numFmtCode.get(id) : null;

    const isTextFormat = (id === '49') || (code === '@');
    if (isTextFormat) {
      // Ensure Excel applies number format + show apostrophe in formula bar
      xf.applyNumberFormat = '1';
      xf.quotePrefix = '1';
    }
  }

  // IMPORTANT: update the count attribute to match the actual number of xf entries
  if (styles?.styleSheet?.cellXfs) {
    styles.styleSheet.cellXfs.xf = xfs;
    styles.styleSheet.cellXfs.count = String(xfs.length);
  }

  // Rebuild styles.xml and write back to zip; do NOT touch any worksheet XML
  // Convert the modified styles JavaScript object back into an XML string.
  // This rebuilds the XML with all the changes made to the object, ensuring proper XML formatting.
  const patchedStylesXml = builder.build(styles);
  // Replace the original styles.xml file in the zip archive with the patched XML string.
  // This updates the Excel file's style definitions without modifying other files in the archive.
  zip.file(stylesPath, patchedStylesXml);

  // fs: Write the final Excel file
  // Generate a new Node.js Buffer from the modified JSZip object.
  // This creates the complete Excel file as a binary buffer that can be written to disk.
  const finalBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('Output.xlsx', finalBuffer);

  console.log('✅ Output.xlsx written');
}

exportBankDataWithQuotePrefix().catch(console.error);