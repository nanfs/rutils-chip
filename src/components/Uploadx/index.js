import React from 'react'
import { Input, Button, Upload, Row, Col, message } from 'antd'
import './index.less'

export default class Uploadx extends React.Component {
  state = {
    fileList: []
  }

  componentDidUpdate(prep) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange = info => {
    let fileList = [...info.fileList]

    // 1. Limit the number of uploaded files
    fileList = fileList.slice(-1)

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url
      }
      if (file.status === 'done') {
        message.success(`${file.name} 上传成功`)
        this.setState({ value: file.name })
      } else if (file.status === 'error') {
        message.error(`${file.name} 上传失败`)
      }
      return file
    })

    this.setState({ fileList })
  }

  renderOptions = () => {
    const { action } = this.props
    return (
      <Upload
        className="uploadx"
        style={{ display: 'inline-block' }}
        name="files"
        fileList={this.state.fileList}
        action={action}
        onChange={this.handleChange}
      >
        <Button>浏览文件</Button>
      </Upload>
    )
  }

  render() {
    const { hasInput } = this.props
    return (
      <React.Fragment>
        <Row>
          {hasInput && (
            <Col span={18}>
              <Input
                style={{ display: 'inline-block' }}
                placeholder=""
                disabled
                value={this.state?.value}
              />
            </Col>
          )}
          <Col span={6}>{this.renderOptions()}</Col>
        </Row>
      </React.Fragment>
    )
  }
}
