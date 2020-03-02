import React from 'react'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import SelectSearch from '@/components/SelectSearch'
import Title, { Diliver } from '@/components/Title'
// import UserButton from '@/components/UserButton'
import { columns, apiMethod } from './UserTableCfg'
import { Tag, message } from 'antd'
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
      paging: { size: 10 },
      rowKey: record =>
        `${record.uuid}&${record.username}&${record.username}&${record.groupname}`,
      searchs: { domain: 'internal' },
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
    return totalSelection.map(item => (
      <Tag key={item} closable onClose={() => this.removeUserSelection(item)}>
        {item && item.split('&')[1]}
      </Tag>
    ))
  }

  pop = poolId => {
    // 如果是一个 获取当前分配的用户
    this.drawer.show()
    this.userTablex.replace(this.state.tableCfg)
    this.setState({
      poolId,
      totalSelection: [],
      tableCfg: createTableCfg({
        columns,
        apiMethod,
        paging: { size: 10 },
        rowKey: record =>
          `${record.uuid}&${record.username}&${record.name}&${record.groupname}`,
        searchs: { domain: 'internal' },
        pageSizeOptions: ['5', '10']
      })
    })
    poolsApi
      .detail(poolId)
      .then(res => {
        const { owner } = res.data
        const totalSelection = owner.map(
          item =>
            `${item.uuid}&${item.username}&${item.name}&${item.department}`
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
      .catch(errors => {
        console.log(errors)
        message.error(errors)
      })
  }

  setUser = () => {
    const { poolId, totalSelection } = this.state
    const users = totalSelection.map(item => {
      const [uuid, username, name, groupname] = item.split('&')
      return {
        uuid,
        username,
        name,
        department: groupname,
        domain: 'internal-authz'
      }
    })

    poolsApi
      .setUser({ poolId, users })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
        message.error(errors)
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
        onClose={this.onClose}
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
              saveSelection={true}
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
