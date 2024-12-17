import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: any) {
        return this.authService.validateUser(body.username, body.password);
    }

    // @Post('refresh')
    // async refreshToken(@Body() body: any) {
    //     // Validate and refresh JWT token
    //     const token = body.token;
    //     return this.authService.createToken({ id: 123, username: 'user' });
    // }
}