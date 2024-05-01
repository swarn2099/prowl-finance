// services/user-service/src/app/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@prowl/db-entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(uuid: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ uuid });
  }

  async create(email: string, name: string): Promise<User> {
    const newUser = this.userRepository.create({ email, name });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async update(uuid: string, attrs: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    await this.userRepository.save(user);
    return user;
  }

  async remove(uuid: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
    return user;
  }
}
