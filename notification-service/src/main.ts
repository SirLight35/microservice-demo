import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationAppModule } from './notification-app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationAppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'notifications_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.listen();
  console.log('Notification Microservice is listening...');
}
bootstrap();