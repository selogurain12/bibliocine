import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { HttpException, Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import { UserMapper } from "../user/user.mapper";
import type {
  BookInProgressDto,
  CreateBookInProgressDto,
  UpdateBookInProgressDto,
} from "../../../packages/src/dtos/bookInProgress.dto";
import { BookInProgress } from "./bookInProgress.entity";

@Injectable()
export class BookInProgressMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }
  public async entityToDto(
    entity: BookInProgress,
    userId: string,
    em: EntityManager,
  ): Promise<BookInProgressDto> {
    const user = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return {
      id: entity.id,
      bookId: entity.bookId,
      currentPage: entity.currentPage,
      user: this.userMapper.entityToDto(user),
    };
  }

  public async entitiesToDtos(
    entities: BookInProgress[],
    userId: string,
    em: EntityManager,
  ): Promise<BookInProgressDto[]> {
    return Promise.all(
      entities.map(async (entity) => this.entityToDto(entity, userId, em)),
    );
  }

  public async createDtoToEntity(
    dto: CreateBookInProgressDto,
    userId: string,
    em: EntityManager,
  ): Promise<BookInProgress> {
    const userEntity = await em
      .getRepository(User)
      .findOne({ id: { $eq: userId } });
    if (!userEntity) {
      throw new HttpException("No user found", 404);
    }
    return new BookInProgress({
      bookId: dto.bookId,
      currentPage: dto.currentPage,
      user: userEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    dto: UpdateBookInProgressDto,
    userId: string,
    em: EntityManager,
  ): Promise<BookInProgress> {
    const entity = await em.getRepository(BookInProgress).findOne({
      id,
      user: { id: userId },
    });
    if (!entity) {
      throw new HttpException("No user found", 404);
    }
    return em.assign(entity, { currentPage: dto.currentPage });
  }
}
