import { Controller, Post, Body, UseGuards, Request, HttpStatus, Res } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() req: Record<string, string>, @Res() res: Response) {
    const user = await this.adminAuthService.validateAdmin(req.email, req.password);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials or not an admin' });
    }
    const loginResult = await this.adminAuthService.login(user);
    return res.status(HttpStatus.OK).json(loginResult);
  }
}
