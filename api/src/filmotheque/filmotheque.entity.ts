import { randomUUID } from "crypto";
import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  UuidType,
} from "@mikro-orm/postgresql";
import { User } from "../user/user.entity";

@Entity()
export class Filmotheque {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  public name: string;

  @Property({ nullable: true })
  public imageUrl: string | null;

  @Property({ type: "array" })
  public movies: string[] | undefined;

  @ManyToMany(() => User, (user) => user.filmotheques, { owner: true })
  public users = new Collection<User>(this);

  public constructor(parameters: {
    name: string;
    movies: string[] | undefined;
    imageUrl: string | null;
  }) {
    this.name = parameters.name;
    this.movies = parameters.movies;
    this.imageUrl = parameters.imageUrl;
  }
}
