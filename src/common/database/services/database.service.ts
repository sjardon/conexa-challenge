import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENUM_APP_ENVIRONMENT } from '../../../app/constants/app.enum.constant';
import * as fs from 'fs';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}
  generateConnection(): TypeOrmModuleOptions {
    // POSTGRES_USER=admin
    // POSTGRES_PASSWORD=admin
    // POSTGRES_DB=trading
    // POSTGRES_HOST=localhost
    // POSTGRES_HOST=5432

    const env = this.configService.get<string>('app.env');
    const debug = this.configService.get<boolean>('db.postgres.debug');
    const host = this.configService.get<string>('db.postgres.host');
    const port = this.configService.get<number>('db.postgres.port');
    const database = this.configService.get<string>('db.postgres.name');
    const username = this.configService.get<string>('db.postgres.user');
    const password = this.configService.get<string>('db.postgres.password');

    const caCertPath = this.configService.get<string>('db.postgres.caCert');

    const ssl =
      this.configService.get<string>('db.postgres.ssl') == 'TRUE'
        ? caCertPath
          ? {
              rejectUnauthorized: true,
              ca: fs.readFileSync(caCertPath),
            }
          : {
              rejectUnauthorized: false,
            }
        : false;

    const url = `postgresql://${username}:${password}@${host}:${port}/${database}?${ssl}`;

    return {
      type: 'postgres',
      host,
      port,
      database,
      username,
      password,
      // url,
      ssl,
      autoLoadEntities: true,
      synchronize: env == ENUM_APP_ENVIRONMENT.LOCAL ? true : false,
    };
  }
}
