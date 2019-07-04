import { Resolver, Args, Query, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { AuthGuard } from '../shared/auth.guard';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Query()
  async comment(@Args('id') id: string) {
    return await this.commentsService.show(id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async createComment(
    @Args('idea') ideaId: string,
    @Args('comment') comment: string,
    @Context('user') user,
  ) {
    const { id: userId } = user;
    const data = { comment };
    return await this.commentsService.create(ideaId, userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async deleteComment(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return await this.commentsService.destroy(id, userId);
  }
}
