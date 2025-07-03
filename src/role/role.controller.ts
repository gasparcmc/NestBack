import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto/role.response.dto';
import { Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}

    @Get()
    @UseGuards(JwtGuard)
    async findAll(){
        return this.roleService.findAll();
    }


}
