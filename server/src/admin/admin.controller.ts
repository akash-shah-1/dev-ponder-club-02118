import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@UseGuards(AdminAuthGuard)
@Controller('admin-ai')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('chat')
  async chat(
    @Body('prompt') prompt: string,
    @Res() res: Response
  ) {
    console.log('Received chat prompt:', prompt);

    try {
      const result = await this.adminService.normalChat(prompt);
      return res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in AdminController chat:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'An error occurred while processing your request.',
      });
    }
  }

  @Post('run-sql')
  async runSql(
    @Body('prompt') prompt: string,
    @Res() res: Response,
    @Body('password') password?: string
  ) {
    console.log('Received SQL prompt:', prompt);
    console.log('Received password:', password ? '******' : 'No password provided');

    try {
      const result = await this.adminService.runCrewAI(prompt, password);
      return res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in AdminController runSql:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'An error occurred while processing your request.',
        details: error.response?.message || null,
      });
    }
  }
}
