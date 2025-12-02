import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { filmothequeContract } from "../../../packages/src/contracts/filmotheque.contract";
import { FilmothequeService } from "./filmotheque.service";

@Controller()
@UseGuards(AuthGuard)
export class FilmothequeController {
  private readonly service: FilmothequeService;

  public constructor(service: FilmothequeService) {
    this.service = service;
  }

  @TsRestHandler(filmothequeContract)
  public handle() {
    return tsRestHandler(filmothequeContract, {
      createFilmotheque: async ({ params: parameters, body: dto }) => {
        console.log("create controller")
        const filmotheque = await this.service.create(dto, parameters.userId);
        return { status: 201, body: filmotheque };
      },
      getFilmotheque: async ({ params: parameters }) => {
        const filmotheque = await this.service.get(
          parameters.id,
          parameters.userId,
        );
        return { status: 200, body: filmotheque };
      },
      getAllFilmotheques: async ({ params: parameters }) => {
        const filmotheques = await this.service.getAll(parameters.userId);
        return { status: 200, body: filmotheques };
      },
      updateFilmotheque: async ({ params: parameters, body: dto }) => {
        const filmotheque = await this.service.update(
          parameters.id,
          dto,
          parameters.userId,
        );
        return { status: 200, body: filmotheque };
      },
      deleteFilmotheque: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
    });
  }
}
