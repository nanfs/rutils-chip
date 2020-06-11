import React from 'react'
import { Input, Button, Upload, Row, Col, message } from 'antd'
import './index.less'

export default class Uploadx extends React.Component {
  state = {
    fileList: [],
    inputValue: ''
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentDidUpdate(prep) {
    if (this.props.inputValue !== prep.inputValue) {
      this.setState({ inputValue: this.props.inputValue })
    }
  }

  handleChange = info => {
    const { fileChange } = this.props
    let fileList = [...info.fileList]

    // 1. Limit the number of uploaded files
    fileList = fileList.slice(-1)

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url
      }
      this.setState({ inputValue: file.name })
      return file
    })

    this.setState({ fileList })
    fileChange && fileChange(fileList)
  }

  beforeUpload = (file, fileList) => {
    const { fileChange } = this.props
    this.setState({
      fileList: [file],
      inputValue: file.name
    })
    fileChange && fileChange(fileList.slice(-1))
    return false
  }

  reset = () => {
    debugger
    this.setState({ inputValue: '' })
  }

  renderUpload = () => {
    const { action } = this.props
    return (
      <Upload
        className="uploadx"
        style={{ display: 'inline-block' }}
        name="files"
        fileList={this.state.fileList}
        action={action}
        // onChange={this.handleChange}
        beforeUpload={this.beforeUpload}
      >
        <Button>浏览文件</Button>
      </Upload>
    )
  }

  render() {
    const { hasInput } = this.props
    return (
      <Row>
        <Col span={18} hidden={!hasInput}>
          <Input
            style={{ display: 'inline-block' }}
            placeholder=""
            disabled
            value={this.state?.inputValue}
          />
        </Col>
        <Col span={6}>{this.renderUpload()}</Col>
      </Row>
    )
  }
}
