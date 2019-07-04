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

import { AuthGuard } from '../shared/auth.guard';
import { CommentsService } from '../comments/comments.service';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Resolver()
  export class UsersResolver {
    constructor(
      private usersService: UsersService,
      private commentsService: CommentsService,
    ) {}

    @Query()
    async showAllUsers(@Args('page') page: number) {
      return await this.usersService.readAll(page);
    }

    @Query()
    async showOneUser(@Args('username') username: string) {
      return await this.usersService.readOne(username);
    }

    @Query()
    @UseGuards(new AuthGuard())
    async whoami(@Context('user') user) {
      const { username } = user;
      return await this.usersService.readOne(username);
    }

    @Mutation()
    async login(
      @Args('username') username: string,
      @Args('password') password: string,
    ) {
      const user: UserDto = { username, password };
      return await this.usersService.login(user);
    }

    @Mutation()
    async register(
      @Args('username') username: string,
      @Args('password') password: string,
    ) {
      const user: UserDto = { username, password };
      return await this.usersService.register(user);
    }

    @ResolveProperty()
    async comments(@Parent() user) {
      const { id } = user;
      return await this.commentsService.showByUser(id);
    }
  }
