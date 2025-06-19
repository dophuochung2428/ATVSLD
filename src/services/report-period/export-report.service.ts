import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import mammoth from 'mammoth';
import HTMLtoDOCX from 'html-to-docx';
import { ExportReportData } from './report-period.service.interface';
import { cleanNulls } from 'src/utils/report-export.util';

@Injectable()
export class ExportReportService {
  async exportReportWord(data: ExportReportData): Promise<Buffer> {
    const templatePath = path.resolve(process.cwd(), 'templates/atvsld-report.docx');
    const cleanData = cleanNulls(data);
    console.log('Dữ liệu:', JSON.stringify(cleanData, null, 2));

    // Đọc file Word thành HTML
    const { value: html } = await mammoth.convertToHtml({ path: templatePath });

    // Thay thế placeholder [key] bằng giá trị
    let modifiedHtml = html;
    for (const key in cleanData) {
      modifiedHtml = modifiedHtml.replace(`[${key}]`, String(cleanData[key] || ''));
    }

    // Chuyển HTML về DOCX
    const buffer = await HTMLtoDOCX(modifiedHtml);
    return buffer;
  }
}