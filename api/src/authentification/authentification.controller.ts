import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { Controller } from "@nestjs/common";
import { authContract } from "../../../packages/src/contracts/auth.contract";
import { AuthService } from "./authentification.service";

@Controller()
export class AuthentificationController {
  private readonly service: AuthService;

  public constructor(service: AuthService) {
    this.service = service;
  }

  @TsRestHandler(authContract)
  public handle() {
    return tsRestHandler(authContract, {
      login: async ({ body: dto }) => {
        const token = await this.service.login(dto);
        return { status: 200, body: token };
      },
      register: async ({ body: dto }) => {
        console.log("Register DTO:", dto);
        const user = await this.service.register(dto);
        return { status: 201, body: user };
      },
    });
  }
}
