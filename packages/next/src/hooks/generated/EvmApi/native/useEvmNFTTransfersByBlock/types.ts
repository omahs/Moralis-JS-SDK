import Moralis from "moralis";

type TSDKCall = typeof Moralis.EvmApi.native.getNFTTransfersByBlock;
export type TUseEvmNFTTransfersByBlockParams = Parameters<TSDKCall>[0];
export type TUseEvmNFTTransfersByBlockReturn = ReturnType<NonNullable<Awaited<ReturnType<TSDKCall>>>['toJSON']>;