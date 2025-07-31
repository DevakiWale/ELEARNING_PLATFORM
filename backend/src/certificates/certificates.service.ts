import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './certificate.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import PDFDocument from 'pdfkit';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certRepo: Repository<Certificate>,
  ) {}

  async getCertificateData(courseId: string, userId: string) {
    const cert = await this.certRepo.findOne({
      where: {
        course: { id: courseId },
        user: { id: userId },
      },
      relations: ['user', 'course'],
    });

    if (!cert) {
      throw new NotFoundException('Certificate not found');
    }

    return cert;
  }

  async generatePdfBuffer(courseId: string, userId: string): Promise<Buffer> {
    const cert = await this.getCertificateData(courseId, userId);

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
    });

    const buffers: Uint8Array[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(26).fillColor('#0c4a6e').text('Certificate of Completion', {
      align: 'center',
    });

    doc.moveDown();
    doc.fontSize(18).fillColor('#333').text('This is to certify that', {
      align: 'center',
    });

    doc.moveDown();
    doc.fontSize(22).fillColor('#111').text(cert.user.name, {
      align: 'center',
      underline: true,
    });

    doc.moveDown();
    doc.fontSize(16).text('has successfully completed the course', {
      align: 'center',
    });

    doc.moveDown();
    doc.fontSize(20).text(`"${cert.course.title}"`, {
      align: 'center',
      italic: true,
    });

    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Issued on: ${new Date(cert.createdAt).toLocaleDateString()}`, {
        align: 'center',
      });

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }

  async issue(user: User, course: Course) {
    const existing = await this.certRepo.findOne({
      where: { user: { id: user.id }, course: { id: course.id } },
    });

    if (existing) return;

    const cert = this.certRepo.create({ user, course });
    await this.certRepo.save(cert);
  }
}
