const { rgb } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const writeText = (page, font, opts) => {
  const {
    text,
    x,
    y,
    size = 8,
    color = rgb(0, 0, 0),
    xAlign = 'left',
    yAlign = 'top',
  } = opts;

  // Calculate text width for alignment
  const textWidth = font.widthOfTextAtSize(String(text), size);

  let adjustedX = x;
  let adjustedY = y;

  // Handle horizontal alignment
  if (xAlign === 'center') {
    adjustedX = (page.getWidth() - textWidth) / 2;
  } else if (xAlign === 'right') {
    adjustedX = x - textWidth;
  }
  // 'left' alignment uses the original x position

  // Handle vertical alignment (pdf-lib doesn't have built-in yAlign, so we adjust y position)
  if (yAlign === 'center') {
    adjustedY = y - size / 2;
  } else if (yAlign === 'bottom') {
    adjustedY = y - size;
  }
  // 'top' alignment uses the original y position

  page.drawText(String(text), {
    x: adjustedX,
    y: adjustedY,
    size,
    font,
    color,
  });
};

// Writes multi-line text within a max width, with optional justification and custom line height
const writeMultiLineText = (page, font, opts) => {
  const {
    text,
    x,
    y,
    maxWidth,
    size = 8,
    color = rgb(0, 0, 0),
    lineHeight,
    align = 'justify',
  } = opts;

  const spaceWidth = font.widthOfTextAtSize(' ', size);
  const normalize = (t) => t.replace(/\s+/g, ' ').trim();
  const paragraphs = String(text).split('\n').map(normalize).filter(Boolean);

  const measure = (t) => font.widthOfTextAtSize(t, size);

  const actualLineHeight = lineHeight ?? size * 1.2;

  let rowIndex = 0;
  paragraphs.forEach((para, pIdx) => {
    const words = para.split(' ');
    let lineWords = [];
    let lineWidth = 0;

    words.forEach((word) => {
      const w = measure(word);
      const add = lineWords.length === 0 ? w : spaceWidth + w;
      if (lineWidth + add <= maxWidth) {
        lineWords.push(word);
        lineWidth += add;
      } else {
        drawLine(lineWords, lineWidth, false);
        rowIndex += 1;
        lineWords = [word];
        lineWidth = w;
      }
    });
    if (lineWords.length) {
      drawLine(lineWords, lineWidth, true);
      rowIndex += 1;
    }

    // Add a paragraph break
    if (pIdx < paragraphs.length - 1) {
      rowIndex += 1;
    }
  });

  function drawLine(words, baseWidth, isLastLine) {
    const gaps = Math.max(0, words.length - 1);

    let startX = x;
    if (align === 'center') {
      startX = x + (maxWidth - baseWidth) / 2;
    } else if (align === 'right') {
      startX = x + (maxWidth - baseWidth);
    }

    let extraPerGap = 0;
    if (align === 'justify' && !isLastLine && gaps > 0) {
      extraPerGap = (maxWidth - baseWidth) / gaps;
    }

    let cursorX = startX;
    const cursorY = y - rowIndex * actualLineHeight;

    words.forEach((w, i) => {
      page.drawText(w, { x: cursorX, y: cursorY, size, font, color });
      const wWidth = measure(w);
      if (i < words.length - 1) {
        cursorX += wWidth + spaceWidth + extraPerGap;
      }
    });
  }
};

const embedAndDrawImage = async (
  pdfDoc,
  page,
  imageUrl,
  x,
  y,
  width,
  height,
  errorMessage,
) => {
  let arrayBuffer;
  let contentType = '';

  // If the image url is a valid URL, fetch the image from the URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    const res = await fetch(imageUrl);
    contentType = res.headers.get('content-type') || '';
    arrayBuffer = await res.arrayBuffer();
  } else {
    // Assume it's a local file path
    const fullPath = path.isAbsolute(imageUrl)
      ? imageUrl
      : path.join(process.cwd(), imageUrl);

    let resolvedPath = fullPath;
    if (
      !fs.existsSync(resolvedPath) &&
      fullPath.includes(`${path.sep}dist${path.sep}`)
    ) {
      // Try fallback to src path when running from dist
      const fallbackPath = fullPath.replace(
        `${path.sep}dist${path.sep}`,
        `${path.sep}`,
      );
      if (fs.existsSync(fallbackPath)) {
        resolvedPath = fallbackPath;
      }
    }
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(errorMessage || 'Local image file not found');
    }
    const fileBuffer = fs.readFileSync(resolvedPath);
    arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength,
    );
    // Determine content type based on file extension
    const ext = path.extname(resolvedPath).toLowerCase();
    console.log('File extension:', ext);
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else {
      throw new Error(errorMessage || 'Unsupported local image file type');
    }
  }

  let embeddedImage;

  if (
    contentType?.toLowerCase().includes('jpeg') ||
    contentType?.toLowerCase().includes('jpg')
  ) {
    console.log('Embedding JPEG image...');
    try {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
      console.log('JPEG embedded successfully');
    } catch (error) {
      console.log('JPEG embedding failed, trying with sharp:', error);
      const fixedBuffer = await sharp(Buffer.from(arrayBuffer))
        .jpeg()
        .toBuffer();
      embeddedImage = await pdfDoc.embedJpg(fixedBuffer);
      console.log('JPEG embedded with sharp successfully');
    }
  } else if (contentType?.toLowerCase().includes('png')) {
    console.log('Embedding PNG image...');
    try {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
      console.log('PNG embedded successfully');
    } catch (error) {
      console.log('PNG embedding failed, trying with sharp:', error);
      const fixedBuffer = await sharp(Buffer.from(arrayBuffer))
        .png()
        .toBuffer();
      embeddedImage = await pdfDoc.embedPng(fixedBuffer);
      console.log('PNG embedded with sharp successfully');
    }
  } else {
    console.log('Unsupported content type:', contentType);
    throw new Error(errorMessage || 'Unsupported image format');
  }

  console.log(
    `Drawing image at position: x=${x}, y=${y}, width=${width}, height=${height}`,
  );
  page.drawImage(embeddedImage, {
    x,
    y,
    width,
    height,
  });
  console.log('Image drawn successfully');
};

const writeLabelAndValuePair = (page, font, boldFont, opts) => {
  const {
    label,
    value,
    x,
    y,
    labelSize,
    valueSize,
    gap,
    xAlign = 'left',
  } = opts;
  const labelWidth = boldFont.widthOfTextAtSize(String(label), labelSize);
  const valueWidth = font.widthOfTextAtSize(String(value), valueSize);
  const totalWidth = labelWidth + (gap || 10) + valueWidth;

  let adjustedX = x;

  if (xAlign === 'left') {
    adjustedX = x;
  } else if (xAlign === 'center') {
    // Center the combined label + value string
    adjustedX = (page.getWidth() - totalWidth) / 2;
  } else if (xAlign === 'right') {
    adjustedX = page.getWidth() - totalWidth;
  }

  writeText(page, boldFont, {
    text: label,
    x: adjustedX,
    y,
    size: labelSize,
  });

  writeText(page, font, {
    text: value,
    x: adjustedX + labelWidth + (gap || 10),
    y,
    size: valueSize,
  });
};

// Generic-purpose table drawing function
const drawTable = (page, font, opts) => {
  const {
    rows,
    x,
    y,
    rowHeight = 20,
    columnWidths,
    fontSize = 10,
    borderColor = [0, 0, 0],
    textColor = [0, 0, 0],
    boldFont,
    padding = 4,
    showBorders = true,
    showVerticalBorders = true,
    showHorizontalBorders = true,
  } = opts;

  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  let cursorY = y;

  rows.forEach((row, rowIndex) => {
    let cursorX = x;

    // Draw row background and borders if enabled
    if (showBorders) {
      page.drawRectangle({
        x,
        y: cursorY - rowHeight,
        width: totalWidth,
        height: rowHeight,
        borderColor: rgb(...borderColor),
        borderWidth: 0.5,
      });
    }

    // Draw cells
    row.cells.forEach((cell, cellIndex) => {
      const cellWidth = columnWidths[cellIndex];
      const cellFont = cell.font || (cell.bold && boldFont ? boldFont : font);
      // Draw vertical separator if enabled and not the last column
      if (showVerticalBorders && cellIndex < row.cells.length - 1) {
        page.drawLine({
          start: { x: cursorX + cellWidth, y: cursorY },
          end: { x: cursorX + cellWidth, y: cursorY - rowHeight },
          thickness: 0.5,
          color: rgb(...borderColor),
        });
      }

      // Draw cell text
      const textY = cursorY - rowHeight + (rowHeight - fontSize) / 2;
      page.drawText(cell.text, {
        x: cursorX + padding,
        y: textY,
        size: fontSize,
        font: cellFont,
        color: rgb(...textColor),
      });

      cursorX += cellWidth;
    });

    // Draw horizontal separator if enabled and not the last row
    if (showHorizontalBorders && rowIndex < rows.length - 1) {
      page.drawLine({
        start: { x, y: cursorY - rowHeight },
        end: { x: x + totalWidth, y: cursorY - rowHeight },
        thickness: 0.5,
        color: rgb(...borderColor),
      });
    }

    cursorY -= rowHeight;
  });
};

const PdfCommonUtils = {
  writeText,
  writeMultiLineText,
  embedAndDrawImage,
  writeLabelAndValuePair,
  drawTable,
};

module.exports = { PdfCommonUtils };
