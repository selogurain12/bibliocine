import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(private readonly notificationService: NotificationService) {}

  // Toutes les minutes
  @Cron('* * * * *')
  async sendDailyNotification() {
    this.logger.log('Envoi de la notification programmée');

    const tokens = this.notificationService.getAllTokens();

    if (!tokens.length) {
      this.logger.log('Aucun token enregistré, pas de notification envoyée');
      return;
    }

    for (const token of tokens) {
      await this.notificationService.sendPushNotification(
        token,
        'Notification programmée',
        'Ceci est une notification envoyée automatiquement',
      );
    }
  }
}
