import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(private readonly notificationService: NotificationService) {}

  // Tous les jours à 18h30
  @Cron('* * * * *')
  async sendDailyNotification() {
    this.logger.log('Envoi de la notification programmée');

    const tokens = [
      'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
      'ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]',
    ];

    for (const token of tokens) {
      await this.notificationService.sendPushNotification(
        token,
        'Notification programmée',
        'Ceci est une notification envoyée automatiquement à 18h30',
      );
    }
  }
}
