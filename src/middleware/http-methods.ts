import {HttpErrors, Request} from '@loopback/rest';

const allowedMethods = ['GET', 'POST'];

export namespace HttpMethod {
  export function validateMethod(request: Request) {
    if (!allowedMethods.includes(request.method)) {
      throw new HttpErrors.MethodNotAllowed('Method not allowed');
    }
  }
}
