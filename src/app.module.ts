
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './auth/auth.module';
import { StateModule } from './state/state.module';
import { LocationModule } from './location/location.module';
import { VehiclecategoryModule } from './vehiclecategory/vehiclecategory.module';
import { SellerModule } from './seller/seller.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { EventModule } from './event/event.module';
import { ExceluploadModule } from './excelupload/excelupload.module';
import { StatusModule } from './status/status.module';
import { PaymentModule } from './payment/payment.module';



@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }), 
    }),
    
    UserModule,
    AuthModule,
    StateModule,
    LocationModule,
    VehiclecategoryModule,
    SellerModule,
    VehicleModule,
    EventModule,
    ExceluploadModule,
    StatusModule,
    PaymentModule,


  ],
  providers: [
    PrismaService,
  ],
})
export class AppModule {}
