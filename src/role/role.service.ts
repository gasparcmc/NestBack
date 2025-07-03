import { Injectable } from '@nestjs/common';
import { RoleResponseDto } from './dto/role.response.dto';

@Injectable()
export class RoleService {

    async findAll() {
        return 'roles';
    }
}
