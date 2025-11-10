import { randomUUID } from "crypto";
import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
  UuidType,
} from "@mikro-orm/postgresql";
import { Bibliotheque } from "../bibliotheque/bibliotheque.entity";
import { BookInProgress } from "../bookInProgress/bookInProgress.entity";
import { Filmotheque } from "../filmotheque/filmotheque.entity";
import { FinishedBook } from "../finishedBook/finishedBook.entity";
import { FinishedMovie } from "../finishedMovie/finishedMovie.entity";
import { Friendlist } from "../friendlist/friendlist.entity";
import { MovieInProgress } from "../movieInProgress/movieInProgress.entity";
import { Stat } from "../stat/stat.entity";

@Entity()
export class User {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  public firstName: string;

  @Property({ type: "varchar" })
  public lastName: string;

  @Property({ type: "varchar" })
  public email: string;

  @Property({ type: "varchar" })
  public username: string;

  @Property({ type: "varchar", nullable: true })
  public avatarUrl: string | null;

  @Property({ type: "varchar", hidden: true })
  public password: string;

  @ManyToMany(() => Filmotheque, (filmotheque) => filmotheque.users)
  public filmotheques = new Collection<Filmotheque>(this);

  @ManyToMany(() => Bibliotheque, (bibliotheque) => bibliotheque.users)
  public bibliotheques = new Collection<Bibliotheque>(this);

  @ManyToMany(() => Friendlist, (friendlist) => friendlist.friends)
  public friendlists = new Collection<Friendlist>(this);

  @OneToMany(() => Friendlist, (friendlist) => friendlist.user)
  public ownerFriendlists = new Collection<Friendlist>(this);

  @OneToMany(() => FinishedMovie, (finishedMovie) => finishedMovie.user)
  public finishedMovies = new Collection<FinishedMovie>(this);

  @OneToMany(() => FinishedBook, (finishedBook) => finishedBook.user)
  public finishedBooks = new Collection<FinishedBook>(this);

  @OneToMany(() => BookInProgress, (bookInProgress) => bookInProgress.user)
  public bookInProgress = new Collection<BookInProgress>(this);

  @OneToMany(() => MovieInProgress, (movieInProgress) => movieInProgress.user)
  public movieInProgress = new Collection<MovieInProgress>(this);

  @OneToMany(() => Stat, (stat) => stat.user)
  public stats = new Collection<Stat>(this);

  public constructor(parameters: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    avatarUrl: string | null;
    password: string;
  }) {
    this.firstName = parameters.firstName;
    this.lastName = parameters.lastName;
    this.email = parameters.email;
    this.username = parameters.username;
    this.avatarUrl = parameters.avatarUrl;
    this.password = parameters.password;
  }
}
