import { toCamelCase } from './../../utils/toCamelCase';
import { EvmChainish, EvmAddressish, EvmAddress, EvmNative } from '@moralisweb3/core';
import { operations } from '../../generated/types';
import { Camelize } from '../../utils/toCamelCase';
import { EvmPaginatedResolver, PaginatedOptions } from '../PaginatedResolver';
import { resolveDefaultChain } from '../../utils/resolveDefaultParams';

type operation = 'getContractNFTTransfers';

type QueryParams = operations[operation]['parameters']['query'];
type PathParams = operations[operation]['parameters']['path'];
type ApiParams = QueryParams & PathParams;
export interface Params extends Camelize<Omit<ApiParams, 'chain' | 'address'>>, PaginatedOptions {
  chain?: EvmChainish;
  address: EvmAddressish;
}

type ApiResult = operations[operation]['responses']['200']['content']['application/json'];

export const getContractNFTTransfersResolver = new EvmPaginatedResolver({
  name: 'getContractNFTTransfers',
  getPath: (params: Params) => `nft/${params.address}/transfers`,
  apiToResult: (data: ApiResult) =>
    data.result?.map((transfer) => ({
      ...toCamelCase(transfer),
      tokenAddress: EvmAddress.create(transfer.to_address),
      toAddress: EvmAddress.create(transfer.to_address),
      operator: transfer.operator ? EvmAddress.create(transfer.operator) : null,
      fromAddress: transfer.from_address ? EvmAddress.create(transfer.from_address) : null,
      value: transfer.value ? EvmNative.create(transfer.value) : null,
      blockTimestamp: new Date(transfer.block_timestamp),
    })),
  resultToJson: (data) =>
    data?.map((transfer) => ({
      ...transfer,
      tokenAddress: transfer.tokenAddress.format(),
      toAddress: transfer.toAddress.format(),
      fromAddress: transfer.fromAddress?.format(),
      operator: transfer.operator?.format(),
      blockTimestamp: transfer.blockTimestamp.toLocaleString(),
      value: transfer.value?.format(),
    })),
  parseParams: (params: Params): ApiParams => ({
    ...params,
    chain: resolveDefaultChain(params.chain).apiHex,
    address: EvmAddress.create(params.address).lowercase,
  }),
});