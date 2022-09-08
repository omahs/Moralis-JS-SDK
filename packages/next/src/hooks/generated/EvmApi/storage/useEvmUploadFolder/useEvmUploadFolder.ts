import { SWRConfiguration } from 'swr/dist/types';
import { TUseEvmUploadFolderParams, TUseEvmUploadFolderReturn } from './types'
import axios from 'axios'
import useSWR from 'swr';

export const useEvmUploadFolder = (params: TUseEvmUploadFolderParams, SWRConfig?: SWRConfiguration) => {
  const axiosFetcher = async (endpoint: string, params: any) => axios.post(`/api${endpoint}`, params).then(res => res.data);

  const { data, error, mutate, isValidating } = useSWR<TUseEvmUploadFolderReturn>(
    [`/moralis/EvmApi/storage/uploadFolder`, params],
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