import { Module } from '@nestjs/common';
import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { User } from '../user/user.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor, User]), UploadModule],
  controllers: [ProveedorController],
  providers: [ProveedorService],
  exports: [TypeOrmModule]
})
export class ProveedorModule {}
