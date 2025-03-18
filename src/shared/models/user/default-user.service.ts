import { DocumentType, types } from '@typegoose/typegoose';

import { UserService } from '../user/dto/user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger-interface.js';
import { Component } from '../../types/component.enum.js';
import { UpdateUserDto } from './dto/update-user.dto.js';


@injectable()
export class DefaultUserService implements UserService {
  constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(author: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(author, dto, { new: true })
      .exec();
  }

  public async findStatusById(author: string): Promise<boolean | undefined> {
    const user = await this.userModel.findById(author);
    return user?.isLoggedIn;
  }

  public async findStatusByEmail(email: string): Promise<boolean | undefined> {
    const user = await this.findByEmail(email);
    return user?.isLoggedIn;
  }

  // вход в закрытую часть приложения
  public async login(author: string): Promise<void> {
    const user = await this.userModel.findById(author);

    this.updateById(author, {...user, isLoggedIn: true});

  }

  public async logout(author: string): Promise<void> {
    const user = await this.userModel.findById(author);

    this.updateById(author, {...user, isLoggedIn: false});

  }
}

