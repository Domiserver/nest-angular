import { Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe, Body, Delete, Logger, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../shared/auth.guard';
import { CommentDto } from './dto/comment.dto';
import { UsersDecorator } from '../users/users.decorator';

@Controller('api/comments')
export class CommentsController {
  logger = new Logger('CommentsController');
  constructor(private commentsService: CommentsService) {}

  @Get('idea/:id')
  showCommentsByIdea(@Param('id') idea: string, @Query('page') page: number) {
    return this.commentsService.showByIdea(idea, page);
  }

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('id') idea: string,
    @UsersDecorator('id') user: string,
    @Body() data: CommentDto,
  ) {
    return this.commentsService.create(idea, user, data);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id') user: string, @Query('page') page: number) {
    return this.commentsService.showByUser(user, page);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentsService.show(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyComment(@Param('id') id: string, @UsersDecorator('id') user: string) {
    return this.commentsService.destroy(id, user);
  }
}
