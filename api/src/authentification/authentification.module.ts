import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./authentification.guard";
import { AuthService } from "./authentification.service";
import { AuthMapper } from "./authentification.mapper";
import { AuthentificationController } from "./authentification.controller";
import { StatModule } from "src/stat/stat.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
    }),
    StatModule
  ],
  controllers: [AuthentificationController],
  providers: [AuthGuard, AuthService, AuthMapper],
  exports: [AuthGuard, JwtModule, AuthService, AuthMapper],
})
export class AuthentificationModule {}
