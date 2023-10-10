function serializeU256(v) {
  const buffer = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) {
    buffer.writeUInt8((v >> (8 * (31 - i))) & 0xff, i);
  }
  return buffer;
}

function serializeU16(v) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16BE(v, 0);
  return buffer;
}

function serializeVectorWithLength(v) {
  const length = v.length;

  if (length === 0) {
    return Buffer.alloc(0);
  }

  const lengthBuffer = serializeU64(length);

  return Buffer.concat([lengthBuffer, Buffer.from(v)]);
}

function serializeU64(v) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(v), 0);
  return buffer;
}

export {
  serializeU16,
  serializeU64,
  serializeU256,
  serializeVectorWithLength,
}