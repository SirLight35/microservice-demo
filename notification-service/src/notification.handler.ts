import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class NotificationController {
  @MessagePattern("user.created")
  async handleUserCreated(@Payload() data: { email: string; name: string }) {
    console.log(`--- SIMULATING EMAIL SENT ---`);
    console.log(`To: ${data.email}`);
    console.log(`Hello ${data.name}, welcome to our platform!`);
    console.log(`------------------------------`);
    
    // In a real app, you'd inject an EmailService here (SendGrid, Mailgun, etc.)
  }
}