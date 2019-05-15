// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {globalInterceptor, Interceptor, Provider} from '@loopback/context';

/**
 * This class will be bound to the application as a global `Interceptor` during
 * `boot`
 */
@globalInterceptor('auth')
export class MyGlobalInterceptor implements Provider<Interceptor> {
  /*
  constructor() {}
  */

  value() {
    const interceptor: Interceptor = async (invocationCtx, next) => {
      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      return result;
    };
    return interceptor;
  }
}
