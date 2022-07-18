import {Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import { readFileSync } from 'fs';
import type { Block, BlockchainClient } from './_abstract';

export const JSON_BLOCKS = 'JSON_BLOCKS'

/**
 * A blockchain client stub that holds a copy of the 'blockchain' as in-memory json objects
 * purely for the purposes of this technical assignment.
 * It simulates non-deterministic response times to mimic real world behaviour.
 */
@Injectable()
export class JsonBlockchainClient implements BlockchainClient, OnApplicationBootstrap, OnApplicationShutdown {
  private blocks: Block[]
  private timeouts: NodeJS.Timeout[] = [];

  constructor(@Inject(JSON_BLOCKS) private readonly path: string) {
  }

  async getChainHeight(): Promise<number> {
    return this.simulateAsync(() => {
      return this.blocks.length;
    })
  }

  async getBlockByHeight(height: number): Promise<Block | undefined> {
    return this.simulateAsync(() => {
      const blocks = this.blocks.filter(block => height === block.height);
      return blocks[0];
    });
  }

  async getBlockByHash(hash: string): Promise<Block | undefined> {
    return this.simulateAsync(() => {
      const blocks = this.blocks.filter(block => hash === block.hash);
      return blocks[0];
    })
  }

  /**
   * Called by Nest as part of app start-up phase
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events
   */
  onApplicationBootstrap(): void {
    this.blocks = JSON.parse(readFileSync(this.path).toString()) as Block[];
  }
  /**
   * Called by Nest as part of app shutdown phase
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events
   */
  onApplicationShutdown(): void {
    this.timeouts.forEach(clearTimeout);
  }

  private async simulateAsync<T>(callback: () => T): Promise<T> {
    return new Promise<T>(resolve => {
      // Simulate non-deterministic response time
      const timeout = setTimeout(() => {
        resolve(callback());
      }, randIntInclusive(50, 500)); // ms

      // Register timeout for clean-up
      this.timeouts.push(timeout);
    })
  }
}

function randIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}