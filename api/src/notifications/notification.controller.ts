import { Controller, UseGuards } from "@nestjs/common";
import { TsRest, tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { notificationContract } from "../../../packages/src/contracts/notification.contract";
import { AuthGuard } from "src/authentification/authentification.guard";
import { NotificationService } from "./notification.service";

@Controller()
@UseGuards(AuthGuard)
export class NotificationController {
      private readonly service: NotificationService;
    
      public constructor(service: NotificationService) {
        this.service = service;
      }
  @TsRestHandler(notificationContract)
  public handle() {
    return tsRestHandler(notificationContract, {
        registerToken: async ({ body: dto }) => {
            await this.service.sendPushNotification(dto.token, "Test Notification", "This is a test notification.");
            return { status: 200, body: { success: true } };
        }
    });
  }
}
