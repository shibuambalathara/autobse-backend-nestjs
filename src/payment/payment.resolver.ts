import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './models/payment.model';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { PaymentWhereUniqueInput } from './dto/unique-payment.input';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(returns => Payment)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('dealer','admin','staff')
  async createPayment(@Args('createPaymentInput') createPaymentInput: CreatePaymentInput,@Context() context,@Args('userId', { nullable: true }) userId?: string ):Promise<Payment|null> {
    const { id, roles } = context.req.user; 
    console.log("role",context.req.user.roles);
  
    if (roles === 'dealer' && userId && userId !== id) {
      throw new Error('Dealers can only create payments for themselves.');
    }

    
    if ((roles !== 'admin' && roles !== 'staff')  && userId && userId !== id) {
      throw new Error('You do not have permission to create payments for other users.');
    }

    const paymentUserId = userId || id ;

    return this.paymentService.createPayment(createPaymentInput,paymentUserId,context);
  }

  @Query(returns => [Payment])
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  async payments() :Promise<Payment[]|null> {
    return this.paymentService.payments();
  }

  @Query(returns => Payment)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','dealer','staff')
  async payment(@Args('where') where:PaymentWhereUniqueInput):Promise<Payment|null> {
    return this.paymentService.payment(where);
  }

  @Mutation(returns => Payment)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','dealer','staff')
  async updatePayment(@Args('where') where:PaymentWhereUniqueInput,@Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput):Promise<Payment|null> {
    return this.paymentService.updatePayment(where.id, updatePaymentInput);
  }

  @Mutation(returns => Payment)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletePayment(@Args('where') where:PaymentWhereUniqueInput):Promise<Payment|null>  {
    return this.paymentService.deletePayment(where.id);
  }

  @Query(returns => [Payment])
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedPayments():Promise<Payment[]|null>{
    return this.paymentService.deletedPayments();
   }
   
  @Query(returns => Payment)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedPayment(@Args('where') where:PaymentWhereUniqueInput):Promise<Payment|null>{
    return this.paymentService.deletedPayment(where.id);
   }
  
  @Mutation(returns => Payment)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async restorePayment(@Args('where') where:PaymentWhereUniqueInput):Promise<Payment|null>{
    return this.paymentService.restorePayment(where);
  }

  @Query(() => Int)
  async paymentsCount(): Promise<number> {
  return this.paymentService.countPayments();
  }
  
}
