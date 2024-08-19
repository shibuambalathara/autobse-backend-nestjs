import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { BullBoardService } from './bull/bullboard.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(passport.initialize());
  // app.get<BullBoardService>(BullBoardService).onModuleInit();
  await app.listen(3000);

}
bootstrap();

