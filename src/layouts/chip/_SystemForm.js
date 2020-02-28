import React from 'react'
import { Row, Col } from 'violet-ui/components/Grid'
import Button from 'violet-ui/components/Button'
import Icon from 'violet-ui/components/Icon'
import reduxForm from 'violet-ui/components/ReduxForm/reduxForm'
import Field from 'violet-ui/components/ReduxForm/Field'
import InputField from '../Fields/InputField'
import SwitchField from '../Fields/SwitchField'
import SelectField from '../Fields/SelectField'
import Auth from '../Auth'
import {
  required,
  ip,
  numberRange,
  key,
  isInt,
  reg,
  sessionTime
} from '../../utils/validate'

function SystemForm(props) {
  const {
    meta: { pristine, syncErrors, values },
    onSubmit,
    error,
    loading,
    onClose,
    scrollToAnchor
  } = props
  const protocolTypeOptions = [
    { value: 'tcp', label: 'TCP' },
    { value: 'udp', label: 'UDP' }
  ]
  const passPlaceCode = values.tcSwitcherPassword
    ? values.tcSwitcherPassword
    : '字母、数字、特殊字符组成；长度为0-20'
  const hasSetPwd = values.tcSwitcherPassword ? 'hassetpwd' : ''
  return (
    <div className="detail-panel">
      <div spinning={loading} className="detail-menu">
        <ul>
          <Auth allow="admin">
            <li key="system">
              <span onClick={scrollToAnchor.bind(null, 'base')}>系统参数</span>
            </li>
          </Auth>
          <Auth allow="security">
            <li key="desktop">
              <span onClick={scrollToAnchor.bind(null, 'vm')}>桌面参数</span>
            </li>
          </Auth>
          <Auth allow="admin">
            <li key="terminal">
              <span onClick={scrollToAnchor.bind(null, 'tc')}>终端参数</span>
            </li>
          </Auth>
        </ul>
      </div>
      <form action="" onSubmit={onSubmit} className="com-form nav-form">
        <Auth allow="admin">
          <div className="form-blank-title" id="base">
            <span>系统参数</span>
          </div>
          <Row>
            <Col span={6} className="title">
              会话超时时间 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="sessionTimeOutInterval"
                validate={[required, isInt, sessionTime]}
                InputProps={{
                  addonAfter: '分',
                  placeholder: '输入范围[-1,1-100000]'
                }}
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              登录失败最大次数 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="userLoginFailMaxTimes"
                validate={[required, isInt, numberRange(1, 10)]}
                InputProps={{ addonAfter: '次', placeholder: '输入范围[1-10]' }}
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              登录失败锁定阈值 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="userLoginFailLockTimeThreshold"
                validate={[required, isInt, numberRange(1, 10000)]}
                InputProps={{
                  addonAfter: '分',
                  placeholder: '输入范围[1-10000]'
                }}
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              用户多会话 ：
            </Col>
            <Col span={18} className="content">
              <Field name="isAllowMultiSession" component={SwitchField} />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              SYSLOG上报厂商代码 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="syslogVendorCode"
                component={InputField}
                validate={[reg('[a-zA-Z0-9]{0,6}', '数字和字母长度0-6')]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              SYSLOG服务商地址 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="syslogServerIp"
                validate={[ip]}
                InputProps={{ placeholder: '如输出 参照XXX.XXX.XXX.XXX' }}
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              SYSLOG服务商端口 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="syslogServerPort"
                validate={[isInt, numberRange(0, 65535)]}
                InputProps={{ placeholder: '输入范围(0-65535)' }}
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              SYSLOG上报协议 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="syslogProtocolType"
                component={SelectField}
                options={protocolTypeOptions}
              />
            </Col>
          </Row>
        </Auth>
        <Auth allow="security">
          <Row style={{ height: '15px' }} />
        </Auth>
        <Auth allow="security">
          <div className="form-blank-title" id="vm">
            <span>桌面参数</span>
          </div>
          <Row>
            <Col span={6} className="title">
              SPICE客户端限制 ：
            </Col>
            <Col span={18} className="content">
              <Field name="isOpenSpiceLimit" component={SwitchField} />
            </Col>
          </Row>
        </Auth>
        <Auth allow="admin">
          <div className="form-blank-title" id="tc">
            <span>终端参数</span>
          </div>
          <Row>
            <Col span={6} className="title">
              交换机共享密钥 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="tcSwitcherPasswordMM"
                validate={[key]}
                InputProps={{
                  placeholder: passPlaceCode,
                  type: 'password'
                }}
                className={hasSetPwd}
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="title">
              终端自动锁屏时间 ：
            </Col>
            <Col span={18} className="content">
              <Field
                name="tcAutoLockTime"
                validate={[required, isInt, numberRange(0, 9999)]}
                InputProps={{
                  addonAfter: '分',
                  placeholder: '输入范围(0-9999)'
                }}
                component={InputField}
              />
            </Col>
          </Row>
        </Auth>
        <Auth allow="security">
          <Row style={{ height: '50px' }} />
        </Auth>
        <Row className="form-opt-btn">
          <Col className="error-wrap" span={18}>
            <span className="error-msg">{error}</span>
          </Col>
          <Col span={6} style={{ paddingLeft: '25px' }}>
            <Button
              disabled={loading || Object.keys(syncErrors).length || pristine}
              onClick={onSubmit}
            >
              {loading ? '执行中' : '确定'}
              {loading && <Icon type="loading" spin />}
            </Button>
            {!loading && (
              <Button
                onMouseDown={onClose}
                onMouseUp={onClose}
                onClick={onClose}
              >
                取消
              </Button>
            )}
          </Col>
        </Row>
      </form>
    </div>
  )
}
export default reduxForm({
  form: 'SystemForm'
})(SystemForm)
