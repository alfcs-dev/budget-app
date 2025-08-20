import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserSchema,
  UpdateUserSchema,
  CreateUser,
  UpdateUser,
  User,
} from '@budget-manager/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: CreateUser): Promise<Omit<User, 'password'>> {
    // Validate input using shared schema
    const validatedData = CreateUserSchema.parse(userData);

    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateData: UpdateUser): Promise<Omit<User, 'password'>> {
    // Validate input using shared schema
    const validatedData = UpdateUserSchema.parse(updateData);

    // Hash password if provided
    const dataToUpdate = { ...validatedData };
    if (validatedData.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(validatedData.password, saltRounds);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}