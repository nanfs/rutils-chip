import React from 'react'
import { Form, Input, TimePicker, message, Tag } from 'antd'
import {
  Drawerx,
  Formx,
  Title,
  Radiox,
  Selectx,
  Tablex,
  SelectSearch
} from '@/components'
import taskApi from '@/services/task'
import { required, checkName, textRange } from '@/utils/valid'
import { taskTypeOptions, typeOptions2, weekOptions } from '@/utils/formOptions'
import { columns, apiMethod } from './TargetTableCfg'
import produce from 'immer'
import '../index.less'
import dayjs from 'dayjs'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { TextArea } = Input

export default class EditDrawer extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      rowKey: 'id',
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50'],
      searchs: {}
    }),
    totalSelection: []
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   * @memberof EditDrawer
   * @param data 选中行数据
   * @description 打开任务编辑抽屉，传入选中行数据回显表单
   */
  pop = data => {
    this.drawer.show()
    this.selectSearch.reset()
    const { id, name, taskType, cron, description } = data
    let time = ''
    let weeks = []
    let way
    if (cron) {
      const cronArr = cron.split(' ')
      time = dayjs(`${cronArr[2]}:${cronArr[1]}`, 'HH:mm')
      weeks =
        cronArr[cronArr.length - 1] === '?'
          ? []
          : cronArr[cronArr.length - 1].split(',')
      way = cronArr[3] === '?' ? 0 : 1
    }
    this.drawer.form.setFieldsValue({
      id,
      name,
      taskType,
      way,
      weeks,
      time,
      description
    })
    this.setState({
      totalSelection: [],
      tableCfg: createTableCfg({
        columns,
        apiMethod,
        paging: { size: 10 },
        selection: [],
        rowKey: record => `${record.id}&${record.name}`,
        pageSizeOptions: ['5', '10', '20', '50'],
        searchs: {}
      })
    })
    const taskId = id
    taskApi
      .detail({ id: taskId })
      .then(res => {
        const owner = res.data.records
        const totalSelection = owner.length
          ? owner.map(item => `${item.objectId}&${item.name}`)
          : []
        this.setState(
          produce(draft => {
            draft.totalSelection = totalSelection
            draft.tableCfg = {
              ...draft.tableCfg,
              selection: totalSelection
            }
          }),
          () => this.editTargetTablex.replace(this.state.tableCfg)
        )
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  onTypeChange = () => {
    this.forceUpdate()
  }

  /**
   * 当搜索条件下来处理
   *
   * @memberof Vmlog
   */
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

  /**
   * @memberof Task
   * @description 表格搜索
   */
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
      () => this.editTargetTablex.refresh(this.state.tableCfg)
    )
  }

  /**
   * @memberof Task
   * 执行方式改变时获取对应的值
   */
  getSelectType = () => {
    return this.drawer?.form?.getFieldValue('way')
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

  removeTargetSelection = key => {
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
      () => this.editTargetTablex.replace(this.state.tableCfg)
    )
  }

  renderSelectTarget = () => {
    const { totalSelection } = this.state

    return totalSelection.map(item => {
      const [, name] = item.split('&')
      return (
        <Tag
          color="blue"
          key={item}
          closable
          onClose={() => this.removeTargetSelection(item)}
        >
          {`${name}`}
        </Tag>
      )
    })
  }

  editTask = values => {
    const { id, name, taskType, way, weeks, time, description } = values
    let cron = ''
    const timeStrArr = dayjs(time)
      .format('HH:mm')
      .split(':')
    const weeksStr = weeks ? weeks.join(',') : ''
    if (way === 0) {
      cron = `0 ${timeStrArr[1]} ${timeStrArr[0]} ? * ${weeksStr}`
    } else {
      cron = `0 ${timeStrArr[1]} ${timeStrArr[0]} * * ?`
    }
    const { totalSelection } = this.state
    const taskObjects = totalSelection.map(item => {
      const [objectIds] = item.split('&')
      return { objectId: objectIds, objectType: 0 }
    })
    const data = {
      name,
      taskType,
      cron,
      taskObjects,
      description
    }
    taskApi
      .editTask(id, data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  render() {
    const searchOptions = [{ label: '集群', value: 'clusterName' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.editTask(values)
          return false
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            prop="name"
            label="任务名称"
            required
            rules={[required, checkName, textRange(0, 63)]}
          >
            <Input placeholder="任务名称" />
          </Form.Item>
          <Form.Item
            prop="taskType"
            label="任务类型"
            required
            rules={[required]}
          >
            <Radiox options={taskTypeOptions} />
          </Form.Item>
          <Form.Item prop="way" required label="执行方式">
            <Radiox options={typeOptions2} onChange={this.onTypeChange} />
          </Form.Item>
          <Form.Item
            required
            prop="weeks"
            label="执行周期"
            className="time-wrap"
            rules={this.getSelectType() === 0 ? [required] : undefined}
            hidden={this.getSelectType() === 1}
          >
            <Selectx options={weekOptions} mode="multiple" />
          </Form.Item>
          <Form.Item
            required
            prop="time"
            label="执行时间"
            className="time-wrap"
          >
            <TimePicker format={'HH:mm'} />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="描述" />
          </Form.Item>
          <Title slot="执行对象"></Title>
          <TableWrap>
            <ToolBar>
              <BarLeft>
                <SelectSearch
                  onRef={ref => {
                    this.selectSearch = ref
                  }}
                  options={searchOptions}
                  onSelectChange={this.onSearchSelectChange}
                  onSearch={this.search}
                ></SelectSearch>
              </BarLeft>
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.editTargetTablex = ref
              }}
              saveSelection={true}
              tableCfg={this.state.tableCfg}
              onSelectChange={this.onSelectChange}
            />
          </TableWrap>
          <Title slot="已选择"></Title>
          {this.renderSelectTarget()}
        </Formx>
      </Drawerx>
    )
  }
}
