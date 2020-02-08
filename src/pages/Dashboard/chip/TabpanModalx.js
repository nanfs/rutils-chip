import React from 'react'
import ModalDemo from './ModalDemo'
import ModalDemo2 from './ModalDemo2'

import { Button } from 'antd'

export default class TabpanModalx extends React.Component {
  render() {
    return (
      <div className="table-wrapper">
        <div className="button-group left">
          <Button
            type="primary"
            icon="add"
            className="mr10"
            onClick={() => this.modal.pop()}
          >
            点击弹窗
          </Button>
          <Button
            type="primary"
            icon="add"
            className="mr10"
            onClick={() => this.modal2.pop()}
          >
            点击弹窗2
          </Button>
        </div>
        <ModalDemo
          onRef={ref => {
            this.modal = ref
          }}
        />
        <ModalDemo2
          onRef={ref => {
            this.modal2 = ref
          }}
        />
      </div>
    )
  }
}
