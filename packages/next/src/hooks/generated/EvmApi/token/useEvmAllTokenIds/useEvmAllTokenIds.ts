import { SWRConfiguration } from 'swr/dist/types';
import { TUseEvmAllTokenIdsParams, TUseEvmAllTokenIdsReturn } from './types'
import axios from 'axios'
import useSWR from 'swr';

export const useEvmAllTokenIds = (params: TUseEvmAllTokenIdsParams, SWRConfig?: SWRConfiguration) => {
  const axiosFetcher = async (endpoint: string, params: any) => axios.post(`/api${endpoint}`, params).then(res => res.data);

  const { data, error, mutate, isValidating } = useSWR<TUseEvmAllTokenIdsReturn>(
    [`/moralis/EvmApi/token/getAllTokenIds`, params],
    axiosFetcher,
    SWRConfig,
  );

  return {
    data,
    error,
    refetch: async () => mutate(),
    isValidating,
  };
};