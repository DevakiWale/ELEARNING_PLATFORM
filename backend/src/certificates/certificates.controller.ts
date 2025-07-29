import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CertificateService } from './certificates.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':courseId')
  async getCertificateData(
    @Param('courseId') courseId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user?.['id'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request.');
    }

    const certificate = await this.certificateService.getCertificateData(
      courseId,
      userId,
    );
    return res.json(certificate);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':courseId/download')
  async downloadPdf(
    @Param('courseId') courseId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user?.['id'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request.');
    }

    const pdfBuffer = await this.certificateService.generatePdfBuffer(
      courseId,
      userId,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${courseId}.pdf"`,
    });

    return res.send(pdfBuffer);
  }
}
