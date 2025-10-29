# NestJS Excel Generator

A complete NestJS application for generating Excel files using ExcelJS library.

## Features

- Generate Excel files with predefined format (based on your reference code)
- Generate custom Excel files with flexible data structure
- Styled headers and data rows with borders and formatting
- RESTful API endpoints for Excel generation
- TypeScript support with proper interfaces and DTOs
- Sample data endpoints for testing

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

The application will be available at `http://localhost:3000`

## API Endpoints

### 1. Generate Standard Excel File

**POST** `/excel/generate`

Generate an Excel file using the predefined format from your reference code.

**Request Body:**
```json
{
  "data": [
    {
      "debit_account_number": "1234567890",
      "debit_account_name": "John Doe Account",
      "value_date": "2024-01-15",
      "routing_number": "RT001",
      "reference_id": "REF001",
      "amount": 1000.50,
      "particulars": "Payment for services"
    }
  ],
  "sheetName": "Financial Report",
  "creditAccountNo": "2130949401"
}
```

### 2. Generate Custom Excel File

**POST** `/excel/generate-custom`

Generate a custom Excel file with flexible data structure.

**Request Body:**
```json
{
  "data": [
    ["John Doe", 25, "Engineer", 75000],
    ["Jane Smith", 30, "Manager", 85000]
  ],
  "headers": ["Name", "Age", "Position", "Salary"],
  "sheetName": "Employee Data",
  "columnWidths": [20, 10, 15, 15]
}
```

### 3. Get Sample Data

**GET** `/excel/sample-data`

Returns sample payloads for both endpoints to help with testing.

## Usage Examples

### Using curl:

```bash
# Generate standard Excel
curl -X POST http://localhost:3000/excel/generate \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "debit_account_number": "1234567890",
        "debit_account_name": "John Doe Account",
        "value_date": "2024-01-15",
        "routing_number": "RT001",
        "reference_id": "REF001",
        "amount": 1000.50,
        "particulars": "Payment for services"
      }
    ]
  }' \
  --output report.xlsx

# Get sample data
curl http://localhost:3000/excel/sample-data
```

## Project Structure

```
src/
├── excel/
│   ├── dto/
│   │   └── generate-excel.dto.ts     # Data transfer objects
│   ├── interfaces/
│   │   └── excel-data.interface.ts   # TypeScript interfaces
│   ├── excel.controller.ts           # REST API endpoints
│   ├── excel.service.ts              # Excel generation logic
│   └── excel.module.ts               # NestJS module
├── app.module.ts                     # Main application module
└── main.ts                           # Application entry point
```

## Features Included

- **Styled Headers**: Bold, centered headers with borders
- **Formatted Data**: Properly aligned data cells with borders
- **Column Width Management**: Configurable column widths
- **Multiple Sheet Support**: Custom sheet names
- **Flexible Data Input**: Support for both structured and custom data
- **Buffer Response**: Returns Excel files as downloadable buffers
- **Error Handling**: Proper HTTP error responses
- **TypeScript**: Full type safety with interfaces and DTOs

## Dependencies

- `@nestjs/common`: NestJS core functionality
- `@nestjs/core`: NestJS core module
- `@nestjs/platform-express`: Express platform adapter
- `exceljs`: Excel file generation library
- `reflect-metadata`: Metadata reflection for decorators
- `rxjs`: Reactive extensions for JavaScript

The Excel service replicates the exact formatting and styling from your reference code while providing a clean, modular NestJS architecture.