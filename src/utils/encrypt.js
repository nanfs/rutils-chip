import { JSEncrypt } from 'jsencrypt'

export default function encryptPwd(data) {
  const pubKey =
    '-----BEGIN PUBLIC KEY-----' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcXQLCrweyTIP6ZAPri472r6h6' +
    '+c6NEO40pczxDUBiIn2YeghKor/odrSvxSRM0BdpszURFCPq3+RKGdO6DCoeP9Hl' +
    'HKcBKnA6lMs8HP7BgHcXrNkZInbKRlv4XzF/y13yHJ0zkyKk+SMs4iY8NPexDx6O' +
    'knhr5RoOnxgMTQ+x3wIDAQAB' +
    '-----END PUBLIC KEY-----'
  const encryptKey = new JSEncrypt()
  encryptKey.setPublicKey(pubKey)
  return encryptKey.encrypt(data)
}
