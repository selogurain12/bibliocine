import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { MikroORM } from "@mikro-orm/postgresql";
import { TsRestException } from "@ts-rest/nest";
import type {
  CreateFriendlistDto,
  FriendlistDto,
  UpdateFriendlistDto,
} from "../../../packages/src/dtos/friendlist.dto";
import type { ListResult } from "../../../packages/src/dtos/list-result.dto";
import { friendlistContract } from "../../../packages/src/contracts/friendlist.contract";
import { Friendlist } from "./friendlist.entity";
import { FriendlistMapper } from "./friendlist.mapper";

@Injectable()
export class FriendlistService {
  private readonly orm: MikroORM;

  private readonly friendlistMapper: FriendlistMapper;

  constructor(orm: MikroORM, friendlistMapper: FriendlistMapper) {
    this.orm = orm;
    this.friendlistMapper = friendlistMapper;
  }

  async create(
    userId: string,
    createDto: CreateFriendlistDto,
  ): Promise<FriendlistDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Friendlist);
      const existingFriendlist = await repository.findOne({ id: userId });
      if (!existingFriendlist) {
        throw new ConflictException("This user have already friendlist");
      }
      const item = await this.friendlistMapper.createDtoToEntity(
        createDto,
        userId,
        em,
      );
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user", "friends"]);
      return await this.friendlistMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      const message =
        error instanceof Error
          ? error.message || "Friendlist creation failed"
          : "Frienlist creation failed";
      throw new InternalServerErrorException(message);
    }
  }

  async getAllFriend(userId: string): Promise<ListResult<FriendlistDto>> {
    const em = this.orm.em.fork();
    const qb = em.qb(Friendlist).where({ user: { id: userId } });
    const [entities, total] = await qb.getResultAndCount();
    await em.populate(entities, ["user", "friends"]);
    return {
      data: await this.friendlistMapper.entitiesToDtos(entities, userId, em),
      total,
    };
  }

  async update(
    id: string,
    userId: string,
    updateFriendlistDto: UpdateFriendlistDto,
  ): Promise<FriendlistDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Friendlist);
      const existingEntity = await repository.findOne({
        id,
        user: { id: userId },
      });
      if (!existingEntity) {
        throw new TsRestException(friendlistContract.updateFriendlist, {
          status: 404,
          body: {
            error: "FriendlistNotFound",
            message: `Friendlist with id ${id} not found`,
          },
        });
      }
      const item = await this.friendlistMapper.updateDtoToEntity(
        id,
        updateFriendlistDto,
        em,
      );
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.friendlistMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(friendlistContract.updateFriendlist, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Friendlist update failed",
            },
          })
        : new TsRestException(friendlistContract.updateFriendlist, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Friendlist update failed",
            },
          });
    }
  }

  async removeFriend(userId: string, friendId: string): Promise<FriendlistDto> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(Friendlist);

      const friendlist = await repository.findOne(
        { user: { id: userId } },
        { populate: ["user", "friends"] },
      );

      if (!friendlist) {
        throw new TsRestException(friendlistContract.updateFriendlist, {
          status: 404,
          body: {
            error: "FriendlistNotFound",
            message: `Friendlist for user ${userId} not found`,
          },
        });
      }

      const friendToRemove = friendlist.friends
        .getItems()
        .find((friend) => friend.id === friendId);
      if (!friendToRemove) {
        throw new TsRestException(friendlistContract.updateFriendlist, {
          status: 404,
          body: {
            error: "FriendNotFound",
            message: `Friend with id ${friendId} not found in friendlist`,
          },
        });
      }

      friendlist.friends.remove(friendToRemove);
      await em.persistAndFlush(friendlist);
      await em.commit();
      await em.populate(friendlist, ["user", "friends"]);

      return await this.friendlistMapper.entityToDto(friendlist, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(friendlistContract.updateFriendlist, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalError",
              message: error.message || "Friend removal failed",
            },
          })
        : new TsRestException(friendlistContract.updateFriendlist, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalError",
              message: "Friend removal failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(Friendlist);
      const entity = await repository.findOne({
        $and: [{ id }, { user: { id: userId } }],
      });
      if (!entity) {
        throw new NotFoundException(`Friendlist with id ${id} not found`);
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      const message =
        error instanceof Error
          ? error.message || "Friendlist delete failed"
          : "Friendlist delete failed";
      throw new InternalServerErrorException(message);
    }
  }
}
