# Node.js PDF Form Fillup Application

A comprehensive Node.js application for automatically filling PDF forms for investor registrations, supporting both individual and institutional investors. This project evolved from a simple individual form filler to a dual-form system with precise coordinate-based text placement and image embedding capabilities.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
  - [Individual Form](#individual-form)
  - [Institution Form](#institution-form)
- [Field Mappings](#field-mappings)
  - [Individual Form Fields](#individual-form-fields)
  - [Institution Form Fields](#institution-form-fields)
- [Using the Position Finder Tool](#using-the-position-finder-tool)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Development History](#development-history)
- [Contributing](#contributing)
- [License](#license)

## Description

This application was built to automate the filling of PDF forms for the SASF (Shanta Asset Securitization Fund) investor registration process. It started with support for individual investors and was expanded to include institutional investors. The system uses coordinate-based positioning to place text and images accurately on PDF templates, ensuring professional and precise form completion.

The project utilizes `pdf-lib` for PDF manipulation and `sharp` for image processing, allowing seamless embedding of photos and signatures in JPEG or PNG formats.

## Features

- **Dual Form Support**: Handles both individual and institutional investor forms
- **Coordinate-Based Placement**: Precise text positioning using x,y coordinates
- **Image Embedding**: Supports JPEG/PNG images for photos and signatures with automatic format conversion
- **Multi-Page Support**: Institution forms span multiple pages
- **Flexible Data Input**: JSON-based data structures for easy customization
- **Position Finder Tool**: Interactive HTML tool for determining PDF coordinates
- **Error Handling**: Robust error handling for missing templates and invalid images
- **Modular Architecture**: Separate service classes for different form types

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- PDF templates placed in the correct directory structure

## Installation

1. Clone or download the project files to your local machine.

2. Navigate to the project directory:
   ```bash
   cd "c:\Users\BS00861\Documents\Test\Node.js PDF Form Fillup"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create the template directory structure:
   ```
   templates/
     investor-forms/
       SASF-Individual-form.pdf
       SASF-Institution-form.pdf
   ```

5. Place your PDF templates in the `templates/investor-forms/` folder with the exact names specified.

## Project Structure

```
Node.js PDF Form Fillup/
├── SASF-Individual-form.js          # Service class for individual form PDF generation
├── index.js                         # Entry point for individual form with sample data
├── SASF-Institution-form.js         # Service class for institution form PDF generation
├── index-institution.js             # Entry point for institution form with sample data
├── PDF_PositionFinder.html          # Interactive tool for finding PDF coordinates
├── package.json                     # Project dependencies and scripts
├── README.md                        # This documentation file
├── Joint Applicant.json             # Coordinate mappings for joint applicant fields
├── Nominee.json                     # Coordinate mappings for nominee fields
└── templates/
    └── investor-forms/
        ├── SASF-Individual-form.pdf # Individual investor form template
        └── SASF-Institution-form.pdf # Institution investor form template
```

## Usage

### Individual Form

1. Edit the `sampleData` object in `index.js` with your investor data:
   ```javascript
   const sampleData = {
     templateName: 'SASF-Individual',
     registrationNumber: '123456',
     investorName: 'John Doe',
     // ... other fields
   };
   ```

2. Run the individual form generation:
   ```bash
   npm start
   ```

3. The filled PDF will be saved as `output.pdf` in the project root.

### Institution Form

1. Edit the `sampleData` object in `index-institution.js` with your institution data:
   ```javascript
   const sampleData = {
     templateName: 'SASF-Institution',
     institutionName: 'ABC Corporation',
     // ... other fields
   };
   ```

2. Run the institution form generation:
   ```bash
   npm run institution
   ```

3. The filled PDF will be saved as `output-institution.pdf` in the project root.

## Field Mappings

### Individual Form Fields

The individual form supports the following fields with their coordinates:

#### Top Section
- `registrationNumber`: x=524, y=695 (size: 7.5)
- `saleNumber`: x=524, y=683 (size: 7.5)
- `amount`: x=90, y=633 (size: 7.5)
- `amountInWords`: x=270, y=633 (size: 7.5)
- `chequeNumber`: x=120, y=620 (size: 7.5)
- `bankName`: x=247, y=620 (size: 7.5)
- `bankBranchName`: x=420, y=620 (size: 7.5)
- `unitPrice`: x=120, y=608 (size: 7.5)
- `units`: x=415, y=608 (size: 7.5)

#### Principal Applicant
- `investorName`: x=107.56, y=556.56 (size: 7.5)
- `fatherName`: x=28.22, y=568.33 (size: 7.5)
- `motherName`: x=84.89, y=526.33 (size: 7.5)
- `spouseName`: x=60.22, y=515.45 (size: 7.5)
- `dateOfBirth`: x=80.22, y=501.67 (size: 7.5)
- `nationality`: x=246.22, y=502.11 (size: 7.5)
- `nidNumber`: x=406.89, y=503 (size: 7.5)
- `presentAddress`: x=45.56, y=490.33 (size: 7.5)
- `permanentAddress`: x=318.22, y=490.33 (size: 7.5)
- `telephoneNo`: x=58.89, y=478.11 (size: 7.5)
- `mobileNo`: x=337.56, y=477.45 (size: 7.5)
- `email`: x=58.89, y=466.33 (size: 7.5)
- `occupation`: x=310.22, y=465.67 (size: 7.5)
- `bankName`: x=219.56, y=433 (size: 7.5)
- `bankBranch`: x=73.56, y=385.67 (size: 7.5)
- `accountNumber`: x=249.56, y=385.45 (size: 7.5)
- `etin`: x=74.44, y=355 (size: 7.5)
- `boAccount`: x=249.78, y=353.89 (size: 7.5)

#### Joint Applicant (from Joint Applicant.json)
- `jointInvestorName`: x=107.56, y=556.56 (size: 7.5)
- `jointFatherName`: x=28.22, y=568.33 (size: 7.5)
- `jointMotherName`: x=84.89, y=526.33 (size: 7.5)
- `jointSpouseName`: x=60.22, y=515.45 (size: 7.5)
- `jointDateOfBirth`: x=80.22, y=501.67 (size: 7.5)
- `jointNationality`: x=246.22, y=502.11 (size: 7.5)
- `jointNidNumber`: x=406.89, y=503 (size: 7.5)
- `jointPresentAddress`: x=45.56, y=490.33 (size: 7.5)
- `jointPermanentAddress`: x=318.22, y=490.33 (size: 7.5)
- `jointTelephoneNo`: x=58.89, y=478.11 (size: 7.5)
- `jointMobileNo`: x=337.56, y=477.45 (size: 7.5)
- `jointEmail`: x=58.89, y=466.33 (size: 7.5)
- `jointOccupation`: x=310.22, y=465.67 (size: 7.5)
- `jointBankName`: x=219.56, y=433 (size: 7.5)
- `jointBankBranch`: x=73.56, y=385.67 (size: 7.5)
- `jointAccountNumber`: x=249.56, y=385.45 (size: 7.5)
- `jointEtin`: x=74.44, y=355 (size: 7.5)
- `jointBoAccount`: x=249.78, y=353.89 (size: 7.5)

#### Nominee (from Nominee.json)
- `nomineeName`: x=107.56, y=556.56 (size: 7.5)
- `nomineeFatherName`: x=28.22, y=568.33 (size: 7.5)
- `nomineeMotherName`: x=84.89, y=526.33 (size: 7.5)
- `nomineeSpouseName`: x=60.22, y=515.45 (size: 7.5)
- `nomineeDateOfBirth`: x=80.22, y=501.67 (size: 7.5)
- `nomineeNationality`: x=246.22, y=502.11 (size: 7.5)
- `nomineeNidNumber`: x=406.89, y=503 (size: 7.5)
- `nomineePresentAddress`: x=45.56, y=490.33 (size: 7.5)
- `nomineePermanentAddress`: x=318.22, y=490.33 (size: 7.5)
- `nomineeTelephoneNo`: x=58.89, y=478.11 (size: 7.5)
- `nomineeMobileNo`: x=337.56, y=477.45 (size: 7.5)
- `nomineeEmail`: x=58.89, y=466.33 (size: 7.5)
- `nomineeOccupation`: x=310.22, y=465.67 (size: 7.5)
- `nomineeBankName`: x=219.56, y=433 (size: 7.5)
- `nomineeBankBranch`: x=73.56, y=385.67 (size: 7.5)
- `nomineeAccountNumber`: x=249.56, y=385.45 (size: 7.5)
- `nomineeEtin`: x=74.44, y=355 (size: 7.5)
- `nomineeBoAccount`: x=249.78, y=353.89 (size: 7.5)

#### Images
- `investorPhotoUrl`: Embedded at x=60, y=360, width=100, height=120
- `investorSignatureUrl`: Embedded at x=240, y=380, width=80, height=30
- `jointInvestorSignatureUrl`: Embedded at x=360, y=380, width=80, height=30
- `nomineeSignatureUrl`: Embedded at x=360, y=380, width=80, height=30 (for nominee section)

### Institution Form Fields

The institution form supports the following fields with their coordinates (Page 1 only, Page 2 is currently empty):

#### Top Section (Added from Individual Template)
- `registrationNumber`: x=524, y=695 (size: 7.5)
- `saleNumber`: x=524, y=683 (size: 7.5)
- `amount`: x=90, y=633 (size: 7.5)
- `amountInWords`: x=270, y=633 (size: 7.5)
- `chequeNumber`: x=120, y=620 (size: 7.5)
- `bankName`: x=247, y=620 (size: 7.5)
- `bankBranchName`: x=420, y=620 (size: 7.5)
- `unitPrice`: x=120, y=608 (size: 7.5)
- `units`: x=415, y=608 (size: 7.5)

#### Registration / Top-right
- `registrationNumber`: x=527.11, y=693.67 (size: 7.5)

#### Cheque / P.O. / D.D. Information
- `chequeNumber`: x=120.44, y=609.67 (size: 7.5)
- `chequeBank`: x=247.78, y=609 (size: 7.5)
- `chequeBranch`: x=421.78, y=609 (size: 7.5)

#### Institution Details
- `institutionType`: x=70, y=179 (size: 7.5)
- `institutionName`: x=107.56, y=556.56 (size: 7.5)
- `institutionRegistrationNo`: x=28.22, y=568.33 (size: 7.5)
- `registrationLabel`: x=84.89, y=526.33 (size: 7.5)
- `institutionAddress`: x=60.22, y=515.45 (size: 7.5)
- `telephoneNo`: x=80.22, y=501.67 (size: 7.5)
- `faxNo`: x=246.22, y=502.11 (size: 7.5)
- `email`: x=406.89, y=503 (size: 7.5)
- `bankName`: x=45.56, y=490.33 (size: 7.5)
- `bankBranch`: x=318.22, y=490.33 (size: 7.5)
- `accountNumber`: x=58.89, y=478.11 (size: 7.5)
- `bankRoutingNo`: x=337.56, y=477.45 (size: 7.5)
- `boAccount`: x=58.89, y=466.33 (size: 7.5)
- `etin`: x=310.22, y=465.67 (size: 7.5)

#### Managing Director/CEO
- `managingDirectorName`: x=219.56, y=433 (size: 7.5)
- `managingDirectorPhotoUrl`: Embedded at x=60, y=360, width=100, height=120

#### Authorized Persons
- `authorizedPerson1Name`: x=73.56, y=385.67 (size: 7.5)
- `authorizedPerson1Designation`: x=249.56, y=385.45 (size: 7.5)
- `authorizedPerson2Name`: x=74.44, y=355 (size: 7.5)
- `authorizedPerson2Designation`: x=249.78, y=353.89 (size: 7.5)

#### Signatures
- `authorizedPerson1SignatureUrl`: Embedded at x=240, y=380, width=80, height=30
- `authorizedPerson2SignatureUrl`: Embedded at x=360, y=380, width=80, height=30

#### Date
- `applicationDate`: x=97.56, y=33.89 (size: 7.5)

## Using the Position Finder Tool

The `PDF_PositionFinder.html` is an interactive tool to determine coordinates on PDF pages:

1. Open `PDF_PositionFinder.html` in a web browser.

2. Click "Choose PDF" and select your PDF template.

3. Use the page navigation buttons to move between pages.

4. Click anywhere on the PDF to get the x,y coordinates (displayed below the canvas).

5. Use these coordinates in your form service files for precise text placement.

Note: Coordinates are from the bottom-left corner of the page. The tool uses PDF.js for rendering.

## API Reference

### PdfService Class

#### Methods

- `writeText(page, font, opts)`: Draws text on a PDF page
  - `opts`: { text, x, y, size = 8 }

- `embedImageFromUrl(pdfDoc, url, errorMessage)`: Embeds an image from a URL
  - Returns embedded image object
  - Supports JPEG/PNG with automatic conversion using sharp

- `generateInvestorFormPdf(data)`: Generates filled individual form PDF
  - `data`: Object with field values and templateName

- `generateInstitutionFormPdf(data)`: Generates filled institution form PDF
  - `data`: Object with field values and templateName

## Troubleshooting

- **Template not found**: Ensure PDF files are in `templates/investor-forms/` with correct names.
- **Image embedding fails**: Check that URLs point to valid JPEG/PNG images. The app attempts automatic conversion.
- **Coordinates incorrect**: Use the Position Finder tool to verify coordinates.
- **Page 2 not filling**: Institution form Page 2 is currently empty; fields need to be added separately.
- **Runtime errors**: Check console output for specific error messages.

## Development History

This project evolved through several iterations:

1. **Initial Setup**: Basic individual form filler based on provided code template.
2. **Joint Applicant & Nominee**: Added support for additional sections using JSON coordinate files.
3. **Institution Form**: Created separate service for institutional investors with multi-page support.
4. **Coordinate Refinement**: Updated coordinates for precision and added missing fields.
5. **Tools & Documentation**: Added position finder tool and comprehensive README.

Key milestones:
- Floored coordinates for consistency
- Removed multi-choice options for institution form
- Added top-section fields to institution form
- Cleared Page 2 for future "Official Use Only" fields

## Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for internal use. Please ensure compliance with all applicable laws and regulations regarding PDF form filling and data handling.
