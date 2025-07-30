import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { UploadService } from '../upload/upload.service';
import { User } from '../user/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Producto, User])],
  controllers: [ProductoController],
  providers: [ProductoService, UploadService],
  exports: [TypeOrmModule]

})
export class ProductoModule {}
