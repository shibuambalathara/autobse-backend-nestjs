import { Injectable } from '@nestjs/common';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StateService {
  constructor(private readonly prisma:PrismaService){}

  async createState(createStateInput: CreateStateInput) {
    return await this.prisma.state.create({
      data:{
        ...createStateInput,
      }
    });
  }

  async getAllState() {
    return await this.prisma.state.findMany();
  }

  async getState(id: string) {
    return await this.prisma.state.findUnique({
      where:{
        id,
      }
    });
  }

 async updateState(id: string, updateStateInput: UpdateStateInput) {
    return await this.prisma.state.update({
      where:{
        id,
      },
      data:{
        ...updateStateInput,
      }
    });
  }

 async removeState(id: string) {
    return await this.prisma.state.update({
      where:{id},
      data:{
        is_deleted:true,
      }
    });
  }
}
