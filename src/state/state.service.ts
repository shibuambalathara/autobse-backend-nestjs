import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';
import { State } from '@prisma/client';

@Injectable()
export class StateService {
  constructor(private readonly prisma:PrismaService){}

  async createState(createStateInput: CreateStateInput) : Promise<State>{
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

  async States() : Promise<State[] | null> {
    const state = await this.prisma.state.findMany({where:{isDeleted:false}});
    if(!state) throw new NotFoundException("State Not Found!");    
    return state;
  }

  async State(id: string) : Promise<State | null> {
    const state = await this.prisma.state.findUnique({
      where: { id , isDeleted:false},
    });
    if (!state) throw new NotFoundException('State Not Found!');
    return state;
  }

 async updateState(id: string, updateStateInput: UpdateStateInput) : Promise<State> {
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
 
 async deleteState(id: string) : Promise<State> {
  const state = await this.prisma.state.findUnique({where:{id,isDeleted:false,}})
  if(!state) throw new NotFoundException("State Not Found");
  return await this.prisma.state.update({
      where:{id},
      data:{
        isDeleted:true,
      }
    });
  }
  

  async deletedStates() : Promise<State[] | null>{
    const state = await this.prisma.state.findMany({where:{isDeleted:true,}});
    if(!state) throw new NotFoundException("State Not Found");
    return state;
  }

  async deletedState(id:string): Promise<State | null>{
      const state = await this.prisma.state.findUnique({where:{id,isDeleted:true}});
      if(!state) throw new NotFoundException("State Not Found");
      return state;
  }
}
