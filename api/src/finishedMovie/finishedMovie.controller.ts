import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { finishedMovieContract } from "../../../packages/src/contracts/finishedMovie.contract";
import { FinishedMovieService } from "./finishedMovie.service";

@Controller()
@UseGuards(AuthGuard)
export class FinishedMovieController {
  private readonly service: FinishedMovieService;

  public constructor(service: FinishedMovieService) {
    this.service = service;
  }

  @TsRestHandler(finishedMovieContract)
  public handle() {
    return tsRestHandler(finishedMovieContract, {
      createFinishedMovie: async ({ params: parameters, body: dto }) => {
        const finishedMovie = await this.service.create(dto, parameters.userId);
        return { status: 201, body: finishedMovie };
      },
      getFinishedMovie: async ({ params: parameters }) => {
        const finishedMovie = await this.service.get(
          parameters.id,
          parameters.userId,
        );
        return { status: 200, body: finishedMovie };
      },
      getAllFinishedMovies: async ({ params: parameters }) => {
        const finishedMovies = await this.service.getAll(parameters.userId);
        return { status: 200, body: finishedMovies };
      },
      deleteFinishedMovie: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
    });
  }
}
