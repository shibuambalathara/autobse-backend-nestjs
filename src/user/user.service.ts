import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserWhereUniqueInput } from './dto/user-where.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { s3Service } from 'src/services/s3/s3.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Service: s3Service,
  ) {}

  async getAllUsers(): Promise<User[] | null> {
    const allUsers = await this.prisma.user.findMany({
      where: { isDeleted: false },include:{states:true,
        emdUpdates:{include:{payment:true}}
        },
    });
    const userWithCounts = await Promise.all(allUsers.map(async (user) => {
      const paymentCount = await this.prisma.payment.count({
         where: { userId: user.id },
       });
   
         return {
           ...user,
           paymentsCount: paymentCount,  
         };
       }));
   
       return userWithCounts;  
  }

  async getUserByConditions(
    conditions: UserWhereUniqueInput,
    sortOrder: 'asc' | 'desc',
  ): Promise<User | null> {
    const data = await this.prisma.user.findFirst({
      where: {
        ...conditions,
        isDeleted: false,
      },
      include: {
        payments: {
          orderBy: {
            createdAt: sortOrder, 
          },
        },
        states:true,
        emdUpdates:{include:{payment:true}}
        
      },
    });
    if(!data) throw new NotFoundException('User not found.')
      if (data?.pancard_image) {
        const file = await this.s3Service.getUploadedFile(data.pancard_image)
        data.pancard_image = file ? file : null
      }
      if (data?.aadharcard_front_image) {
        const file = await this.s3Service.getUploadedFile(data.aadharcard_front_image)
        data.aadharcard_front_image = file ? file : null
      }
      if (data?.aadharcard_back_image) {
        const file = await this.s3Service.getUploadedFile(data.aadharcard_back_image)
        data.aadharcard_back_image = file ? file : null
      }
      if (data?.driving_license_front_image) {
        const file = await this.s3Service.getUploadedFile(data.driving_license_front_image)
        data.driving_license_front_image = file ? file : null
      }
      if (data?.driving_license_back_image) {
        const file = await this.s3Service.getUploadedFile(data.driving_license_back_image)
        data.driving_license_back_image = file ? file : null
      }
      return data
    
  }
  async findOneByMobile(mobile: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { mobile } ,include:{states:true}});

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
          username:`auto${data?.mobile}`
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
          `The ${field} is already exist. Please check ${field}.`,
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
    let updateData = { ...updatingData };
  
  
    if (updatingData?.password) {
      const hashedPassword = await bcrypt.hash(updatingData.password, 10);
      updateData.password = hashedPassword;
    }
  
    const updatedUser = await this.prisma.user.update({
      where,
      data: updateData,
    });
  
     return updatedUser;
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
    async countUsers():Promise<number |0>{
      const usersCount=await this.prisma.user.count({where:{isDeleted:false}})
      return usersCount
    }
}
