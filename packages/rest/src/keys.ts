// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey, Context} from '@loopback/context';
import {CoreBindings} from '@loopback/core';
import {HttpProtocol} from '@loopback/http-server';
import * as https from 'https';
/**
 * See https://github.com/Microsoft/TypeScript/issues/26985
 */
// import {OpenApiSpec} from '@loopback/openapi-v3-types';
import {OpenAPIObject as OpenApiSpec} from 'openapi3-ts';
import {ErrorWriterOptions} from 'strong-error-handler';
import {BodyParser, RequestBodyParser} from './body-parsers';
import {HttpHandler} from './http-handler';
import {RestRouter, RestRouterOptions, RouteEntry} from './router';
import {SequenceHandler, SequenceOptions} from './sequence';
import {
  FindRoute,
  InvokeMethod,
  LogError,
  OperationArgs,
  OperationRetval,
  ParseParams,
  Reject,
  Request,
  RequestBodyParserOptions,
  Response,
  RestAction,
  Send,
} from './types';

/**
 * RestServer-specific bindings
 */
export namespace RestBindings {
  /**
   * Binding key for setting and injecting RestComponentConfig
   */
  export const CONFIG = CoreBindings.APPLICATION_CONFIG.deepProperty('rest');
  /**
   * Binding key for setting and injecting the host name of RestServer
   */
  export const HOST = BindingKey.create<string | undefined>('rest.host');
  /**
   * Binding key for setting and injecting the port number of RestServer
   */
  export const PORT = BindingKey.create<number>('rest.port');
  /**
   * Binding key for setting and injecting the URL of RestServer
   */
  export const URL = BindingKey.create<string>('rest.url');
  /**
   * Binding key for setting and injecting the protocol of RestServer
   */
  export const PROTOCOL = BindingKey.create<HttpProtocol>('rest.protocol');
  /**
   * Binding key for HTTPS options
   */
  export const HTTPS_OPTIONS = BindingKey.create<https.ServerOptions>(
    'rest.httpsOptions',
  );

  export const RESOLVED_ROUTE = BindingKey.create<RouteEntry>(
    'rest.resolvedRoute',
  );

  export const OPERATION_ARGS = BindingKey.create<OperationArgs>(
    'rest.operationArgs',
  );

  export const OPERATION_RESULT = BindingKey.create<OperationRetval>(
    'rest.operationResult',
  );

  /**
   * Internal binding key for basePath
   */
  export const BASE_PATH = BindingKey.create<string>('rest.basePath');

  /**
   * Internal binding key for http-handler
   */
  export const HANDLER = BindingKey.create<HttpHandler>('rest.handler');

  /**
   * Internal binding key for rest router
   */
  export const ROUTER = BindingKey.create<RestRouter>('rest.router');

  export const ROUTER_OPTIONS = BindingKey.create<RestRouterOptions>(
    'rest.router.options',
  );

  /**
   * Binding key for setting and injecting Reject action's error handling
   * options.
   *
   * See https://github.com/strongloop/strong-error-handler#options for
   * the list of available options. Please note that the flag `log` is not used
   * by `@loopback/rest`.
   */
  export const ERROR_WRITER_OPTIONS = BindingKey.create<ErrorWriterOptions>(
    'rest.errorWriterOptions',
  );

  /**
   * Binding key for request body parser options
   */
  export const REQUEST_BODY_PARSER_OPTIONS = BindingKey.create<
    RequestBodyParserOptions
  >('rest.requestBodyParserOptions');

  /**
   * Binding key for request body parser
   */
  export const REQUEST_BODY_PARSER = BindingKey.create<RequestBodyParser>(
    'rest.requestBodyParser',
  );

  function bodyParserBindingKey(parser: string) {
    return `${REQUEST_BODY_PARSER}.${parser}`;
  }

  /**
   * Binding key for request json body parser
   */
  export const REQUEST_BODY_PARSER_JSON = BindingKey.create<BodyParser>(
    bodyParserBindingKey('JsonBodyParser'),
  );

  /**
   * Binding key for request urlencoded body parser
   */
  export const REQUEST_BODY_PARSER_URLENCODED = BindingKey.create<BodyParser>(
    bodyParserBindingKey('UrlEncodedBodyParser'),
  );

  /**
   * Binding key for request text body parser
   */
  export const REQUEST_BODY_PARSER_TEXT = BindingKey.create<BodyParser>(
    bodyParserBindingKey('TextBodyParser'),
  );

  /**
   * Binding key for request raw body parser
   */
  export const REQUEST_BODY_PARSER_RAW = BindingKey.create<BodyParser>(
    bodyParserBindingKey('RawBodyParser'),
  );

  /**
   * Binding key for request raw body parser
   */
  export const REQUEST_BODY_PARSER_STREAM = BindingKey.create<BodyParser>(
    bodyParserBindingKey('StreamBodyParser'),
  );

  /**
   * Binding key for setting and injecting an OpenAPI spec
   */
  export const API_SPEC = BindingKey.create<OpenApiSpec>('rest.apiSpec');
  /**
   * Binding key for setting and injecting a Sequence
   */
  export const SEQUENCE = BindingKey.create<SequenceHandler>('rest.sequence');

  /**
   * Binding key for sequence options
   */
  export const SEQUENCE_OPTIONS = BindingKey.create<SequenceOptions>(
    'rest.sequence.options',
  );

  /**
   * Bindings for potential actions that could be used in a sequence
   */
  export namespace SequenceActions {
    /**
     * Binding key for setting and injecting a route finding function
     */
    export const FIND_ROUTE = BindingKey.create<FindRoute>(
      'rest.sequence.actions.findRoute#handler',
    );
    /**
     * Binding key for setting and injecting a parameter parsing function
     */
    export const PARSE_PARAMS = BindingKey.create<ParseParams>(
      'rest.sequence.actions.parseParams#handler',
    );
    /**
     * Binding key for setting and injecting a controller route invoking function
     */
    export const INVOKE_METHOD = BindingKey.create<InvokeMethod>(
      'rest.sequence.actions.invokeMethod#handler',
    );
    /**
     * Binding key for setting and injecting an error logging function
     */
    export const LOG_ERROR = BindingKey.create<LogError>(
      'rest.sequence.actions.logError',
    );
    /**
     * Binding key for setting and injecting a response writing function
     */
    export const SEND = BindingKey.create<Send>(
      'rest.sequence.actions.send#handler',
    );
    /**
     * Binding key for setting and injecting a bad response writing function
     */
    export const REJECT = BindingKey.create<Reject>(
      'rest.sequence.actions.reject#handler',
    );

    /**
     * Binding key for setting and injecting a route finding function
     */
    export const FIND_ROUTE_ACTION = BindingKey.create<RestAction>(
      'rest.sequence.actions.findRoute',
    );
    /**
     * Binding key for setting and injecting a parameter parsing function
     */
    export const PARSE_PARAMS_ACTION = BindingKey.create<RestAction>(
      'rest.sequence.actions.parseParams',
    );
    /**
     * Binding key for setting and injecting a controller route invoking function
     */
    export const INVOKE_METHOD_ACTION = BindingKey.create<RestAction>(
      'rest.sequence.actions.invokeMethod',
    );

    /**
     * Binding key for setting and injecting a response writing function
     */
    export const SEND_ACTION = BindingKey.create<RestAction>(
      'rest.sequence.actions.send',
    );
    /**
     * Binding key for setting and injecting a bad response writing function
     */
    export const REJECT_ACTION = BindingKey.create<RestAction>(
      'rest.sequence.actions.reject',
    );
  }

  /**
   * Request-specific bindings
   */
  export namespace Http {
    /**
     * Binding key for setting and injecting the http request
     */
    export const REQUEST = BindingKey.create<Request>('rest.http.request');
    /**
     * Binding key for setting and injecting the http response
     */
    export const RESPONSE = BindingKey.create<Response>('rest.http.response');
    /**
     * Binding key for setting and injecting the http request context
     */
    export const CONTEXT = BindingKey.create<Context>(
      'rest.http.request.context',
    );
  }
}

export namespace RestTags {
  export const ACTION = 'restAction';
  export const ACTION_PHASE = 'restActionPhase';
}
