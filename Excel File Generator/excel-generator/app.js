const ExcelJS = require('exceljs');
const fs = require('fs');

async function generateExcel(excelData) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Set column widths
  worksheet.columns = [
    { key: 'A', width: 30 }, // Credit Account No
    { key: 'B', width: 30 }, // Debit A/C No.
    { key: 'C', width: 30 }, // Debit A/c Name
    { key: 'D', width: 20 }, // Value Date
    { key: 'E', width: 20 }, // Routing No.
    { key: 'F', width: 20 }, // Reference
    { key: 'G', width: 20 }, // Amount
    { key: 'H', width: 30 }, // Particulars
  ];

  // Add header row
  const headerRow = worksheet.addRow([
    'Credit Account No',
    'Debit A/C No.',
    'Debit A/c Name',
    'Value Date',
    'Routing No.',
    'Reference',
    'Amount',
    'Particulars',
  ]);

  // Style header row
  headerRow.eachCell((cell) => {
    cell.font = {
      name: 'Calibri',
      size: 14,
      bold: true,
      color: { argb: '000000' }, // Black text
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
  });

  // Set header row height
  headerRow.height = 20;

  // Add data rows
  excelData.forEach((data) => {
    const formatValue = (value) => {
      if (typeof value === 'string' && /^\d/.test(value)) {
        return `'${value}`;
      }
      return value;
    };

    const row = worksheet.addRow([
      formatValue('2130949401'),
      formatValue(data.debit_account_number),
      data.debit_account_name,
      data.value_date,
      formatValue(data.routing_number),
      data.reference_id,
      formatValue(data.amount),
      data.particulars,
    ]);

    // Style data rows
    row.eachCell((cell) => {
      cell.font = {
        name: 'Calibri (Body)',
        size: 11,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
    row.height = 15;
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// Sample data
const excelData = [
  {
    debit_account_number: '1234567890',
    debit_account_name: 'John Doe',
    value_date: '2023-10-01',
    routing_number: '123456',
    reference_id: 'REF001',
    amount: '1000.00',
    particulars: 'Payment for services',
  },
  {
    debit_account_number: '0987654321',
    debit_account_name: 'Jane Smith',
    value_date: '2023-10-02',
    routing_number: '654321',
    reference_id: 'REF002',
    amount: '500.00',
    particulars: 'Refund',
  },
];

(async () => {
  try {
    const buffer = await generateExcel(excelData);
    fs.writeFileSync('final_done.xlsx', buffer);
    console.log('Excel file generated: final_done.xlsx');
  } catch (error) {
    console.error('Error generating Excel file:', error);
  }
})();