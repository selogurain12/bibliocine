import { Controller, UseGuards } from "@nestjs/common";
import { TsRest, tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { notificationContract } from "../../../packages/src/contracts/notification.contract";
import { AuthGuard } from "src/authentification/authentification.guard";
import { NotificationService } from "./notification.service";

@Controller()
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @TsRestHandler(notificationContract)
  public handle() {
    return tsRestHandler(notificationContract, {
      registerToken: async ({ body: dto }) => {
        this.service.saveToken(dto.token);

        // Optionnel : envoyer une notif test immédiate
        await this.service.sendPushNotification(
          dto.token,
          "Inscription réussie",
          "Tu recevras désormais les notifications."
        );

        return { status: 200, body: { success: true } };
      },
    });
  }
}
