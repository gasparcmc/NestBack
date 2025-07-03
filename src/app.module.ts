import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { BusinessModule } from './business/business.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'nestjs',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

const config = {
  isGlobal: true, // disponible en toda la app sin importar
  envFilePath: '.env', // opcional si tu archivo se llama .env y está en la raíz
}


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),AuthModule, UserModule, RoleModule, BusinessModule,ConfigModule.forRoot(config),],
  controllers: [],
  providers: [],
})
export class AppModule {}
