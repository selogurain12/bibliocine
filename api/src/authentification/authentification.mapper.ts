import { Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import type {
  CreateAccountDto,
  UserDto,
} from "../../../packages/src/dtos/user.dto";

@Injectable()
export class AuthMapper {
  public entityToDto(entity: User): UserDto {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      username: entity.username,
      avatarUrl: entity.avatarUrl,
    };
  }

  public entitiesToDtos(entities: User[]): UserDto[] {
    return entities.map((entity) => this.entityToDto(entity));
  }

  public createDtoToEntity(createDto: CreateAccountDto): User {
    return new User({
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      email: createDto.email,
      username: createDto.username,
      avatarUrl: createDto.avatarUrl,
      password: createDto.password,
    });
  }
}
