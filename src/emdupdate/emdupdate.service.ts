import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmdupdateInput } from './dto/create-emdupdate.input';
import { UpdateEmdupdateInput } from './dto/update-emdupdate.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Emdupdate } from './models/emdupdate.model';
import { EmdUpdate, Prisma } from '@prisma/client';
import { EmdUpdateWhereUniqueInput } from './dto/unique-emdupdate';

@Injectable()
export class EmdupdateService {

  constructor(private readonly prisma: PrismaService) {}
  
  async createEmdUpdate(
    id: string, 
    paymentId: string, 
    userId: string, 
    createEmdupdateInput: CreateEmdupdateInput
  ): Promise<EmdUpdate | null> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        
        const createEmd = await prisma.emdUpdate.create({
          data: {
            ...createEmdupdateInput,
            createdById: id,
            userId: userId,
            paymentId: paymentId,
          },
        });
  
        
        const updateUserVehicleBuyingLimit = await prisma.user.update({
          where: { id: userId },
          data: {
            vehicleBuyingLimit: {
              increment: createEmdupdateInput?.vehicleBuyingLimitIncrement ?? 0,
            },
          },
        });
  
        return createEmd;
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

  async emdUpdates() : Promise<EmdUpdate[] | null> {
    const emd = await this.prisma.emdUpdate.findMany({
      where: {
        isDeleted:false,
      },
      include:{
        payment:true,
        user:true,
        createdBy:true
      }
      
    });
    if(!emd) throw new NotFoundException(" Not Found");
    return emd;
  }

  async emdUpdate(where:EmdUpdateWhereUniqueInput) : Promise<EmdUpdate | null> {
    const emd =await this.prisma.emdUpdate.findUnique({
      where: {
        ...where as Prisma.EmdUpdateWhereUniqueInput,
        isDeleted:false,
      },
      include:{payment:true,
        user:true,
        createdBy:true
      }
    });
    if(!emd) throw new NotFoundException(" Not Found");
    return emd;
  }

  async updateEmd( where:EmdUpdateWhereUniqueInput,updateEmdupdateInput: UpdateEmdupdateInput) {
    try {
      const emd = await this.prisma.emdUpdate.findUnique({
        where: { ...where as Prisma.EmdUpdateWhereUniqueInput, isDeleted: false },
      });
      if (!emd) throw new NotFoundException(' Not Found');
      return await this.prisma.emdUpdate.update({
        where: {
          ...where as Prisma.EmdUpdateWhereUniqueInput,
        },
        data: {
          ...updateEmdupdateInput,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new Error(error.message);
      }
    }
  

  }

  async deleteEmdupdate(where:EmdUpdateWhereUniqueInput) : Promise<EmdUpdate|null>{
    const emd = await this.prisma.emdUpdate.findUnique({where:{...where as Prisma.EmdUpdateWhereUniqueInput,isDeleted:false,}});
    if(!emd) throw new NotFoundException(" Not Found");
    return await this.prisma.emdUpdate.update({
        where:{...where as Prisma.EmdUpdateWhereUniqueInput},
        data:{
          isDeleted:true,
        }
      });
    }
}
