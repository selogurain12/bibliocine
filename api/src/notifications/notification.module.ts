import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationController } from './notification.controller';

@Module({
  providers: [NotificationService, NotificationScheduler],
  controllers: [NotificationController],
})
export class NotificationModule {}
