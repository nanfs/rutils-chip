import React from 'react'
import { Formx, Modalx, Tablex, SelectSearch } from '@/components'
import { Form, Input } from 'antd'
import produce from 'immer'
import vmgroupsApi from '@/services/template'
import { wrapResponse } from '@/utils/tool'
import {
  getColumns,
  apiMethod,
  searchOptions,
  vmFilterSorterTransform
} from '@/pages/Common/VmTableCfg'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex

const { createModalCfg } = Modalx
export default class MoveInModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  columnsArr = [...getColumns().slice(0, 4), ...getColumns().slice(5, 8)]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      // 筛选模板ID 不过滤池里面桌面
      // searchs: { templateId: this.props.templateId, neededPoolDesktop: 1 },
      apiMethod
    })
  }
  // 当搜索下拉来处理

  onSearchSelectChange = oldKey => {
    const searchs = { ...this.state.tableCfg.searchs }
    delete searchs[oldKey]
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...searchs
        }
      })
    )
  }

  onTableChange = (page, filter, sorter) => {
    const { searchs } = vmFilterSorterTransform(filter, sorter)
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  // 搜索
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
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  pop = groupId => {
    this.modal.show()
    this.modal.form.setFieldsValue({ groupId })
  }

  moveIn = values => {
    console.log('values :>> ', values, this.tablex.getSelection())
    vmgroupsApi
      .moveIn({ groupId: this.state.groupId, ...values })
      .then(res => {
        wrapResponse(res).then(() => {
          this.modal.afterSubmit(res)
        })
      })
      .catch(error => {
        this.modal.break(error)
        console.log(error)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '迁入虚拟机', width: '80%' })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.moveIn}
      >
        <Formx>
          <Form.Item prop="groupId" hidden>
            <Input placeholder="桌面组名"></Input>
          </Form.Item>
          <TableWrap>
            <ToolBar>
              <BarLeft>
                <SelectSearch
                  options={searchOptions}
                  onSelectChange={this.onSearchSelectChange}
                  onSearch={this.search}
                ></SelectSearch>
              </BarLeft>
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.tablex = ref
              }}
              tableCfg={this.state.tableCfg}
              onChange={this.onTableChange}
            />
          </TableWrap>
        </Formx>
      </Modalx>
    )
  }
}
