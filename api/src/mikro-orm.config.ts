import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import * as dotenv from "dotenv";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Bibliotheque } from "./bibliotheque/bibliotheque.entity";
import { BookInProgress } from "./bookInProgress/bookInProgress.entity";
import { Filmotheque } from "./filmotheque/filmotheque.entity";
import { FinishedBook } from "./finishedBook/finishedBook.entity";
import { FinishedMovie } from "./finishedMovie/finishedMovie.entity";
import { Friendlist } from "./friendlist/friendlist.entity";
import { MovieInProgress } from "./movieInProgress/movieInProgress.entity";
import { Stat } from "./stat/stat.entity";
import { User } from "./user/user.entity";
dotenv.config();

const config: Options<PostgreSqlDriver> = {
  host: process.env.DBHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  dbName: process.env.PGDATABASE,
  debug: true,
  driver: PostgreSqlDriver,
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
  entities: [
    Bibliotheque,
    BookInProgress,
    Filmotheque,
    FinishedBook,
    FinishedMovie,
    Friendlist,
    MovieInProgress,
    Stat,
    User,
  ],
  migrations: {
    path: "./src/migrations",
  },
};

export default config;
