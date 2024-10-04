// import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
// import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

// @Catch(HttpException)
// export class HttpExceptionFilter implements GqlExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     // Use GqlArgumentsHost to extract GraphQL-specific context
//     const gqlHost = GqlArgumentsHost.create(host);

//     // Extract GraphQL-specific context (e.g., req, res, etc.)
//     const ctx = gqlHost.getContext();
    
//     const status = exception.getStatus();
//     const response = exception.getResponse();

//     let message = 'An error occurred';

//     // Handle validation errors or custom error messages
//     if (typeof response === 'object' && response !== null) {
//       if (Array.isArray(response['message'])) {
//         message = response['message'].join(', ');
//       } else if (response['message']) {
//         message = response['message'];
//       }
//     }

//     // Return the error in GraphQL-friendly format
//     return {
//       errors: [
//         {
//           message: message,
//           statusCode: status,
//         },
//       ],
//     };
//   }
// }
