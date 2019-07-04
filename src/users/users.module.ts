import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { IdeaEntity } from '../ideas/entity/idea.entity';
import { UsersResolver } from './users.resolver';
import { CommentEntity } from '../comments/entity/comment.entity';
import { CommentsService } from '../comments/comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, IdeaEntity, CommentEntity]),
    JwtModule.register({
      secretOrPrivateKey: 'secret12356789',
  }),
],
  controllers: [UsersController],
  providers: [UsersService, CommentsService, UsersResolver],
})
export class UsersModule {}
