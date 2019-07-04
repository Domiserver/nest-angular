import {
    Controller,
    Get,
    Post,
    UsePipes,
    Body,
    Query,
    Param,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Res,
    Put,
  } from '@nestjs/common';

import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UsersDecorator } from './users.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { UserEntity } from './entity/user.entity';
import { UserInterface } from './interface/user.interface';
import { fileURLToPath } from 'url';

@Controller()
  export class UsersController {
    // SERVER_URL: string = 'http://localhost:{PORT}';
    SERVER_URL: string = 'http://localhost:4000';

    constructor(private usersService: UsersService) {}

    @Get('api/users')
    showAllUsers(@Query('page') page: number) {
      return this.usersService.readAll();
    }

    @Get('api/users/:username')
    showOneUser(@Param('username') username: string) {
      return this.usersService.readOne(username);
    }

    @Get('auth/whoami')
    @UseGuards(new AuthGuard())
    showMe(@UsersDecorator('username') username: string) {
      return this.usersService.readOne(username);
    }

    @Post('auth/login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDto) {
      return this.usersService.login(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDto) {
      return this.usersService.register(data);
    }
    @Post(':userid/avatar')
    @UseInterceptors(FileInterceptor('image',
      {
        storage: diskStorage({
          destination: './uploaded',
          filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
        }),
      },
    ),
    )
    uploadAvatare(@Param('userid') userId, @UploadedFile() file) {
      this.usersService.setAvatar(Number(userId), `${this.SERVER_URL}${file.path}`);
// tslint:disable-next-line: no-console
      console.log(Number(userId), `${this.SERVER_URL}${file.path}`);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    async uploadAvatar(
      @Param('id') id: number,
      @UsersDecorator('users') users: string ,
      @Body() data: Partial<UserDto>,
    ) {
      // this.logData({ id, users, data });
      return await this.usersService.update(users, id, data);
      }

  }
