export interface ExcelRowData {
  debit_account_number: string;
  debit_account_name: string;
  value_date: string;
  routing_number: string;
  reference_id: string;
  amount: number;
  particulars: string;
}

export interface ExcelColumn {
  key: string;
  width: number;
  header: string;
}

export interface ExcelGenerationOptions {
  sheetName?: string;
  creditAccountNo?: string;
  headerStyle?: {
    font?: any;
    alignment?: any;
    border?: any;
    fill?: any;
  };
  dataStyle?: {
    font?: any;
    alignment?: any;
    border?: any;
  };
}