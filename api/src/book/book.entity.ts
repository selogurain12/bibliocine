import { Entity, Property } from "@mikro-orm/postgresql";

@Entity()
export class Book {
  @Property({
    type: "varchar",
  })
  public id!: string;

  @Property({ type: "varchar" })
  public title!: string;

  @Property({ type: "array" })
  public authors!: string[];

  @Property({ type: "varchar" })
  public publisher!: string;

  @Property({ type: "varchar" })
  public imageLink!: string;

  @Property({ type: "varchar" })
  public publisherDate!: string;

  @Property({ type: "text" })
  public description!: string;

  @Property({ type: "varchar" })
  public industryIdentifierstype!: string | undefined;

  @Property({ type: "varchar" })
  public industryIdentifieridentyfier!: string | undefined;

  @Property({ type: "int" })
  public pageCount!: number;

  @Property({ type: "array" })
  public categories!: string[];

  @Property({ type: "int" })
  public retailPriceamount!: number | undefined;

  @Property({ type: "varchar" })
  public retailPricecurrencyCode!: string | undefined;

  @Property({ type: "varchar" })
  public retailPricebuyLink!: string | undefined;
}
