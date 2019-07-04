import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeasModule } from './ideas/ideas.module';
import { IdeasController } from './ideas/ideas.controller';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { CommentsModule } from './comments/comments.module';
import { CommentsController } from './comments/comments.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { MulterModule } from '@nestjs/platform-express/multer';
import { join } from 'path';
import { DateScalar } from './shared/date.scalar';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    IdeasModule,
    UsersModule,
    CommentsModule,
    MulterModule.register({
      dest: './uploads',
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
    }),
    ],
  controllers: [
    AppController,
  ],
  providers: [
    DateScalar,
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
