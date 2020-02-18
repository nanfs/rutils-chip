import React from 'react'
import { Button, message, Modal } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import accessApi from '@/services/access'
import moment from 'moment'

const { confirm } = Modal

export default class Desktop extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    initValues: {}
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  addAccess = () => {
    this.setState({ inner: '创建' }, this.addDrawer.drawer.show())
    this.currentDrawer = this.addDrawer
  }

  editAccess = () => {
    let selectAccess = {}
    if (this.tablex.getSelection().length === 1) {
      selectAccess = this.tablex.getSelectData()[0]
      selectAccess.type = selectAccess.admitInterval[0].type
      if (selectAccess.type === 0) {
        selectAccess.weeks = selectAccess.admitInterval[0].date.split(',')
        selectAccess.day = ''
      } else {
        selectAccess.weeks = []
        selectAccess.day = moment(
          selectAccess.admitInterval[0].date,
          'YYYY/MM/DD'
        )
      }
      selectAccess.startTime = moment(
        selectAccess.admitInterval[0].startTime,
        'HH:mm'
      )
      selectAccess.endTime = moment(
        selectAccess.admitInterval[0].endTime,
        'HH:mm'
      )
      this.setState(
        { inner: '编辑', initValues: selectAccess },
        this.editDrawer.drawer.show()
      )
      this.currentDrawer = this.editDrawer
    } else {
      message.warning('请选择一条数据进行编辑！')
    }
  }

  delAccess = () => {
    const selectAccess = this.tablex.getSelection()
    if (selectAccess.length >= 1) {
      confirm({
        title: '确定删除所选数据?',
        onOk() {
          accessApi.delDev(selectAccess)
        },
        onCancel() {}
      })
    } else {
      message.warning('请选择一条数据进行删除！')
    }
  }

  render() {
    return (
      <React.Fragment>
        <InnerPath
          location="准入控制"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.addAccess} style={{ marginRight: '10px' }}>
                创建
              </Button>
              <Button onClick={this.editAccess} style={{ marginRight: '10px' }}>
                编辑
              </Button>
              <Button onClick={this.delAccess}>删除</Button>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            initValues={{ type: 'week', name: 'test' }}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            initValues={this.state.initValues}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
