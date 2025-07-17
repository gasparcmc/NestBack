import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { BusinessModule } from './business/business.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  isGlobal: true, // disponible en toda la app sin importar
  envFilePath: '.env', // opcional si tu archivo se llama .env y está en la raíz
}


const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.HOSTBD,
  port: parseInt(process.env.PORTBD || '5432'),
  username: process.env.USERNAMEBD,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};



@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),AuthModule, UserModule, RoleModule, BusinessModule,ConfigModule.forRoot(config), EmailModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
