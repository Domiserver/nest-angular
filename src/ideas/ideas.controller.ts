import { Controller, Get, Post, Put, Delete, Logger, Param, Body, UsePipes, UseGuards, Query } from '@nestjs/common';

import { IdeasService } from './ideas.service';
import { IdeaDto, IdeaRO } from './dto/idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { UsersDecorator } from '../users/users.decorator';

@Controller('api/ideas')
export class IdeasController {
    private logger = new Logger('IdeasController');

    constructor(private readonly ideasService: IdeasService) {}

    private logData(options: any) {

// tslint:disable-next-line: no-unused-expression
      options.user && this.logger.log('USER ' + JSON.stringify(options.user));
// tslint:disable-next-line: no-unused-expression
      options.body && this.logger.log('BODY ' + JSON.stringify(options.body));
// tslint:disable-next-line: no-unused-expression
      options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
    }

    @Get()
    async readAllIdeas(@Query('page') page: number) {
      // return await this.ideasService.findAll(page);
      return await this.ideasService.findAll();
    }

    @Get('/newest')
    async showNewestIdeas(@Query('page') page: number) {
      // return await this.ideasService.findAll(page, true);
      return await this.ideasService.findAll();
    }

    @Get(':id')
    async readIdea(@Param('id') id: string) {
      this.logData({ id });
      return await this.ideasService.findOne(id);
      }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    async createdIdea(@UsersDecorator('id') users: string, @Body() body: IdeaDto ) {
        this.logData({ users, body });
        return await this.ideasService.create( users, body );
      }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    async updatedIdea(
      @Param('id') id: string,
      @UsersDecorator('id') users: string ,
      @Body() data: Partial<IdeaDto>,
    ) {
      this.logData({ id, users, data });
      return await this.ideasService.update(id, users, data);
      }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    async destroyIdea(@Param('id') id: string, @UsersDecorator('id') users: string) {
      this.logData({ id, users });
      return await this.ideasService.destroy(id, users);
      }

    @Post(':id/upvote')
    @UseGuards(new AuthGuard())
    upvoteIdea(@Param('id') id: string, @UsersDecorator('id') user: string) {
      this.logData({ id, user });
      return this.ideasService.upvote(id, user);
    }

    @Post(':id/downvote')
    @UseGuards(new AuthGuard())
    downvoteIdea(@Param('id') id: string, @UsersDecorator('id') user: string) {
      this.logData({ id, user });
      return this.ideasService.downvote(id, user);
    }

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkidea(@Param('id') id: string, @UsersDecorator('id') user: string) {
      this.logData({ id, user });
      return this.ideasService.bookmark(id, user);
    }

    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    unbookmarkidea(@Param('id') id: string, @UsersDecorator('id') user: string) {
      this.logData({ id, user });
      return this.ideasService.unbookmark(id, user);
    }
}
