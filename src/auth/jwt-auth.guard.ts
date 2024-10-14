import { Injectable, ExecutionContext, ContextType } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {


  getRequest(context: ExecutionContext) {
    const ctxType: ContextType | 'graphql' = context.getType()
    //graqhql
    if (ctxType === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req
    }
    //rest api
    return context.switchToHttp().getRequest()
  }
}
