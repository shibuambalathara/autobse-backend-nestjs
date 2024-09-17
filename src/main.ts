import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe());
 app.enableCors({
  credentials: true,
  origin: ['http://localhost:3000','http://localhost:3001'],
});
  await app.listen(3000);
}
bootstrap();

