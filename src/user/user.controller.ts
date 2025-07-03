import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Get , UseGuards} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { AccessGuard } from 'src/role/access/access.guard';
import { RequireAccess } from 'src/role/access/access.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:read')
  getAllUsers() {
    return this.userService.findAll();
  }


}
