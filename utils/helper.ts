export const generateRandomBytes32 = (): Uint8Array => {
  // 生成一个随机的 32 字节的十六进制字符串
  const randomBytes = [...Array(32)].map(() => Math.floor(Math.random() * 256));
  const hexString = Buffer.from(randomBytes).toString('hex').replace('0x', '');
  return Buffer.from(hexString, 'hex')
}
