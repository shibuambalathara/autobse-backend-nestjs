import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  

  getRequest(context: ExecutionContext) {
    console.log("reached at jwt")
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
