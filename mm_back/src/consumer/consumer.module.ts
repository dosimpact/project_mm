import { OHLCV } from '@/finance/entities/OHLCV.entity';
import { FinanceModule } from '@/finance/finance.module';
import { PyShellModule } from '@/pyshell/py-shell.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ProcessorModule } from './processor.module';

// MSA - 2 consumer
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'production'),
        MAINTAINER: Joi.string().required(),
        // DB ENV
        DATABASE_URL: Joi.string().required(),
        DATABASE_IS_SSL: Joi.string().default('Y'),
        // SERVER PORT ENV
        PORT: Joi.number().required(),
        JWT_KEY: Joi.string().required(),
        // REDIST ENV
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_IS_TLS: Joi.string().default('Y'),
        // AWS ENV
        AWS_S3_BUCKET_NAME: Joi.string(),
        AWS_S3_ACCESS_KEY: Joi.string(),
        AWS_S3_SECRET_ACCESS_KEY: Joi.string(),
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        ...(process.env.REDIS_PASSWORD && {
          password: process.env.REDIS_PASSWORD,
        }),
        ...(process.env.REDIS_IS_TLS === 'Y' && {
          tls: {
            rejectUnauthorized: false,
          },
        }),
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_IS_SSL === 'Y' && {
        ssl: {
          rejectUnauthorized: true,
        },
      }),
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: false,
      entities: [OHLCV],
    }),
    PyShellModule.forRoot({
      mode: 'text',
      pythonPath: process.env.PYTHON_PATH,
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: 'py',
    }),
    FinanceModule,
    ProcessorModule,
  ],
})
export class ConsumerModule {}
