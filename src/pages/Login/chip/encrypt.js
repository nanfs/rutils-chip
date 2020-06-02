import { JSEncrypt } from 'jsencrypt'

export default function encryptPwd(data) {
  const pubKey =
    '-----BEGIN PUBLIC KEY-----' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCIjr6dcWp2UvWAn3WAVIHV/G0SA' +
    '9Vttm3/HB+4doDfFqOjOI8IgQPVYQn0e312h3RfzY3KfA1otsGIa1Tw3RyIcdQFrv' +
    '5mLJYHhJqqiDYty9RT3RqczsJK6eV+OqGs5viWWVN54NrkZOm+TwxHurrk1NplFi+' +
    'wKGz/cwDX1nTolQIDAQAB' +
    '-----END PUBLIC KEY-----'
  const encryptKey = new JSEncrypt()
  encryptKey.setPublicKey(pubKey)
  return encryptKey.encrypt(data)
}
