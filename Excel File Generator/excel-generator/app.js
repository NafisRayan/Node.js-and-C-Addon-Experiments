// safe-quotePrefix-export.js
const ExcelJS = require('exceljs');
const JSZip = require('jszip');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const fs = require('fs');

async function exportBankDataWithQuotePrefix() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Bank Data');

  ws.columns = [
    { header: 'Name',            key: 'name',    width: 18 },
    { header: 'Account Number',  key: 'account', width: 22 },
    { header: 'Routing Number',  key: 'routing', width: 18 },
    { header: 'Amount',          key: 'amount',  width: 16 },
  ];

  const rows = [
    { name: 'Alice', account: '001234567890', routing: '021000021', amount: '1234.00' },
    { name: 'Bob',   account: '000045678901', routing: '026009593', amount: '9999999999999999.99' },
    { name: 'Carol', account: '123456789',    routing: '111000025', amount: '45.67' },
  ];

  // Header
  ws.addRow(['Name', 'Account Number', 'Routing Number', 'Amount']).font = { bold: true };

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
  const zip = await JSZip.loadAsync(buffer);
  const stylesPath = 'xl/styles.xml';
  const stylesXml = await zip.file(stylesPath).async('string');

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '' });

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
  const patchedStylesXml = builder.build(styles);
  zip.file(stylesPath, patchedStylesXml);

  // Write final XLSX
  const finalBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('bank-data-text-with-quotePrefix.xlsx', finalBuffer);

  console.log('✅ bank-data-text-with-quotePrefix.xlsx written');
}

exportBankDataWithQuotePrefix().catch(console.error);