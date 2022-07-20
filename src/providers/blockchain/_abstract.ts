/**
 * An abstraction of a Blockchain client with simple endpoints to fetch blocks.
 * In reality, blockchain clients provide more extensive APIs for interacting with the
 * underlying blockchain.
 */
export interface BlockchainClient {
  getBlockCount(): Promise<number>;
  getBlockByHash(hash: string): Promise<Block | undefined>;
  getBlocksAtHeight(height: number): Promise<Block[] | undefined>;
}

export interface Block {
  hash: string;
  height: number;
  // TODO: add more fields
}
