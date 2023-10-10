import {serializeU16, serializeU256, serializeVectorWithLength} from './serializeContent'

const encodeWormholeData = (
  dstWormholeChainId: number,
  dstMaxGasPriceInWeiForRelayer: number,
  wormholeFee: number,
  dstSoDiamond: any[]
) => {
  let data = Buffer.alloc(0); // 创建一个空的 Buffer 对象

  data = Buffer.concat([data, serializeU16(dstWormholeChainId)]);
  data = Buffer.concat([data, serializeU256(dstMaxGasPriceInWeiForRelayer)]);
  data = Buffer.concat([data, serializeU256(wormholeFee)]);
  data = Buffer.concat([data, serializeVectorWithLength(dstSoDiamond)]);

  return data;
}

function encodeSoData(transactionId, receiver, sourceChainId, sendingAssetId, destinationChainId, receivingAssetId, amount) {
  //@ts-ignore
  let data = Buffer.alloc(0); // 创建一个空的 Buffer 对象

  data = Buffer.concat([data, serializeVectorWithLength(transactionId)]);
  data = Buffer.concat([data, serializeVectorWithLength(receiver)]);
  data = Buffer.concat([data, serializeU16(sourceChainId)]);
  data = Buffer.concat([data, serializeVectorWithLength(sendingAssetId)]);
  data = Buffer.concat([data, serializeU16(destinationChainId)]);
  data = Buffer.concat([data, serializeVectorWithLength(receivingAssetId)]);
  data = Buffer.concat([data, serializeU256(amount)]);
  return data;
}

export {
  encodeSoData,
  encodeWormholeData,
}