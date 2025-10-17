# PDF Form Filling Application

A simple Node.js application for filling PDF forms based on the provided template.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create the template directory structure:
```
templates/
  investor-forms/
    investor-form.pdf
```

3. Place your PDF template in the `templates/investor-forms/` folder.

## Usage

1. Edit the `sampleData` in `index.js` with your form data
2. Run the application:
```bash
npm start
```

3. The filled PDF will be saved as `output.pdf`

## Structure

- `pdfService.js` - Main service for PDF generation (follows the code template)
- `index.js` - Entry point with sample data
- `Joint Applicant.json` - Field positions for joint applicant
- `Nominee.json` - Field positions for nominee

## Features

- Fill text fields with custom coordinates
- Embed images (JPEG/PNG) for photos and signatures
- Support for multiple sections (Principal, Joint Applicant, Nominee)
- Automatic image format conversion using sharp
