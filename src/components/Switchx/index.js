import React from 'react'
import { Input, Switch } from 'antd'

export default class Switchx extends React.Component {
  render() {
    const { value, checkedChildren, unCheckedChildren, ...rest } = this.props
    console.log(value)
    const transForm = { off: false, on: true }
    return (
      <Input
        {...rest}
        onChange={v => {
          console.log(v)
        }}
      >
        <Switch
          {...rest}
          checkedChildren
          unCheckedChildren
          // checked={!!value || transForm[value]}
        />
      </Input>
    )
  }
}
