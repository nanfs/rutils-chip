import React from 'react'
import { Row, Col } from 'violet-ui/components/Grid'
import Button from 'violet-ui/components/Button'
import Icon from 'violet-ui/components/Icon'
import reduxForm from 'violet-ui/components/ReduxForm/reduxForm'
import Field from 'violet-ui/components/ReduxForm/Field'
import InputField from '../../components/Fields/InputField'
import { required, password, textRange } from '../../utils/validate'

function PwdForm(props) {
  const {
    meta: { pristine, syncErrors },
    onSubmit,
    error,
    loading,
    onClose
  } = props
  return (
    <form action="" onSubmit={onSubmit} className="com-form system-form">
      <div className="wrapper">
        <Row>
          <Col span={6} className="title">
            原密码 ：
          </Col>
          <Col span={18} className="content">
            <Field
              name="oldPwd"
              validate={[required, textRange(0, 50)]}
              InputProps={{ type: 'password', autoFocus: true }}
              component={InputField}
            />
          </Col>
        </Row>
        <Row>
          <Col span={6} className="title">
            新密码 ：
          </Col>
          <Col span={18} className="content">
            <Field
              name="pwd"
              InputProps={{ type: 'password' }}
              validate={[required, password]}
              component={InputField}
            />
          </Col>
        </Row>
        <Row>
          <Col span={6} className="title">
            确认新密码 ：
          </Col>
          <Col span={18} className="content">
            <Field
              name="repwd"
              validate={[required]}
              InputProps={{ type: 'password' }}
              component={InputField}
            />
          </Col>
        </Row>
      </div>
      <Row className="form-opt-btn">
        <Col className="error-wrap" span={18}>
          <span className="error-msg">{error}</span>
        </Col>
        <Col span={6}>
          <Button
            disabled={loading || Object.keys(syncErrors).length || pristine}
            onClick={onSubmit}
          >
            {loading ? '执行中' : '确定'}
            {loading && <Icon type="loading" spin />}
          </Button>
          {!loading && (
            <Button onMouseDown={onClose} onMouseUp={onClose} onClick={onClose}>
              取消
            </Button>
          )}
        </Col>
      </Row>
    </form>
  )
}
export default reduxForm({
  form: 'PwdForm'
})(PwdForm)
