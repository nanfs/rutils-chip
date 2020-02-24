import React from 'react'
import { Form, Input, notification, message } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import terminalApi from '@/services/terminal'

const { TextArea } = Input

export default class SendMessageDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    messageNumber: 0
  }

  handleChange = value => {
    console.log(value)
    /* this.setState({
      messageNumber: value.length
    }) */
  }

  sendMessage = (values, sns) => {
    terminalApi
      .directiveTerminal({ sns, command: 'sendMessage', ...values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  render() {
    const { selectData, selection } = this.props
    const { messageNumber } = this.state
    console.log(messageNumber)
    let selectName = selectData.map(item => {
      return item.name
    })
    selectName = selectName
      .join('，')
      .substring(0, selectName.join('，').length - 1)

    console.log(selectName)
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.sendMessage(values, selection)
        }}
        onClose={this.props.onClose}
      >
        <Formx
          onRef={ref => {
            this.formx = ref
          }}
        >
          <div className="terminal-sendmessage-text">
            向终端{selectName}发送消息
          </div>
          <div className="terminal-sendmessage-tips">
            温馨提示：文本内容不得超过500字。您还可以输入
            <span className="terminal-sendmessage-tips-num">200</span>字！
          </div>

          <Form.Item
            prop="message"
            label=""
            rules={[
              {
                required: true,
                message: '请输入消息内容'
              }
            ]}
            wrapperCol={{ sm: { span: 24 } }}
          >
            <TextArea
              rows={10}
              placeholder="消息内容"
              onChange={this.handleChange}
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
