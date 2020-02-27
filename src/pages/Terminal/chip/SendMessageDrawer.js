import React from 'react'
import { Form, Input, notification, message } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import terminalApi from '@/services/terminal'
import debounce from 'lodash.debounce'

const { TextArea } = Input

export default class SendMessageDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    messageNumber: 500,
    sns: [],
    selectData: []
  }

  pop = (sns, selectData) => {
    this.drawer.show()
    let selectName = selectData.map(item => {
      return item.name
    })
    selectName = selectName
      .join('，')
      .substring(0, selectName.join('，').length - 1)
    this.setState({
      sns,
      selectName
    })
  }

  handleChange = (a, b, e) => {
    e.persist()
    debounce(() => {
      console.log(a, b, e.target.value)
      this.setState({
        messageNumber: 500 - e.target.value.length
      })
    }, 1000)()
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
    const { messageNumber, selectName, sns } = this.state
    console.log(messageNumber)
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.sendMessage(values, sns)
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
            <span className="terminal-sendmessage-tips-num">
              {messageNumber}
            </span>
            字！
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
