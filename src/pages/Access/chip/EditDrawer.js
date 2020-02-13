import React from 'react'
import { Form, Input, Icon } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'

export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        <Formx
          onSubmit={values => {
            console.log(values)
            return false
          }}
        >
          <Form.Item prop="username">
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="username"
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
