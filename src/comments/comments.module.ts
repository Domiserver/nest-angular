import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from '../ideas/entity/idea.entity';
import { UserEntity } from '../users/entity/user.entity';
import { CommentEntity } from './entity/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
// import { CommentsResolver } from './comments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [
    CommentsController,
  ],
  providers: [CommentsService,
    // CommentsResolver,
    ],
})
export class CommentsModule {}
