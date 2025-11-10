import { randomUUID } from "crypto";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { User } from "../user/user.entity";

@Entity()
export class FinishedBook {
  @PrimaryKey({ type: UuidType })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  public bookId: string;

  @ManyToOne(() => User, { ref: true })
  public user: Ref<User>;

  public constructor(parameters: { bookId: string; user: User }) {
    this.bookId = parameters.bookId;
    this.user = ref(parameters.user);
  }
}
