import React from 'react'
import { Button, Icon, Form } from 'antd'
import {
  Field,
  ReduxForm,
  InputField,
  PasswordField
} from '@/components/ReduxForm'
import { required } from '@/utils/valid'
// import Footer from '@/components/Footer'
import styles from './loginFrom.m.scss'
import MyIcon from '@/components/MyIcon'

function LoginForm(props) {
  const {
    onSubmit,
    error,
    loading,
    onKeyPress
    // meta: { pristine, valid }
  } = props
  return (
    <React.Fragment>
      <Form className="login-form" action="" onSubmit={onSubmit}>
        <div className="item-wrap">
          <MyIcon type="gonghao" className="icon-prex" component="svg" />
          <Field
            name="identificationNumber"
            validate={[required]}
            component={InputField}
          />
        </div>
        <div className="password-item item-wrap">
          <MyIcon type="mima" className="icon-prex" component="svg" />
          <Field
            name="password"
            validate={[required]}
            component={PasswordField}
            onKeyPress={onKeyPress.bind(this, props.meta.values)}
          />
        </div>
        <div className={styles['error-msg']}>
          {error && (
            <span>
              <Icon type="warning" />
              {error}
            </span>
          )}
        </div>
        <div className="item-wrap">
          <div
            onClick={onSubmit}
            className={styles.button}
            // disabled={loading || !valid || pristine}
          >
            登录
            {loading && <Icon type="loading" spin />}
          </div>
        </div>
      </Form>
    </React.Fragment>
  )
}

export default ReduxForm({
  form: 'LoginForm'
})(LoginForm)
