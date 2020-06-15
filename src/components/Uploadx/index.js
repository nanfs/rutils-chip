import React from 'react'
import { Input, Button, Upload, Row, Col, message } from 'antd'
import './index.less'

export default class Uploadx extends React.Component {
  state = {
    fileList: [],
    value: ''
  }

  componentDidUpdate(prep) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
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
      this.setState({ value: file.name })
      return file
    })

    this.setState({ fileList })
    fileChange && fileChange(fileList)
  }

  beforeUpload = (file, fileList) => {
    const { fileChange, acceptType, maxSize, checkName } = this.props
    if (file.size > maxSize) {
      message.error('上传文件大小不能超过100M')
      return false
    }
    if (
      `.${file.name.split('.')[file.name.split('.').length - 1]}` !== acceptType
    ) {
      message.error('上传文件格式错误')
      return false
    }
    if (checkName && !checkName(file.name)) {
      message.error('上传文件命名格式错误')
      return false
    }
    this.setState({
      fileList: [file],
      value: file.name
    })
    fileChange && fileChange(fileList.slice(-1), file.name)
    return false
  }

  onUploadChange = info => {
    const { acceptType, maxSize, checkName } = this.props
    if (info.file.size > maxSize) {
      return false
    }
    if (checkName && !checkName(info.file.name)) {
      return false
    }
    if (
      `.${info.file.name.split('.')[info.file.name.split('.').length - 1]}` !==
      acceptType
    ) {
      return false
    }
    this.setState({ value: info.file.name })
    this.props.onChange(info.file.name)
  }

  inputChange = e => {
    const { fileNameChange } = this.props
    this.setState({ value: e.target.value })
    fileNameChange && fileNameChange(e.target.value)
  }

  render() {
    const { action, hasInput, acceptType } = this.props
    return (
      <Row>
        <Col span={18} hidden={!hasInput}>
          <Input
            style={{ display: 'inline-block' }}
            placeholder=""
            value={this.state?.value}
            disabled
          />
        </Col>
        <Col span={6}>
          <Upload
            className="uploadx"
            style={{ display: 'inline-block' }}
            name="files"
            fileList={this.state.fileList}
            action={action}
            onChange={this.onUploadChange}
            beforeUpload={this.beforeUpload}
            accept={acceptType}
          >
            <Button type="primary">浏览文件</Button>
          </Upload>
        </Col>
      </Row>
    )
  }
}
