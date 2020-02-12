import React from 'react'
import { Form, Input, Select } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import SelectSearch from '@/components/SelectSearch'
import Title, { Diliver } from '@/components/Title'
import UserButton from '@/components/UserButton'
import { columns, apiMethod } from './UserTableCfg'
import produce from 'immer'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'

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

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        <Formx>
          <TableWrap>
            <ToolBar>
              <BarLeft>
                <SelectSearch
                  options={searchOptions}
                  onSearch={this.search}
                ></SelectSearch>
              </BarLeft>
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.tablex = ref
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

          {/* <Form.Item prop="users" label="模板">
            <Select mode="multiple" style={{ width: '100%' }}>
            </Select>
          </Form.Item> */}
        </Formx>
      </Drawerx>
    )
  }
}
