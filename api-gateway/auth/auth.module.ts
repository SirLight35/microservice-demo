import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.stratgy';
import { ConfigModule } from '@nestjs/config';
@Module({
    
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.MY_SUPER_SECRET_KEY || 'supersecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
