import * as fs from 'fs';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import { fromPath } from 'pdf2pic';
import * as Tesseract from 'tesseract.js';

export async function readPdfText(filePath: string): Promise<string> {
  const fs = require('fs');
  const pdf = require('pdf-parse');
  const { fromPath } = require('pdf2pic');
  const Tesseract = require('tesseract.js');

  // 1. Đọc text PDF bình thường
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    const extractedText = data.text?.trim();

    // Nếu đọc được text thì return luôn
    if (extractedText && extractedText.length > 50) {
      return extractedText;
    }
  } catch (err) {
    console.warn('Không đọc được PDF dạng text:', err.message);
  }

  // 2. Fallback dùng OCR nếu PDF là scan
  console.log(' Fallback sang OCR vì PDF có thể là scan...');
  const outputPath = './temp';
  const converter = fromPath(filePath, {
    density: 200,
    saveFilename: 'page',
    savePath: outputPath,
    format: 'png',
    width: 1000,
    height: 1414,
  });

  let fullText = '';
  const maxPages = 3; // đọc thử 3 trang đầu, tránh OCR quá lâu

  for (let i = 1; i <= maxPages; i++) {
    try {
      const result = await converter(i);
      const imagePath = result.path || `${outputPath}/${result.name}`;
      const {
        data: { text },
      } = await Tesseract.recognize(imagePath, 'eng+vie');
      fullText += text + '\n';
    } catch (ocrErr) {
      console.warn(`OCR lỗi trang ${i}:`, ocrErr.message);
    }
  }

  return fullText.trim();
}

export async function readPdfScanText(filePath: string): Promise<string> {
  const outputPath = './temp';
  const pageToConvertAsImage = 1;

  const converter = fromPath(filePath, {
    density: 200,
    saveFilename: 'page',
    savePath: outputPath,
    format: 'png',
    width: 1000,
    height: 1414,
  });

  const result = await converter(pageToConvertAsImage);

  // `result.name` sẽ là tên file ảnh đã lưu (ví dụ: "./temp/page_1.png")
  const imagePath = result.path || `${outputPath}/${result.name}`;

  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, 'eng+vie', {
    logger: (m) => console.log(m),
  });

  return text;
}

export function readDocxText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  return mammoth.extractRawText({ buffer }).then((res) => res.value);
}

export function readExcelText(filePath: string): string {
  const wb = xlsx.readFile(filePath);
  const result: string[] = [];

  wb.SheetNames.forEach((sheet) => {
    const data = xlsx.utils.sheet_to_csv(wb.Sheets[sheet]);
    result.push(data);
  });

  return result.join('\n');
}
