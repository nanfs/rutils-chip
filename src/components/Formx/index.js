import React from 'react'
import { Form, message } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5, pull: 1 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  }
}

class Formx extends React.Component {
  componentDidMount() {
    const { onRef } = this.props
    onRef && onRef(this)
    this.props.form.setFieldsValue(this.props.initValues)
    this.forceUpdate()
  }

  componentDidUpdate(prep) {
    if (
      JSON.stringify(this.props.initValues) !==
        JSON.stringify(prep.initValues) &&
      this.props.form
    ) {
      this.props.form.setFieldsValue(this.props.initValues)
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { onSubmit, form } = this.props
    form
      .validateFieldsAndScroll((error, values) => {
        if (!error) {
          onSubmit && onSubmit(values)
        }
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  renderFormItem = (child, submitting, isParentShow) => {
    if (!React.isValidElement(child)) {
      return child
    }
    if (child.props.prop) {
      const {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue
      } = this.props.form
      const rules = child.props.rules || undefined
      const value = getFieldValue(child.props.prop)
      const values = getFieldsValue()
      const childNode = getFieldDecorator(
        child.props.prop,
        {
          rules,
          valuePropName: child.props.valuepropname ? 'checked' : 'value'
        },
        {}
      )(
        React.cloneElement(child.props.children, {
          disabled: child.props.children.props.disabled || submitting,
          onChange: e => {
            const { onChange } = child.props.children.props
            onChange && onChange(value, values, e)
          }
        })
      )
      return React.cloneElement(child, {}, childNode)
    }
    if (child.props.children) {
      const sonNode = React.Children.map(child.props.children, son =>
        this.renderFormItem(son, submitting, isParentShow)
      )
      return React.cloneElement(child, {}, sonNode)
    }
    // 刷新除了 TODO
    // if (child.props && child.props.onRef) {
    //   return child
    // }
    return isParentShow !== false && child
  }

  render() {
    const { children, className, style, submitting, isParentShow } = this.props
    const formLayout = this.props.formItemLayout || formItemLayout
    return (
      <Form
        {...formLayout}
        onSubmit={this.handleSubmit}
        className={className}
        style={style}
      >
        {React.Children.map(children, child =>
          this.renderFormItem(child, submitting, isParentShow)
        )}
      </Form>
    )
  }
}
export default Form.create()(Formx)
