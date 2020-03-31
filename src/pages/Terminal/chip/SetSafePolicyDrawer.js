import React from 'react'
import { Tag, Switch, message } from 'antd'
import { columns, apiMethod } from '@/pages/Device/chip/TableCfg'
import terminalApi from '@/services/terminal'
import produce from 'immer'
import { Drawerx, Formx, Tablex, Diliver, Title } from '@/components'

// 是否翻页保存数据
const { createTableCfg, TableWrap, ToolBar } = Tablex
export default class SetSafePolicyDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    totalSelection: [],
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 10 },
      rowKey: record => `${record.id}&${record.name}`,
      searchs: {},
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    switchDisable: true,
    switchStatus: true
  }

  onSelectChange = selection => {
    const newSelection = selection
    this.setState(
      produce(draft => {
        draft.totalSelection = newSelection
        draft.switchDisable = newSelection.length > 0 // 当清空已选择时，打开开关
        draft.tableCfg = {
          ...draft.tableCfg,
          selection: newSelection
        }
      })
    )
  }

  removeDeviceSelection = key => {
    const { totalSelection } = this.state
    const newSelection = totalSelection.filter(item => item !== key)
    this.setState(
      produce(draft => {
        draft.totalSelection = newSelection
        draft.switchDisable = newSelection.length > 0 // 当清空已选择时，打开开关
        draft.tableCfg = {
          ...draft.tableCfg,
          selection: newSelection
        }
      }),
      () => this.deviceTablex.replace(this.state.tableCfg)
    )
  }

  renderSelectDevice = () => {
    const { totalSelection } = this.state
    return totalSelection.map(item => (
      <Tag key={item} closable onClose={() => this.removeDeviceSelection(item)}>
        {item && item.split('&')[1]}
      </Tag>
    ))
  }

  pop = sns => {
    // 如果是一个 获取当前分配的用户
    this.setState({
      sns,
      totalSelection: [],
      tableCfg: createTableCfg({
        columns,
        apiMethod,
        paging: { size: 10 },
        rowKey: record => `${record.id}&${record.name}`,
        searchs: {},
        pageSizeOptions: ['5', '10', '20', '50']
      })
    })
    if (sns && sns.length === 1) {
      terminalApi
        .detail(sns[0])
        .then(res => {
          const { safePolicys } = res.data
          const totalSelection = safePolicys.map(
            item => `${item.id}&${item.name}`
          )
          const switchStatus =
            safePolicys.length > 0 ? safePolicys[0].usbSupport === '1' : true
          this.setState(
            produce(draft => {
              draft.totalSelection = totalSelection
              draft.switchDisable = safePolicys.length > 0
              draft.switchStatus = switchStatus
              draft.tableCfg = {
                ...draft.tableCfg,
                selection: totalSelection
              }
              draft.tableCfg.searchs = {
                ...draft.tableCfg.searchs,
                usagePeripherals: switchStatus ? '1' : '0'
              }
            }),
            () => this.deviceTablex.replace(this.state.tableCfg)
          )
        })
        .catch(error => {
          message.error(error.message || error)
          console.log(error)
        })
    } else {
      this.setState(
        produce(draft => {
          draft.switchDisable = false
          draft.switchStatus = true
          draft.tableCfg.searchs = {
            ...draft.tableCfg.searchs,
            usagePeripherals: '1'
          }
        }),
        () => this.deviceTablex.replace(this.state.tableCfg)
      )
    }
    this.drawer.show()
  }

  setDevice = () => {
    const { sns, totalSelection } = this.state
    const ids = totalSelection.map(item => {
      const [id, name] = item.split('&')
      // return { id, name, domain: 'internal' }
      return id
    })

    terminalApi
      .setDevice({ sns, ids })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
      })
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.deviceTablex.refresh(this.state.tableCfg)
    )
  }

  switchChange = checked => {
    this.setState(
      produce(draft => {
        draft.switchStatus = checked
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          usagePeripherals: checked ? '1' : '0'
        }
      }),
      () => this.deviceTablex.replace(this.state.tableCfg)
    )
  }

  render() {
    // const searchOptions = [{ label: '用户名', value: 'username' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
        onOk={this.setDevice}
        onSuccess={this.props.onSuccess}
      >
        <Formx className="p25">
          <TableWrap>
            <ToolBar>
              <Switch
                name="usagePeripherals"
                checkedChildren="启用外设"
                unCheckedChildren="禁用外设"
                disabled={this.state.switchDisable}
                checked={this.state.switchStatus}
                onChange={this.switchChange}
              />
              <span className="setsafepolicy-tips">
                只允许设置同一种类型的外设控制策略
              </span>
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.deviceTablex = ref
              }}
              stopAutoFetch={true}
              saveSelection={true}
              tableCfg={this.state.tableCfg}
              onSelectChange={this.onSelectChange}
            />
          </TableWrap>
          <Diliver />
          <Title slot="已选择"></Title>
          {this.renderSelectDevice()}
        </Formx>
      </Drawerx>
    )
  }
}
