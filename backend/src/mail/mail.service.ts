import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"E-Learning Platform" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  }

  async sendEnrollmentConfirmation(email: string, courseTitle: string) {
    await this.sendMail(
      email,
      '🎉 Enrollment Confirmed!',
      `<p>Hi there,</p><p>You have successfully enrolled in <strong>${courseTitle}</strong>.</p><p>Happy learning! 🚀</p>`,
    );
  }

  async sendCourseCompletion(email: string, courseTitle: string) {
    await this.sendMail(
      email,
      '✅ Course Completed!',
      `<p>Congratulations!</p><p>You’ve completed the course <strong>${courseTitle}</strong>.</p><p>Your certificate is now available.</p>`,
    );
  }
}
