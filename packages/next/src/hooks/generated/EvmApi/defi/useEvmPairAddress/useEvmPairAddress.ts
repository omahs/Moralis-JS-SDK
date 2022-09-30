import { SWRConfiguration } from 'swr/dist/types';
import { TUseEvmPairAddressParams, TUseEvmPairAddressReturn } from './types'
import axios from 'axios'
import useSWR from 'swr';

export const useEvmPairAddress = (params: TUseEvmPairAddressParams, SWRConfig?: SWRConfiguration) => {
  const axiosFetcher = async (endpoint: string, fetcherParams: any) =>
    axios.post(`/api/moralis/${endpoint}`, fetcherParams).then((res) => res.data);

  const { data, error, mutate, isValidating } = useSWR<TUseEvmPairAddressReturn>(
    [`EvmApi/defi/getPairAddress`, params],
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