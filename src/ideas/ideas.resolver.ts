import {
    Resolver,
    Query,
    Args,
    ResolveProperty,
    Parent,
    Mutation,
    Context,
  } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CommentsService } from '../comments/comments.service';
import { AuthGuard } from '../shared/auth.guard';
import { IdeasService } from './ideas.service';
import { IdeaDto } from './dto/idea.dto';

@Resolver('Idea')
  export class IdeasResolver {
    constructor(
      private ideasService: IdeasService,
      private commentsService: CommentsService,
    ) {}

    @Query()
    async ideas(@Args('page') page: number, @Args('newest') newest: boolean) {
      return await this.ideasService.findAll(page, newest);
    }

    @Query()
    async idea(@Args('id') id: string) {
      return await this.ideasService.findOne(id);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async createIdea(
      @Args('id') id: string,
      @Args() { idea, description }: IdeaDto,
      @Context('user') user,
    ) {
      const { id: userId } = user;
      const data = { idea, description };
      return await this.ideasService.create(userId, data);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async updateIdea(
      @Args('id') id: string,
      @Args() { idea, description }: IdeaDto,
      @Context('user') user,
    ) {
      const { id: userId } = user;
      const data: any = {};
    //   idea && (data.idea = idea);
    //   description && (data.description = description);
      return await this.ideasService.update(id, userId, data);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async deleteIdea(@Args('id') id: string, @Context('user') user) {
      const { id: userId } = user;
      return await this.ideasService.destroy(id, userId);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async upvote(@Args('id') id: string, @Context('user') user) {
      const { id: userId } = user;
      return await this.ideasService.upvote(id, userId);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async downvote(@Args('id') id: string, @Context('user') user) {
      const { id: userId } = user;
      return await this.ideasService.downvote(id, userId);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async bookmark(@Args('id') id: string, @Context('user') user) {
      const { id: userId } = user;
      return await this.ideasService.bookmark(id, userId);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async unbookmark(@Args('id') id: string, @Context('user') user) {
      const { id: userId } = user;
      return await this.ideasService.unbookmark(id, userId);
    }

    @ResolveProperty()
    async comments(@Parent() idea) {
      const { id } = idea;
      return await this.commentsService.showByIdea(id);
    }
  }
