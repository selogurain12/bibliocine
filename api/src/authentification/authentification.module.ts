import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./authentification.guard";
import { AuthService } from "./authentification.service";
import { AuthMapper } from "./authentification.mapper";
import { AuthentificationController } from "./authentification.controller";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
    }),
  ],
  controllers: [AuthentificationController],
  providers: [AuthGuard, AuthService, AuthMapper],
  exports: [AuthGuard, JwtModule, AuthService, AuthMapper],
})
export class AuthentificationModule {}
