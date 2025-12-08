import { Injectable, Logger } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  private readonly expo = new Expo();
  private readonly logger = new Logger(NotificationService.name);

  private readonly tokens = new Set<string>();

  saveToken(token: string) {
    if (!Expo.isExpoPushToken(token)) {
      this.logger.error(`Token invalide (non expo) : ${token}`);
      return;
    }

    if (!this.tokens.has(token)) {
      this.logger.log(`Enregistrement du token : ${token}`);
      this.tokens.add(token);
    }
  }

  getAllTokens(): string[] {
    return Array.from(this.tokens);
  }

  async sendPushNotification(token: string, title: string, body: string) {
    if (!Expo.isExpoPushToken(token)) {
      this.logger.error(`Token invalide : ${token}`);
      return;
    }

    const messages = [
      {
        to: token,
        sound: 'default',
        title,
        body,
      },
    ];

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
        this.logger.log(`Notification envoyée à ${token}`);
      } catch (error) {
        this.logger.error('Erreur lors de l’envoi', error);
      }
    }
  }
}
