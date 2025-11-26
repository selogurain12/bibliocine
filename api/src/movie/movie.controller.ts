import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { MovieService } from "../movie/movie.service";
import { movieContract } from "../../../packages/src/contracts/movie.contract";

@Controller()
@UseGuards(AuthGuard)
export class MovieController {
  private readonly service: MovieService;

  public constructor(service: MovieService) {
    this.service = service;
  }

  @TsRestHandler(movieContract)
  public handle() {
    return tsRestHandler(movieContract, {
      getMovie: async ({ params: parameters }) => {
        const movie = await this.service.getMovie(parameters.movieId);
        return { status: 200, body: movie };
      },
      getAllMovies: async ({ params: parameters }) => {
        console.log("salut")
        const movies = await this.service.searchMovie(parameters.search);
        return { status: 200, body: movies };
      },
    });
  }
}
