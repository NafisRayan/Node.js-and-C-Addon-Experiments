import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { ExcelService } from './excel.service';
import { GenerateExcelDto, GenerateCustomExcelDto } from './dto/generate-excel.dto';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('generate')
  async generateExcel(
    @Body() generateExcelDto: GenerateExcelDto,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.excelService.generateExcel(
        generateExcelDto.data,
        {
          sheetName: generateExcelDto.sheetName,
          creditAccountNo: generateExcelDto.creditAccountNo,
        },
      );

      const filename = `excel-export-${Date.now()}.xlsx`;

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      throw new HttpException(
        'Failed to generate Excel file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-custom')
  async generateCustomExcel(
    @Body() generateCustomExcelDto: GenerateCustomExcelDto,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.excelService.generateCustomExcel(
        generateCustomExcelDto.data,
        generateCustomExcelDto.headers,
        {
          sheetName: generateCustomExcelDto.sheetName,
          columnWidths: generateCustomExcelDto.columnWidths,
        },
      );

      const filename = `custom-excel-export-${Date.now()}.xlsx`;

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      throw new HttpException(
        'Failed to generate custom Excel file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sample-data')
  getSampleData() {
    return {
      message: 'Sample data for Excel generation',
      samplePayload: {
        data: [
          {
            debit_account_number: '1234567890',
            debit_account_name: 'John Doe Account',
            value_date: '2024-01-15',
            routing_number: 'RT001',
            reference_id: 'REF001',
            amount: 1000.50,
            particulars: 'Payment for services',
          },
          {
            debit_account_number: '0987654321',
            debit_account_name: 'Jane Smith Account',
            value_date: '2024-01-16',
            routing_number: 'RT002',
            reference_id: 'REF002',
            amount: 2500.75,
            particulars: 'Monthly subscription',
          },
        ],
        sheetName: 'Financial Report',
        creditAccountNo: '2130949401',
      },
      customSamplePayload: {
        data: [
          ['John Doe', 25, 'Engineer', 75000],
          ['Jane Smith', 30, 'Manager', 85000],
          ['Bob Johnson', 28, 'Developer', 70000],
        ],
        headers: ['Name', 'Age', 'Position', 'Salary'],
        sheetName: 'Employee Data',
        columnWidths: [20, 10, 15, 15],
      },
    };
  }
}