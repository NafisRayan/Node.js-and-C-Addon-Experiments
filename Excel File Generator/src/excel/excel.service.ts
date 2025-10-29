import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelRowData, ExcelColumn, ExcelGenerationOptions } from './interfaces/excel-data.interface';

@Injectable()
export class ExcelService {
  private readonly defaultColumns: ExcelColumn[] = [
    { key: 'A', width: 30, header: 'Credit Account No' },
    { key: 'B', width: 30, header: 'Debit A/C No.' },
    { key: 'C', width: 30, header: 'Debit A/c Name' },
    { key: 'D', width: 20, header: 'Value Date' },
    { key: 'E', width: 20, header: 'Routing No.' },
    { key: 'F', width: 20, header: 'Reference' },
    { key: 'G', width: 20, header: 'Amount' },
    { key: 'H', width: 30, header: 'Particulars' },
  ];

  async generateExcel(
    excelData: ExcelRowData[],
    options: ExcelGenerationOptions = {},
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(options.sheetName || 'Sheet1');

    // Set column widths
    worksheet.columns = this.defaultColumns.map(col => ({
      key: col.key,
      width: col.width,
    }));

    // Add header row
    const headerRow = worksheet.addRow(
      this.defaultColumns.map(col => col.header)
    );

    // Apply header styling
    this.styleHeaderRow(headerRow, options.headerStyle);

    // Add data rows
    excelData.forEach((data) => {
      const row = worksheet.addRow([
        options.creditAccountNo || '2130949401',
        data.debit_account_number,
        data.debit_account_name,
        data.value_date,
        data.routing_number,
        data.reference_id,
        data.amount,
        data.particulars,
      ]);

      // Apply data row styling
      this.styleDataRow(row, options.dataStyle);
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private styleHeaderRow(headerRow: ExcelJS.Row, customStyle?: any): void {
    const defaultStyle = {
      font: {
        name: 'Calibri',
        size: 14,
        bold: true,
        color: { argb: '000000' },
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      },
    };

    const style = { ...defaultStyle, ...customStyle };

    headerRow.eachCell((cell) => {
      cell.font = style.font;
      cell.alignment = style.alignment;
      cell.border = style.border;
      if (style.fill) {
        cell.fill = style.fill;
      }
      cell.numFmt = '@'; // text format
    });

    headerRow.height = 20;
  }

  private styleDataRow(row: ExcelJS.Row, customStyle?: any): void {
    const defaultStyle = {
      font: {
        name: 'Calibri (Body)',
        size: 11,
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
      },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      },
    };

    const style = { ...defaultStyle, ...customStyle };

    row.eachCell((cell) => {
      cell.font = style.font;
      cell.alignment = style.alignment;
      cell.border = style.border;
    });

    row.height = 15;
    row.numFmt = '@'; // text format
  }

  async generateCustomExcel(
    data: any[][],
    headers: string[],
    options: {
      sheetName?: string;
      columnWidths?: number[];
      headerStyle?: any;
      dataStyle?: any;
    } = {},
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(options.sheetName || 'Sheet1');

    // Set column widths
    if (options.columnWidths) {
      worksheet.columns = options.columnWidths.map((width, index) => ({
        key: String.fromCharCode(65 + index), // A, B, C, etc.
        width,
      }));
    }

    // Add header row
    const headerRow = worksheet.addRow(headers);
    this.styleHeaderRow(headerRow, options.headerStyle);

    // Add data rows
    data.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      this.styleDataRow(row, options.dataStyle);
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}