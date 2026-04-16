import { Injectable, NotFoundException, ConflictException, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,DataSource} from 'typeorm';
import { User } from './user.entity';
import { Outbox } from './user.entity';
@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly dataSource: DataSource,
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  onModuleInit() {
    setInterval(() => this.processOutbox(), 5000);
  }

  private async processOutbox() {
    try {
      const unsentMessages = await this.dataSource.manager.find(Outbox, {
        where: { isProcessed: false },
      });

      for (const msg of unsentMessages) {
        this.logger.log(`Publishing outbox message: ${msg.type}`);
        // Emit is fire-and-forget for RabbitMQ
        this.client.emit(msg.type, JSON.parse(msg.payload));
        
        msg.isProcessed = true;
        msg.ProcessedAt = new Date();
        await this.dataSource.manager.save(msg);
      }
    } catch (error) {
      this.logger.error('Error processing outbox', error);
    }
  }

  async create(data: { email: string; name: string }): Promise<User> {
   const queryRunner = this.dataSource.createQueryRunner();
   await queryRunner.connect();
   await queryRunner.startTransaction();
   try {
    const existing = await queryRunner.manager.findOne(User, { where: { email: data.email } });
    if(existing) throw new ConflictException(`Email ${data.email} already in use`) 
    
    const user = queryRunner.manager.create(User, data);
    const savedUser = await queryRunner.manager.save(user);
    
    const outbox = queryRunner.manager.create(Outbox, {
      type: 'user.created',
      payload: JSON.stringify({email:savedUser.email,name:savedUser.name}),
    });
    await queryRunner.manager.save(outbox);
    await queryRunner.commitTransaction();
    return savedUser;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: string, data: { name?: string }): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.repo.save(user);
  }
}
