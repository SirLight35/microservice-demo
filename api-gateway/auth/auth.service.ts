import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(email: string) {
        const payload = { email: email, sub: 'user_id' };
        return {token: this.jwtService.sign(payload)};
    }
}



