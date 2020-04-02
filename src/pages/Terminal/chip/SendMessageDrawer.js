import React from 'react'
import { Form, Input } from 'antd'
import { Drawerx, Formx } from '@/components'
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

  /**
   * @memberof SendMessageDrawer
   * @param {array} sns 选中终端sn数组
   * @param {array} selectData 选中终端数据数组
   * @description 打开发送消息抽屉，传入selectData，处理成终端名称的字符串，中间以逗号隔开
   * @author linghu
   */
  pop = (sns, selectData) => {
    this.drawer.show()
    let selectName = selectData.map(item => {
      return item.name
    })
    selectName = selectName.join('，')
    this.setState({
      sns,
      selectName
    })
  }

  /**
   * @memberof SendMessageDrawer
   * @description 监听输入，利用防抖过滤计算出还可以输入多少字符
   * @author linghu
   */
  handleChange = (a, b, e) => {
    e.persist()
    debounce(() => {
      this.setState({
        messageNumber: 500 - e.target.value.length
      })
    }, 1000)()
  }

  /**
   * @memberof SendMessageDrawer
   * @description 向后端发送请求
   * @author linghu
   */
  sendMessage = (values, sns) => {
    terminalApi
      .directiveTerminal({ sns, command: 'sendMessage', ...values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  render() {
    const { messageNumber, selectName, sns } = this.state
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
