import { IsArray, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcelRowDto {
  @IsString()
  debit_account_number: string;

  @IsString()
  debit_account_name: string;

  @IsString()
  value_date: string;

  @IsString()
  routing_number: string;

  @IsString()
  reference_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  particulars: string;
}

export class GenerateExcelDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExcelRowDto)
  data: ExcelRowDto[];

  @IsOptional()
  @IsString()
  sheetName?: string;

  @IsOptional()
  @IsString()
  creditAccountNo?: string;
}

export class GenerateCustomExcelDto {
  @IsArray()
  data: any[][];

  @IsArray()
  @IsString({ each: true })
  headers: string[];

  @IsOptional()
  @IsString()
  sheetName?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  columnWidths?: number[];
}