import React from 'react'
import { Form } from 'antd'

class Formx extends React.Component {
  componentDidMount() {
    const { initValues, onRef, form } = this.props
    onRef && onRef(this)
    // TODO 检查不生效
    // form.setFieldsInitialValue(initValues)
    form.setFieldsValue(initValues)
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
        console.log(errors)
      })
  }

  render() {
    const { children } = this.props
    return (
      <Form onSubmit={this.handleSubmit}>
        {React.Children.map(children, child => {
          if (child.type.name === 'FormItem' && child.props.prop) {
            const {
              getFieldDecorator,
              getFieldValue,
              getFieldsValue
            } = this.props.form
            const rules = child.props.rules || undefined
            const value = getFieldValue(child.props.prop)
            const values = getFieldsValue()
            const childNode = getFieldDecorator(child.props.prop, {
              rules
            })(
              React.cloneElement(child.props.children, {
                onChange: () => {
                  const { onChange } = child.props.children.props
                  onChange && onChange(value, values)
                }
              })
            )
            return React.cloneElement(child, {}, childNode)
          }
          return React.cloneElement(child)
        })}
      </Form>
    )
  }
}
export default Form.create()(Formx)
