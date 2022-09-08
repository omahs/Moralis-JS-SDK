import Moralis from "moralis";

type TSDKCall = typeof Moralis.EvmApi._utils.endpointWeights;
export type TUseEvmEndpointWeightsParams = Parameters<TSDKCall>[0];
export type TUseEvmEndpointWeightsReturn = ReturnType<NonNullable<Awaited<ReturnType<TSDKCall>>>['toJSON']>;