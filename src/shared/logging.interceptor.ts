import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ) {
// tslint:disable-next-line: no-console
    console.log('This is Logging Interceptor before query to Database...');
    const req = context.switchToHttp().getRequest();
    // const method = req.method;
    // const url = req.url;
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
         Logger.log(
          ` ${context.getClass().name}.${context.getHandler().name} `,
          //  ` ${method} ${url} ${Date.now() - now}ms `,
        ),
      ),
    );
  }
}
