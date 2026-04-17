import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "./user.module";
import { OrderModule } from "./orders.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    OrderModule,
  ],
  controllers: [AppController],
})
export class GatewayModule {}
