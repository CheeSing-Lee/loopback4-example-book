import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {AppLogger} from './middleware/app-logger';
import {HttpMethod} from './middleware/http-methods';

const SequenceActions = RestBindings.SequenceActions;
const REQUEST_TIMEOUT = 10000;

export class MySequence implements SequenceHandler {
  public constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  public async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      // validate request method
      HttpMethod.validateMethod(request);

      const route = this.findRoute(request);

      //call authentication action
      if (
        !(
          request.originalUrl.includes('health') ||
          request.originalUrl.includes('explorer')
        )
      ) {
        await this.authenticateRequest(request);
      }

      const args = await this.parseParams(request, route);

      // set request timeout
      request.setTimeout(REQUEST_TIMEOUT);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      AppLogger.getInstance().logRequestError(err, context);
      this.reject(context, err);
    }
  }
}
