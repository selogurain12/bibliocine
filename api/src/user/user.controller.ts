import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { userContract } from "../../../packages/src/contracts/user.contract";
import { UserService } from "./user.service";

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  private readonly service: UserService;

  public constructor(service: UserService) {
    this.service = service;
  }
  
  @TsRestHandler(userContract)
  public handle() {
    return tsRestHandler(userContract, {
      get: async ({ params: parameters }) => {
        const user = await this.service.get(parameters.username);
        return { status: 200, body: user };
      },
      getAll: async ({ query }) => {
        const users = await this.service.getAll(query);
        return { status: 200, body: users };
      },
      update: async ({ params: parameters, body: dto }) => {
        const user = await this.service.update(parameters.userId, dto);
        return { status: 200, body: user };
      },
    });
  }
}
