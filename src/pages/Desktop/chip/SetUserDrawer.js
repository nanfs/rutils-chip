import React from 'react'
import {
  Drawerx,
  Formx,
  SelectSearch,
  Title,
  Diliver,
  Tablex
} from '@/components'
import { columns, apiMethod } from './UserTableCfg'
import { Tag, message } from 'antd'
import desktopsApi from '@/services/desktops'
import produce from 'immer'

const { createTableCfg, TableWrap, ToolBar } = Tablex
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
      selection: [],
      searchs: { domain: 'internal' },
      pageSizeOptions: ['5', '10']
    })
  }

  onSelectChange = selection => {
    console.log('newSelection', selection)
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

  pop = ids => {
    // 如果是一个 获取当前分配的用户
    this.drawer.show()
    this.setState({
      ids,
      totalSelection: [],
      tableCfg: createTableCfg({
        columns,
        apiMethod,
        paging: { size: 10 },
        selection: [],
        rowKey: record =>
          `${record.uuid}&${record.username}&${record.firstname}&${record.lastname}&${record.groupname}`,
        searchs: { domain: 'internal' },
        pageSizeOptions: ['5', '10']
      })
    })
    if (ids && ids.length === 1) {
      desktopsApi
        .detail(ids[0])
        .then(res => {
          const { owner } = res.data
          const totalSelection = owner.map(
            item =>
              `${item.uuid}&${item.username}&${item.firstname}&${item.lastname}&${item.department}`
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
          message.error(errors)
          console.log(errors)
        })
    } else {
      this.userTablex.refresh(this.state.tableCfg)
    }
  }

  setUser = () => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    const { ids, totalSelection } = this.state
    const users = totalSelection.map(item => {
      const [uuid, username, firstname, lastname, groupname] = item.split('&')
      return {
        uuid,
        username,
        firstname: firstname !== 'null' ? firstname : '',
        lastname: lastname !== 'null' ? lastname : '',
        department: groupname,
        domain: 'internal-authz'
      }
    })

    desktopsApi
      .setUser({ ids, users })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
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
