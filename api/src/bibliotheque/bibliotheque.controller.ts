import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { bibliothequeContract } from "../../../packages/src/contracts/bibliotheque.contract";
import { BibliothequeService } from "./bibliotheque.service";

@Controller()
@UseGuards(AuthGuard)
export class BibliothequeController {
  private readonly service: BibliothequeService;

  public constructor(service: BibliothequeService) {
    this.service = service;
  }

  @TsRestHandler(bibliothequeContract)
  public handle() {
    return tsRestHandler(bibliothequeContract, {
      createBibliotheque: async ({ params: parameters, body: dto }) => {
        const bibliotheque = await this.service.create(dto, parameters.userId);
        return { status: 201, body: bibliotheque };
      },
      getBibliotheque: async ({ params: parameters }) => {
        const bibliotheque = await this.service.get(
          parameters.id,
          parameters.userId,
        );
        return { status: 200, body: bibliotheque };
      },
      getAllBibliotheques: async ({ params: parameters }) => {
        const bibliotheques = await this.service.getAll(parameters.userId);
        return { status: 200, body: bibliotheques };
      },
      updateBibliotheque: async ({ params: parameters, body: dto }) => {
        const bibliotheque = await this.service.update(
          parameters.id,
          dto,
          parameters.userId,
        );
        return { status: 200, body: bibliotheque };
      },
      deleteBibliotheque: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
    });
  }
}
