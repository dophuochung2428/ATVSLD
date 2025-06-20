import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { ExportReportData } from './report-period.service.interface';
import { cleanNulls } from 'src/utils/report-export.util';

@Injectable()
export class ExportReportService {
  async exportReportWord(data: ExportReportData): Promise<Buffer> {
    const templatePath = path.resolve(process.cwd(), 'templates/atvsld-report.docx');
    const cleanData = cleanNulls(data);
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '[[',
        end: ']]',
      },
    });

    doc.setData(cleanData);

    try {
      doc.render();
    } catch (error) {
      console.error('Render lỗi:', error);
      throw error;
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    return buffer;
  }
}