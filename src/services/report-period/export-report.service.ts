import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
const PizZip = require('pizzip');
// @ts-ignore
const Docxtemplater = require('docxtemplater');
import { cloneDeep } from 'lodash';
import { ExportReportData } from './report-period.service.interface';
import { cleanNulls } from 'src/utils/report-export.util';

@Injectable()
export class ExportReportService {
  async exportReportWord(data: ExportReportData): Promise<Buffer> {
    const templatePath = path.resolve(process.cwd(), 'templates/atvsld-report.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const cleanData = cleanNulls(data);

    doc.setData(cleanData);
    doc.render();

    return doc.getZip().generate({ type: 'nodebuffer' });
  }
}
