const msg = {
  FT_EXPLORER_ERROR: '管理员UsbKey加载失败',
  FT_FAIL_SET_SCPNAME: '管理员UsbKey的CSP初始化失败',
  FT_INSERT_KEY: '请插入管理员UsbKey',
  FT_CERT_NOT_IMPORT: 'UsbKey认证信息读取失败',
  FT_LOCK: 'PIN被锁定，请联系系统管理员',
  FT_PINCODE_UNKNOWN: 'PIN码验证失败，请重试',
  FT_FAIL_CAN_REPEAT: 'PIN码错误，你还可以输入{TIMES}次'
}
function ftInit() {
  const browserName = navigator.appName
  const browserNum = parseInt(navigator.appVersion, 10)
  if (
    (browserName === 'Microsoft Internet Explorer' && browserNum >= 4) ||
    navigator.userAgent.indexOf('Trident') >= 0
  ) {
    const ctrl = document.createElement('object')
    ctrl.setAttribute('classid', 'clsid:EDCC6E50-F523-45FE-B0E3-BF2B68FDA4B9')
    ctrl.setAttribute('codebase', 'USBKeyATLCtrl.cab#version=1,0,15,523')
    ctrl.setAttribute('id', 'USBKeyMGR')
    ctrl.setAttribute('name', 'USBKeyMGR')
    ctrl.setAttribute('style', 'display:none')
    document.body.appendChild(ctrl)
  } else {
    const ctrl = document.createElement('object')
    ctrl.setAttribute('type', 'application/npFTUSBKeyMGR')
    ctrl.setAttribute('id', 'USBKeyMGR')
    ctrl.setAttribute('style', 'width:0;height:0;display:none')
    document.body.appendChild(ctrl)
  }
}
function getUsbKeyId() {
  const ctrl = document.getElementById('USBKeyMGR')
  try {
    if (typeof ctrl.EnumUSBKeySerialNumber !== 'function') {
      throw new Error('浏览器不支持USBKEY')
    }
    let sns = ctrl.EnumUSBKeySerialNumber()
    sns = JSON.parse(sns)
    return sns[0]
  } catch (e) {
    console.dir(e)
    return ''
  }
}
function getUser(pincode) {
  const ctrl = document.getElementById('USBKeyMGR')
  const isSupport =
    typeof ctrl.SetCSPName === 'function' ||
    // eslint-disable-next-line valid-typeof
    typeof ctrl.SetCSPName === 'unknown'
  if (!isSupport) {
    console.log(
      '%c 管理员UsbKey加载失败, 请确定如下问题:\n' +
        '1. 操作系统版本是否支持管理员UsbKey\n' +
        '2. 浏览器版本是否管理员UsbKey\n' +
        '3. 浏览器插件是否安装\n' +
        '4. 管理员UsbKey管理软件是否安装',
      'color:red;font-size:20px'
    )
    throw new Error(msg.FT_EXPLORER_ERROR)
  }

  if (ctrl.SetCSPName('EnterSafe ePass2001 CSP v1.0') !== '0') {
    throw new Error(msg.FT_FAIL_SET_SCPNAME)
  }

  let sns = ctrl.EnumUSBKeySerialNumber()

  try {
    sns = JSON.parse(sns)
  } catch (e) {
    sns = []
  }

  const sn = sns[0]

  if (!sn) {
    throw new Error(msg.FT_INSERT_KEY)
  }

  let certSns = ctrl.EnumCertSerialNumber(sn)

  try {
    certSns = JSON.parse(certSns)
  } catch (e) {
    certSns = []
  }

  const certSn = certSns[0]

  if (!certSn) {
    throw new Error(msg.FT_CERT_NOT_IMPORT)
  }
  const verifyResult = ctrl.VerifyPIN(sn, pincode)

  if (verifyResult === '0') {
    return ctrl.GetCertCN(certSn)
  }

  if (verifyResult === '-1') {
    throw new Error(msg.FT_LOCK)
  }

  if (verifyResult === '') {
    throw new Error(msg.FT_PINCODE_UNKNOWN)
  }

  throw new Error(msg.FT_FAIL_CAN_REPEAT.replace('{TIMES}', verifyResult))
}
export { ftInit, getUsbKeyId, getUser }
