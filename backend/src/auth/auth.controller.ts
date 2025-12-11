import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/sign.in.dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { RegisterDto } from 'src/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signin')
  async signIn(@Body() req: SignInDto): Promise<any> {
    return this.authService.signIn(req.email, req.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  async register(@Body(new ValidationPipe()) req: RegisterDto): Promise<any> {
    return this.authService.register(req.name, req.email, req.password);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<any> {
    console.log('Refreshing token:', refreshToken);
    return this.authService.refreshToken(refreshToken);
  }
}
