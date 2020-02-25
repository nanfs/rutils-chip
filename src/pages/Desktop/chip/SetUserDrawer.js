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
      pageSizeOptions: ['5', '10']
    })
  }

  removeUserSelection = id => {
    const { selection, selectData } = this.state.tableCfg
    const newSelection = selection.filter(item => item !== id)
    const newSelectData = selectData.filter(item => item.id !== id)
    this.setState(
      produce(draft => {
        draft.tableCfg = {
          ...draft.tableCfg,
          selection: newSelection,
          selectData: newSelectData
        }
      }),
      () => this.tablex.replace(this.state.tableCfg)
    )
  }

  renderSelectUser = () => {
    const selectData = this.state.tableCfg.selectData || []
    return selectData.map(item => (
      <UserButton
        key={item.id}
        value={item.id}
        onDel={this.removeUserSelection}
      >
        {item.name}
      </UserButton>
    ))
  }

  pop = ids => {
    // 如果是一个 获取当前分配的用户
    if (ids.length) {
      console.log('ids', ids)
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

    this.drawer.show()
  }

  setUser = () => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    const { selection: ids, selectData } = this.state.tableCfg
    console.log('select', selectData)
    desktopsApi
      .setUser({ ids })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  render() {
    const searchOptions = [{ label: 'internal', value: 'internal' }]
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
