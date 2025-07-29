import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
@Controller('courses')
export class CoursesController {
  [x: string]: any;
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard, new RolesGuard(['instructor']))
  @Post()
  async create(@Body() dto: CreateCourseDto, @Req() req: Request) {
    const userPayload = req.user as any;
    const fullUser = await this.usersService.findById(userPayload.userId);

    if (!fullUser) {
      throw new NotFoundException('Instructor user not found');
    }

    return this.coursesService.create(dto, fullUser);
  }

  @Get()
  getAll() {
    return this.coursesService.findAllApproved();
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
  ) {
    return this.coursesService.getFilteredCourses({ search, category, sort });
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  getPending() {
    return this.coursesService.findAllPending();
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  approve(@Param('id') id: string) {
    return this.coursesService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  reject(@Param('id') id: string) {
    return this.coursesService.reject(id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

 
}
