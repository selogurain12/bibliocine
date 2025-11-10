import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { friendlistContract } from "../../../packages/src/contracts/friendlist.contract";
import { FriendlistService } from "./friendlist.service";

@Controller()
@UseGuards(AuthGuard)
export class FriendlistController {
  private readonly service: FriendlistService;

  public constructor(service: FriendlistService) {
    this.service = service;
  }

  @TsRestHandler(friendlistContract)
  public handle() {
    return tsRestHandler(friendlistContract, {
      getAllFriendlist: async ({ params: parameters }) => {
        const friendlists = await this.service.getAllFriend(parameters.userId);
        return { status: 200, body: friendlists };
      },
      updateFriendlist: async ({ params: parameters, body: dto }) => {
        const friendlist = await this.service.update(
          parameters.id,
          parameters.userId,
          dto,
        );
        return { status: 200, body: friendlist };
      },
      deleteFriend: async ({ params: parameters }) => {
        await this.service.removeFriend(parameters.userId, parameters.friendId);
        return { status: 200, body: undefined };
      },
    });
  }
}
