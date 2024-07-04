import { Injectable } from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';

@Injectable()
export class VehicleService {
  create(createVehicleInput: CreateVehicleInput) {
    return 'This action adds a new vehicle';
  }

  findAll() {
    return `This action returns all vehicle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  update(id: number, updateVehicleInput: UpdateVehicleInput) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }
}
