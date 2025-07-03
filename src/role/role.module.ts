import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { Access } from './access/access.entity';
import { AccessGuard } from './access/access.guard';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Access, User])],
  controllers: [RoleController],
  providers: [RoleService, AccessGuard],
  exports: [TypeOrmModule]
})
export class RoleModule {}
