/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { PlaidModule } from './plaid.module';

import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(PlaidModule);

  // microservice connection
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'userplaid',
      protoPath: join(__dirname, './protos/user_plaid_service.proto'),
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
      url: 'localhost:5554',
    },
  });

  await app.startAllMicroservices();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 5555;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
