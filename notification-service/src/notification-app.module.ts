import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.handler";

@Module({
  imports: [],
  controllers: [NotificationController],
})
export class NotificationAppModule {}