import { DocumentType } from '@typegoose/typegoose';

import { UserEntity } from '../user.entity.js';
import { CreateUserDto } from './create-user.dto.js';
import { UpdateUserDto } from './update-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(author: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
}
