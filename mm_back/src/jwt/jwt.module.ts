import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS, JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [
        {
          provide: JwtService,
          useClass: JwtService,
        },
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
