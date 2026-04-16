import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { User, Outbox } from "./user.entity";
import { UsersHandler } from "./users.handler";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "users.db",
      entities: [User, Outbox],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Outbox]),
    ClientsModule.register([
      {
        name: "RABBITMQ_CLIENT",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
          queue: "notifications_queue",
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [UsersHandler],
  providers: [UsersService],
})
export class UsersAppModule {}
