// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeting-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {bind, BindingScope, config, ContextView} from '@loopback/core';
import * as debugFactory from 'debug';
import {Message} from './types';
const debug = debugFactory('greeter-extension');

export interface CachingServiceOptions {
  ttl: number;
}

/**
 * Message caching service
 */
@bind({scope: BindingScope.SINGLETON})
export class CachingService {
  private timer: NodeJS.Timer;
  private store: Map<string, Message> = new Map();

  constructor(
    @config.view()
    private optionsView: ContextView<CachingServiceOptions>,
  ) {
    // Use a view so that we can listen on the `refresh` event
    optionsView.on('refresh', async () => {
      debug('Restarting the service as configuration changes...');
      await this.stop();
      await this.start();
    });
  }

  async set(key: string, message: Message) {
    this.store.set(key, message);
  }

  async get(key: string) {
    const expired = await this.isExpired(key);
    debug('Getting cache for %s', key, expired);
    return expired ? undefined : this.store.get(key);
  }

  async delete(key: string) {
    return this.store.delete(key);
  }

  async clear() {
    this.store.clear();
  }

  async isExpired(key: string, now = new Date()): Promise<boolean> {
    const ttl = await this.getTTL();
    const msg = this.store.get(key);
    if (!msg) return true;
    return now.getTime() - msg.timestamp.getTime() > ttl;
  }

  async getTTL() {
    const options = await this.optionsView.singleValue();
    debug('Caching options: %j', options);
    return (options && options.ttl) || 5000;
  }

  async sweep() {
    debug('Sweeping cache...');
    for (const key of this.store.keys()) {
      if (await this.isExpired(key)) {
        debug('Cache for %s is swept.', key);
        await this.delete(key);
      }
    }
  }

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    debug('Starting caching service');
    await this.clear();
    const ttl = await this.getTTL();
    debug('TTL: %d', ttl);
    this.timer = setInterval(async () => {
      await this.sweep();
    }, ttl);
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    debug('Stopping caching service');
    /* istanbul ignore if */
    if (this.timer) {
      clearInterval(this.timer);
    }
    await this.clear();
  }
}
