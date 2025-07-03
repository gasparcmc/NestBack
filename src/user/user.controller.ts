import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Get , UseGuards, Param, Post, Body} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { AccessGuard } from 'src/role/access/access.guard';
import { RequireAccess } from 'src/role/access/access.decorator';
import { UserRegisterDto } from './dto/user.register.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:read')
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:read')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:create')
  createUser(@Body() user: UserRegisterDto) {
    return this.userService.createUser(user);
  }


}
