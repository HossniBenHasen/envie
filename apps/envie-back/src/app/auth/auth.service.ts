import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async createToken(user: User) {
        const payload = { id: user.id, username: user.username, sub: user.id, role: user.role, company: user.company };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(username: string, password: string) {
        // Validate user credentials and return user entity if valid
        let usedName = await User.findOne({
            where: {
                username: username
            },
            relations: {
                company: true
            }
        });
        if (!usedName) {
            throw new NotFoundException("User does not exist");
        }
        if (!bcrypt.compareSync(password, usedName.password)) {
            throw new UnauthorizedException("Invalid password");
        }
        return this.createToken(usedName);
    }
}