import React from 'react'

import taskApi from '@/services/task'
import Modalx, { createModalCfg } from '@/components/Modalx'

export default class ModalDemo2 extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  getResult = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        taskApi.list().then(res => {
          console.log(res)
          resolve(res)
        })
      }, 1000)
    })
  }

  pop = () => {
    this.modal.show()
  }

  onOk = () => {
    this.getResult().then(res => this.modal.afterSubmit(res))
  }

  render() {
    const modalCfg = createModalCfg({ title: '弹窗2' })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
      >
        弹窗2
      </Modalx>
    )
  }
}
