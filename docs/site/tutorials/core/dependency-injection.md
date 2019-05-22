# Dependency injection (#3)

```ts
import {inject} from '@loopback/context';
import {LifeCycleObserver} from '@loopback/core';
import {CachingService} from '../caching-service';
import {CACHING_SERVICE} from '../keys';

export class CacheObserver implements LifeCycleObserver {
  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
  ) {}
}
```

```ts
@bind(asGlobalInterceptor('caching'))
export class CachingInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
  ) {}

  value() {
    return async (
      ctx: InvocationContext,
      next: () => ValueOrPromise<InvocationResult>,
    ) => {
      // ...
    };
  }
}
```
