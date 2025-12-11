import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { REFRESH_TOKEN_MODEL } from 'src/database/constants';
import { RefreshToken } from 'src/refresh_token/refresh.token.interface';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @Inject(REFRESH_TOKEN_MODEL)
    private refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  private async createTokens(userId: string, email: string) {
    const payload = { email, sub: userId };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_ACCESS,
      expiresIn: '60s',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '7d',
    });

    const refreshToken = new this.refreshTokenModel({
      userId,
      token: refresh_token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await refreshToken.save();

    return { access_token, refresh_token };
  }

  async signIn(username: string, pass: string) {
    if (!username || !pass) {
      throw new UnauthorizedException('Username and password are required');
    }

    const user = await this.userService.findOne(username);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createTokens(user._id.toString(), user.email);
  }

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create(name, email, hashedPassword);

    if (!user) {
      throw new InternalServerErrorException('Registration failed');
    }

    return this.createTokens(user._id.toString(), user.email);
  }

  async refreshToken(oldRefreshToken: string) {
    const existingToken = await this.refreshTokenModel.findOneAndDelete({
      token: oldRefreshToken,
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      if (existingToken) {
        await this.refreshTokenModel.deleteMany({
          userId: existingToken.userId,
        });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
      secret: process.env.JWT_SECRET_REFRESH,
    });

    return this.createTokens(payload.sub, payload.email);
  }
}
