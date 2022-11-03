import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/models/user.model';
import { PasswordService } from '../password.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private passwordService: PasswordService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const email: string = username.toLowerCase();

    const user: User = await this.authService.validateUser(email);
    if (!user) {
      throw new NotFoundException(`invalid_email`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );
    if (!passwordValid) {
      throw new BadRequestException('invalid_password');
    } else if (!user.emailConfirmed) {
      throw new BadRequestException('email_not_confirmed');
    }

    return user;
  }
}
