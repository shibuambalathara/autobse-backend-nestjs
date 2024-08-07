import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserWhereUniqueInput } from './dto/user-where.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
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

    const user=await this.prisma.user.findUnique({ where: {mobile} });
   
    return user
  }
  async saveAccessToken(id: string, token: string): Promise<void> {
    await this.prisma.user.update({data:{accessToken:token},where:{id}});
  }

  async createUser(data: CreateUserInput): Promise<User> {
    try {
      console.log("dattta",data)
      let hashedPassword=''
      if(data?.password){
         hashedPassword = await bcrypt.hash(data?.password, 10);
      }
      return this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (err) {
      console.log(err);
      throw err
    }
  }
  async updateUserField(
    updatingData: UpdateUserInput,
    where: UserWhereUniqueInput,
  ): Promise<User | null> {
    const updatedUsers = await this.prisma.user.updateMany({
      where: { ...where, isDeleted: false },
      data: updatingData,
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
}
