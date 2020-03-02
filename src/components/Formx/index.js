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
    // TODO 检查不生效
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
      .validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit && onSubmit(values)
        }
      })
      .catch(errors => {
        message.error(errors)
        console.log(errors)
      })
  }

  renderFormItem = (child, submitting) => {
    if (!React.isValidElement(child)) {
      return child
    }
    if (child.type.name === 'FormItem' && child.props.prop) {
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
          disabled: submitting,
          onChange: e => {
            const { onChange } = child.props.children.props
            onChange && onChange(value, values, e)
          }
        })
      )
      return React.cloneElement(child, {}, childNode)
    }
    if (child.type.name === 'FormItem') {
      return React.cloneElement(child)
    }
    if (child.props.children) {
      const sonNode = React.Children.map(child.props.children, son =>
        this.renderFormItem(son)
      )
      return React.cloneElement(child, {}, sonNode)
    }
    return child
  }

  render() {
    const { children, className, style, submitting } = this.props
    const formLayout = this.props.formItemLayout || formItemLayout
    return (
      <Form
        {...formLayout}
        onSubmit={this.handleSubmit}
        className={className}
        style={style}
      >
        {React.Children.map(children, child =>
          this.renderFormItem(child, submitting)
        )}
      </Form>
    )
  }
}
export default Form.create()(Formx)
