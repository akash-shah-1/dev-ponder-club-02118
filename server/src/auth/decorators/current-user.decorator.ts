import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Assuming ClerkAuthGuard has attached the payload to request.user
    return request.user;
  },
);

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Assuming ClerkAuthGuard has attached the payload to request.user
    return request.user.userId;
  },
);
