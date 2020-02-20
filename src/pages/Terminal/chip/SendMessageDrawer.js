import React from 'react'
import { Form, Input } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'

const { TextArea } = Input

export default class SendMessageDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    inputValue: 1
  }

  onChange = value => {
    this.setState({
      inputValue: value
    })
  }

  render() {
    const { selectData } = this.props
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
          console.log(values)
          console.log(this)
        }}
      >
        <Formx
          onRef={ref => {
            this.form = ref
          }}
          onSubmit={values => {
            console.log(values)
            return false
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
            prop="description"
            label=""
            rules={[]}
            wrapperCol={{ sm: { span: 24 } }}
          >
            <TextArea rows={10} placeholder="消息内容" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
