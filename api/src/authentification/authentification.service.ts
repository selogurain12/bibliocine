import { HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { EntityManager } from "@mikro-orm/postgresql";
import { TsRestException } from "@ts-rest/nest";
import { User } from "../user/user.entity";
import type {
  CreateAccountDto,
  LoginDto,
} from "../../../packages/src/dtos/user.dto";
import { authContract } from "../../../packages/src/contracts/auth.contract";
import { AuthMapper } from "./authentification.mapper";
import { StatService } from "src/stat/stat.service";

@Injectable()
export class AuthService {
  public readonly em: EntityManager;

  private readonly mapper: AuthMapper;

  private readonly statService: StatService;
  constructor(
    em: EntityManager,
    mapper: AuthMapper,
    statService: StatService,
  ) {
    this.em = em;
    this.mapper = mapper;
    this.statService = statService;
  }

  async register(createUserDto: CreateAccountDto) {
    const em = this.em.fork();
    await em.begin();

    try {
      const { password, ...rest } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.mapper.createDtoToEntity({
        ...rest,
        password: hashedPassword,
      });

      await em.persistAndFlush(newUser);
      await em.commit();

      const token = this.generateJwtToken(
        newUser.id,
        newUser.email,
        `${newUser.firstName} ${newUser.lastName}`,
      );

      this.statService.create(newUser.id, { timeSeen: 0, pagesRead: 0});

      return { token, user: this.mapper.entityToDto(newUser) };
    } catch (error: unknown) {
      await em.rollback();

      if (error instanceof Error) {
        throw new TsRestException(authContract.register, {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            error: "InternalError",
            message: error.message,
          },
        });
      }

      throw new TsRestException(authContract.register, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          error: "InternalError",
          message: "Account creation failed",
        },
      });
    }
  }

  async findUserById(id: string) {
    const em = this.em.fork();
    const repository = em.getRepository(User);
    const entity = await repository.findOne({ id });
    if (!entity) {
      throw new TsRestException(authContract.login, {
        status: HttpStatus.NOT_FOUND,
        body: {
          error: "userNotFound",
          message: `User with ${id} not found`,
        },
      });
    }
    return this.mapper.entityToDto(entity);
  }

  async login(loginUserDto: LoginDto) {
    const em = this.em.fork();
    const repository = em.getRepository(User);
    const { email, username, password } = loginUserDto;
    const user = await repository.findOne({ email });

    if (!user) {
      throw new TsRestException(authContract.login, {
        status: HttpStatus.NOT_FOUND,
        body: {
          error: "userNotFound",
          message: `User with email ${email} not found`,
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new TsRestException(authContract.login, {
        status: HttpStatus.UNAUTHORIZED,
        body: {
          error: "unauthorized",
          message: "Password not valid",
        },
      });
    }

    const loginId = username ?? email;
    if (!loginId) {
      throw new Error("Username or email must be provided");
    }

    const token = this.generateJwtToken(
      user.id,
      loginId,
      `${user.firstName} ${user.lastName}`,
    );

    return { token, user };
  }

  private generateJwtToken(
    userId: string,
    email: string,
    name: string,
  ): string {
    const payload = { sub: userId, email, name };
    const secret = process.env.SECRET;

    if (!secret) {
      throw new Error("JWT Secret is not defined");
    }

    return jwt.sign(payload, secret);
  }
}
