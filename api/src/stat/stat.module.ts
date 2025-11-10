import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { FilmothequeModule } from "../filmotheque/filmotheque.module";
import { BibliothequeModule } from "../bibliotheque/bibliotheque.module";
import { FinishedBookModule } from "../finishedBook/finishedBook.module";
import { FinishedMovieModule } from "../finishedMovie/finishedMovie.module";
import { BookInProgressModule } from "../bookInProgress/bookInProgress.module";
import { MovieInProgressModule } from "../movieInProgress/movieInProgress.module";
import { StatMapper } from "./stat.mapper";
import { StatService } from "./stat.service";
import { StatController } from "./stat.controller";
import { Stat } from "./stat.entity";

@Module({
  imports: [
    MikroOrmModule.forFeature([Stat]),
    UserModule,
    FilmothequeModule,
    BibliothequeModule,
    FinishedBookModule,
    FinishedMovieModule,
    BookInProgressModule,
    MovieInProgressModule,
  ],
  controllers: [StatController],
  providers: [StatService, StatMapper],
  exports: [StatService],
})
export class StatModule {}
