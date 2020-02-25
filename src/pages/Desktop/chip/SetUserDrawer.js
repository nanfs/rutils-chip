import React from 'react'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import SelectSearch from '@/components/SelectSearch'
import Title, { Diliver } from '@/components/Title'
import UserButton from '@/components/UserButton'
import { columns, apiMethod } from './UserTableCfg'
import desktopsApi from '@/services/desktops'
import produce from 'immer'
import Tablex, { createTableCfg, TableWrap, ToolBar } from '@/components/Tablex'

// 是否翻页保存数据
export default class SetUserDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      rowKey: 'uuid',
      searchs: { domain: 'internal' },
      pageSizeOptions: ['5', '10']
    })
  }

  removeUserSelection = uuid => {
    const { selection, selectData } = this.state.tableCfg
    const newSelection = selection.filter(item => item !== uuid)
    const newSelectData = selectData.filter(item => item.uuid !== uuid)
    this.setState(
      produce(draft => {
        draft.tableCfg = {
          ...draft.tableCfg,
          selection: newSelection,
          selectData: newSelectData
        }
      }),
      () => this.userTablex.replace(this.state.tableCfg)
    )
  }

  renderSelectUser = () => {
    const selectData = this.state.tableCfg.selectData || []
    return selectData.map(item => (
      <UserButton
        key={item.uuid}
        value={item.uuid}
        onDel={this.removeUserSelection}
      >
        {item.username}
      </UserButton>
    ))
  }

  pop = ids => {
    // 如果是一个 获取当前分配的用户
    if (ids.length) {
      console.log('ids', ids)
      this.setState({ ids })
      desktopsApi
        .detail(ids[0])
        .then(res => {
          this.setState({ owner: res.data.owner })
          console.log(res.data.owner)
        })
        .catch(e => {
          console.log(e)
        })
    }
    this.userTablex.refresh(this.state.tableCfg)
    this.drawer.show()
  }

  setUser = () => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    const { ids } = this.state
    const { selectData } = this.state.tableCfg
    const users = selectData
    desktopsApi
      .setUser({ ids, users })
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
              onSelectChange={(selection, selectData) =>
                this.setState(
                  produce(draft => {
                    draft.tableCfg = {
                      ...draft.tableCfg,
                      selection,
                      selectData
                    }
                  })
                )
              }
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
