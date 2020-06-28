import React from 'react'
import {
  Formx,
  Modalx,
  Tablex,
  SelectSearch,
  Title,
  Diliver
} from '@/components'
import { Form, Input, Tag } from 'antd'
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
    totalSelection: [],
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      // 筛选模板ID 不过滤池里面桌面
      // searchs: { templateId: this.props.templateId, neededPoolDesktop: 1 },
      keepSelection: true,
      rowKey: record => `${record.id}&${record.name}`,
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

  removeVmSelection = key => {
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
      () => this.tablex.replace(this.state.tableCfg)
    )
  }

  pop = groupId => {
    this.modal.show()
    this.setState({
      totalSelection: [],
      tableCfg: createTableCfg({
        columns: this.columnsArr,
        keepSelection: true,
        rowKey: record => `${record.id}&${record.name}`,
        apiMethod
      })
    })
    this.modal.form.setFieldsValue({ groupId })
  }

  // 迁入虚拟机
  moveIn = values => {
    const ids = this.state.totalSelection.map(item => item.split('&')[0])
    vmgroupsApi
      .moveIn({ ids, ...values })
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

  // 渲染所选虚拟机
  renderSelectVm = () => {
    const { totalSelection } = this.state
    return totalSelection.map(vm => {
      const [, name] = vm.split('&')
      return (
        <Tag
          color="blue"
          key={vm}
          closable
          onClose={() => this.removeVmSelection(vm)}
          title={name}
        >
          {name}
        </Tag>
      )
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
              onSelectChange={this.onSelectChange}
            />
          </TableWrap>
          <Diliver />
          <Title slot="已选择"></Title>
          <div>{this.renderSelectVm()}</div>
        </Formx>
      </Modalx>
    )
  }
}
