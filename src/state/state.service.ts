import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';

@Injectable()
export class StateService {
  constructor(private readonly prisma:PrismaService){}

  async createState(createStateInput: CreateStateInput) {
    try{
        return await this.prisma.state.create({
          data:{
            ...createStateInput,
          }
        });
      }
    catch(error){
        throw new Error(error.message)
          }
      }

  async getAllState() {
    const state = await this.prisma.state.findMany({where:{isDeleted:false}});
    if(!state) throw new NotFoundException("State Not Found!");    
    return state;
  }

  async getState(id: string) {
    const state = await this.prisma.state.findUnique({
      where: { id , isDeleted:false},
    });
    if (!state) throw new NotFoundException('State Not Found!');
    return state;
  }

 async updateState(id: string, updateStateInput: UpdateStateInput) {
  try {
      const state = await this.prisma.state.findUnique({where:{id,isDeleted:false,}})
      if(!state) throw new NotFoundException("State Not Found");
      return await this.prisma.state.update({
          where:{
            id,
          },
          data:{
            ...updateStateInput,
          }
        });
      }
  catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }
 
 async removeState(id: string) {
  const state = await this.prisma.state.findUnique({where:{id,isDeleted:false,}})
  if(!state) throw new NotFoundException("State Not Found");
  return await this.prisma.state.update({
      where:{id},
      data:{
        isDeleted:true,
      }
    });
  }
  

  async getAllDeletedState(){
    const state = await this.prisma.state.findMany({where:{isDeleted:true,}});
    if(!state) throw new NotFoundException("State Not Found");
    return state;
  }

  async getDeletedState(id:string){
      const state = await this.prisma.state.findUnique({where:{id,isDeleted:true}});
      if(!state) throw new NotFoundException("State Not Found");
      return state;
  }
}
