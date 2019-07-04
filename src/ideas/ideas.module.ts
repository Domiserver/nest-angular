import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { IdeaEntity } from './entity/idea.entity';
import { UserEntity } from '../users/entity/user.entity';
import { CommentEntity } from '../comments/entity/comment.entity';
import { CommentsService } from '../comments/comments.service';
import { IdeasResolver } from './ideas.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [IdeasController],
  providers: [IdeasService, CommentsService, IdeasResolver],
  exports: [IdeasService, CommentsService],
})
export class IdeasModule {}
