import React from 'react'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import SelectSearch from '@/components/SelectSearch'
import { Tag, Switch } from 'antd'
import Title, { Diliver } from '@/components/Title'
import { columns, apiMethod } from './SafePolicyTableCfg'
import terminalApi from '@/services/terminal'
import produce from 'immer'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'

// 是否翻页保存数据
export default class SetSafePolicyDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    totalSelection: [],
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      rowKey: record => `${record.id}&${record.name}`,
      searchs: { domain: 'internal' },
      pageSizeOptions: ['5', '10']
    }),
    switchDisable: true
  }

  onClose = () => {
    this.setState(
      {
        totalSelection: [],
        tableCfg: createTableCfg({
          columns,
          apiMethod,
          selection: [],
          paging: { size: 5 },
          rowKey: record => `${record.id}&${record.name}`,
          searchs: { domain: 'internal' },
          pageSizeOptions: ['5', '10']
        }),
        switchDisable: true
      },
      this.props.onClose()
    )
  }

  onSelectChange = selection => {
    const newSelection = selection
    this.setState(
      produce(draft => {
        draft.totalSelection = newSelection
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
    console.log('totalSelection', totalSelection)
    return totalSelection.map(item => (
      <Tag key={item} closable onClose={() => this.removeDeviceSelection(item)}>
        {item && item.split('&')[1]}
      </Tag>
    ))
  }

  pop = sns => {
    // 如果是一个 获取当前分配的用户
    this.setState({ sns })
    if (sns && sns.length === 1) {
      terminalApi
        .detail(sns[0])
        .then(res => {
          const { admitPolicys } = res.data
          const totalSelection = admitPolicys.map(
            item => `${item.id}&${item.name}`
          )
          this.setState(
            produce(draft => {
              draft.totalSelection = totalSelection
              draft.switchDisable = true
              draft.tableCfg = {
                ...draft.tableCfg,
                selection: totalSelection
              }
            }),
            () => this.deviceTablex.replace(this.state.tableCfg)
          )
        })
        .catch(e => {
          console.log(e)
        })
    } else {
      console.log('aaaa')
      this.setState({
        switchDisable: false
      })
      this.deviceTablex.refresh(this.state.tableCfg)
    }
    this.drawer.show()
  }

  setDevice = () => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    console.log(this.state.totalSelection)
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
        console.log(errors)
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
        <Formx>
          <TableWrap>
            <ToolBar>
              {/* <Switch
                name="usagePeripherals"
                checkedChildren="启用外设"
                unCheckedChildren="禁用外设"
                disabled={this.state.switchDisable}
                checked={this.state.swichStatus}
              />
              <span className="setsafepolicy-tips">
                只允许设置同一种类型的外设控制策略
              </span> */}
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.deviceTablex = ref
              }}
              stopFetch={true}
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
