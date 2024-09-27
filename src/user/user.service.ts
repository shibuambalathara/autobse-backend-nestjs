import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserWhereUniqueInput } from './dto/user-where.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[] | null> {
    const allUsers = await this.prisma.user.findMany({
      where: { isDeleted: false },
    });

    return allUsers;
  }

  async getUserByConditions(
    conditions: UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        ...conditions,
        isDeleted: false,
      },
    });
  }
  async findOneByMobile(mobile: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { mobile } });

    return user;
  }
  async saveAccessToken(id: string, token: string): Promise<void> {
    await this.prisma.user.update({
      data: { accessToken: token },
      where: { id },
    });
  }

  async createUser(data: CreateUserInput): Promise<User> {
    try {
      const hashedPassword = data.password
        ? await bcrypt.hash(data.password, 10)
        : undefined;

      const createdUser = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return createdUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const field = error.meta?.target ? error.meta.target : 'field';
        throw new Error(
          `The ${field} is not unique. Please use a different ${field}.`,
        );
      }
      console.error('Unexpected error:', error);
      throw new Error(error);
    }
  }

  async updateUserField(
    updatingData: UpdateUserInput,
    where: UserWhereUniqueInput,
  ): Promise<User | null> {
    const hashedPassword = updatingData.password
    ? await bcrypt.hash(updatingData.password, 10)
    : undefined;
    const updatedUsers = await this.prisma.user.updateMany({
      where: { ...where, isDeleted: false },
      data: {...updatingData,password: hashedPassword},
    });

    if (updatedUsers.count > 0) {
      return this.prisma.user.findUnique({
        where: where as Prisma.UserWhereUniqueInput,
      });
    }
  }
  async deleteUser(where: UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.update({
      data: { isDeleted: true },
      where: where as Prisma.UserWhereUniqueInput,
    });
  }
  async deletedUser(where: UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { ...(where as Prisma.UserWhereUniqueInput), isDeleted: true },
    });
  }
  async allDeletedUsers(): Promise<User[]> {
    return this.prisma.user.findMany({ where: { isDeleted: true } });
  }

  async restoreUser(where: UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.update({
      data: { isDeleted: false },
      where: where as Prisma.UserWhereUniqueInput,
    });
  }

  // only for dev purpose delete user permenently

  async DeleteUserPermenently(
    where: UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.delete({
      where: where as Prisma.UserWhereUniqueInput,
    });
  }
}
