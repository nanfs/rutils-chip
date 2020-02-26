import React from 'react'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import SelectSearch from '@/components/SelectSearch'
import Title, { Diliver } from '@/components/Title'
// import UserButton from '@/components/UserButton'
import { columns, apiMethod } from './UserTableCfg'
import { Tag } from 'antd'
import poolsApi from '@/services/pools'
import produce from 'immer'
import Tablex, { createTableCfg, TableWrap, ToolBar } from '@/components/Tablex'

// 是否翻页保存数据
export default class SetUserDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    totalSelection: [],
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      rowKey: record => `${record.uuid}&${record.username}`,
      searchs: { domain: 'internal' },
      pageSizeOptions: ['5', '10']
    })
  }

  onSelectChange = selection => {
    const { totalSelection } = this.state
    const newSelection = Array.from(new Set([...totalSelection, ...selection]))
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

  removeUserSelection = key => {
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
      () => this.userTablex.replace(this.state.tableCfg)
    )
  }

  renderSelectUser = () => {
    const { totalSelection } = this.state
    console.log('totalSelection', totalSelection)
    return totalSelection.map(item => (
      <Tag key={item} closable onClose={() => this.removeUserSelection(item)}>
        {item && item.split('&')[1]}
      </Tag>
    ))
  }

  pop = poolId => {
    // 如果是一个 获取当前分配的用户
    this.drawer.show()
    this.setState({ poolId })
    poolsApi
      .detail(poolId)
      .then(res => {
        const { owner } = res.data
        const totalSelection = owner.map(
          item => `${item.uuid}&${item.username}`
        )
        this.setState(
          produce(draft => {
            draft.totalSelection = totalSelection
            draft.tableCfg = {
              ...draft.tableCfg,
              selection: totalSelection
            }
          }),
          () => this.userTablex.replace(this.state.tableCfg)
        )
      })
      .catch(e => {
        console.log(e)
      })
  }

  setUser = () => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    console.log(this.state.totalSelection)
    const { poolId, totalSelection } = this.state
    const users = totalSelection.map(item => {
      const [uuid, username] = item.split('&')
      return { uuid, username, domain: 'internal' }
    })

    poolsApi
      .setUser({ poolId, users })
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
      () => this.userTablex.refresh(this.state.tableCfg)
    )
  }

  render() {
    const searchOptions = [{ label: '用户名', value: 'username' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
        onOk={this.setUser}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <TableWrap>
            <ToolBar>
              <SelectSearch
                options={searchOptions}
                onSearch={this.search}
              ></SelectSearch>
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.userTablex = ref
              }}
              stopFetch={true}
              tableCfg={this.state.tableCfg}
              onSelectChange={this.onSelectChange}
            />
          </TableWrap>
          <Diliver />
          <Title slot="已选择"></Title>
          {this.renderSelectUser()}
        </Formx>
      </Drawerx>
    )
  }
}
