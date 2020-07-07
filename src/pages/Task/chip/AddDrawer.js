import React from 'react'
import { Form, Input, TimePicker, Tag, Alert } from 'antd'
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
import { required, nameReg, textRange } from '@/utils/valid'
import { week2num } from '@/utils/tool'
import {
  taskTypeOptions,
  typeOptions2,
  weekEnOptions
} from '@/utils/formOptions'
import { columns, apiMethod } from './TargetTableCfg'
import produce from 'immer'
import '../index.less'
import dayjs from 'dayjs'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { TextArea } = Input

export default class AddDrawer extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      rowKey: 'id',
      keepSelection: true
    }),
    totalSelection: []
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   * @memberof AddDrawer
   * @description 打开任务创建抽屉
   */
  pop = () => {
    this.drawer.show()
    this.drawer.form.setFieldsValue({ way: 1, taskType: 0 })
    this.setState(
      {
        totalSelection: [],
        tableCfg: createTableCfg({
          columns,
          apiMethod,
          paging: { size: 10 },
          selection: [],
          keepSelection: true,
          rowKey: record => `${record.id}&${record.name}`,
          pageSizeOptions: ['5', '10', '20', '50']
        })
      },
      () => this.addTargetTablex.refresh(this.state.tableCfg)
    )
  }

  onTypeChange = () => {
    this.forceUpdate()
  }

  /**
   * 当搜索条件下来处理
   *
   * @memberof Task
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
   *
   *
   * @memberof Task
   * 搜索条件触发
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
      () => this.addTargetTablex.search(this.state.tableCfg)
    )
  }

  /**
   *
   *
   * @memberof Task
   * 筛选条件触发
   */
  onTableChange = (page, filter, sorter) => {
    const { clusterName, datacenterName } = filter
    this.setState(
      produce(draft => {
        draft.tableCfg = {
          ...draft.tableCfg,
          searchs: {
            ...draft.tableCfg.searchs,
            clusters: clusterName,
            datacenters: datacenterName
          }
        }
      }),
      () => this.addTargetTablex.search(this.state.tableCfg)
    )
  }

  /**
   * @memberof Task
   * 执行方式改变时获取对应的值
   */
  getSelectType = () => {
    return this.drawer?.form?.getFieldValue('way')
  }

  /**
   * @memberof Task
   * 获取勾选的数据
   */
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

  /**
   * @memberof Task
   * @description 移除已选项tag，同时去除表格对应勾选项
   */
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
      () => this.addTargetTablex.replace(this.state.tableCfg)
    )
  }

  /**
   * @memberof Task
   * @description 渲染已选项tag
   */
  renderSelectTarget = () => {
    const { totalSelection } = this.state

    return totalSelection.map(item => {
      const [, name] = item.split('&')
      return (
        <Tag
          className="tag-wdith200"
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

  /**
   * @memberof Task
   * @description 提交新建计划任务
   */
  addTask = values => {
    const { name, taskType, way, weeks, time, description } = values
    const { totalSelection } = this.state
    let cron = ''
    const timeStrArr = dayjs(time)
      .format('HH:mm')
      .split(':')
    const weeksStr = weeks
      ? weeks
          .sort((a, b) => {
            return week2num(a) - week2num(b)
          })
          .join(',')
      : ''
    if (way === 0) {
      cron = `0 ${timeStrArr[1]} ${timeStrArr[0]} ? * ${weeksStr}`
    } else {
      cron = `0 ${timeStrArr[1]} ${timeStrArr[0]} * * ?`
    }
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
      .addTask(data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  render() {
    const searchOptions = [{ label: '桌面名称', value: 'name' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.addTask(values)
          return false
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          {/* <Alert
            message="计划任务为控制指定桌面集合在一定时间段内执行开机、关机、重启等操作的自动任务配置。支持按周 按天配置特定时间段执行策略。"
            type="info"
            showIcon
          /> */}
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="name"
            label="任务名称"
            required
            rules={[required, nameReg, textRange(0, 63)]}
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
          <Form.Item prop="way" required label="执行方式" rules={[required]}>
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
            <Selectx options={weekEnOptions} mode="multiple" />
          </Form.Item>
          <Form.Item
            required
            prop="time"
            label="执行时间"
            className="time-wrap"
            rules={[required]}
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
                  options={searchOptions}
                  onSelectChange={this.onSearchSelectChange}
                  onSearch={this.search}
                ></SelectSearch>
              </BarLeft>
            </ToolBar>
            <Tablex
              onRef={ref => {
                this.addTargetTablex = ref
              }}
              tableCfg={this.state.tableCfg}
              onChange={this.onTableChange}
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
