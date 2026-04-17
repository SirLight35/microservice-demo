import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UsersController } from "./users.controller";
import { AuthModule } from "../auth/auth.module";
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: "USERS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "users_queue",
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [UsersController],
})
export class UserModule {}
