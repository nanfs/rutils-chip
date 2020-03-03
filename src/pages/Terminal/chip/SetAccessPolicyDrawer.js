import React from 'react'
import { Tablex, Formx, Drawerx, Title, Diliver } from '@/components'
import { Tag } from 'antd'
import { columns, apiMethod } from './AccessTableCfg'
import terminalApi from '@/services/terminal'
import produce from 'immer'

const { createTableCfg, TableWrap, ToolBar } = Tablex
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
      paging: { size: 10 },
      rowKey: record => `${record.id}&${record.name}`,
      searchs: {},
      pageSizeOptions: ['5', '10']
    })
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

  removeAccessSelection = key => {
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
      () => this.accessTablex.replace(this.state.tableCfg)
    )
  }

  renderSelectAccess = () => {
    const { totalSelection } = this.state
    // console.log('totalSelection', totalSelection)
    return totalSelection.map(item => (
      <Tag key={item} closable onClose={() => this.removeAccessSelection(item)}>
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
        pageSizeOptions: ['5', '10']
      })
    })
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
              draft.tableCfg = {
                ...draft.tableCfg,
                selection: totalSelection
              }
            }),
            () => this.accessTablex.replace(this.state.tableCfg)
          )
        })
        .catch(e => {
          console.log(e)
        })
    } else {
      this.accessTablex.refresh(this.state.tableCfg)
    }
    this.drawer.show()
  }

  setAccess = () => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    const { sns, totalSelection } = this.state
    const ids = totalSelection.map(item => {
      const [id, name] = item.split('&')
      // return { id, name, domain: 'internal' }
      return id
    })

    terminalApi
      .setAccess({ sns, ids })
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
      () => this.accessTablex.refresh(this.state.tableCfg)
    )
  }

  render() {
    // const searchOptions = [{ label: '用户名', value: 'username' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.onClose}
        onOk={this.setAccess}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <TableWrap>
            <ToolBar>
              {/* <SelectSearch
                options={searchOptions}
                onSearch={this.search}
              ></SelectSearch> */}
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.accessTablex = ref
              }}
              stopFetch={true}
              saveSelection={true}
              tableCfg={this.state.tableCfg}
              onSelectChange={this.onSelectChange}
            />
          </TableWrap>
          <Diliver />
          <Title slot="已选择"></Title>
          {this.renderSelectAccess()}
        </Formx>
      </Drawerx>
    )
  }
}
