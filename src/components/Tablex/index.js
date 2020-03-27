import React from 'react'
import { Table, Pagination, Button, message, Menu, Select, Icon } from 'antd'
import { wrapResponse } from '@/utils/tool'
import './index.less'
import TableWrap, { BarLeft, BarRight, ToolBar } from './TableWrap'

const { Option } = Select
// TODO 页码渲染问题
const tableCfg_init = {
  data: [],
  columns: undefined,
  loading: true,
  noDataText: undefined,
  // 必填，定义获取表格数据接口
  apiMethod: undefined,
  renderMethod: undefined,
  // 选填，表格中rowKey定义，默认为id
  rowKey: 'id',
  // 选填，设置表格数据请求参数
  searchs: {},

  // 选填，设置表格是否可选择，默认可选
  hasRowSelection: true,
  // 选填，设置表格选择，一般为空数组
  selection: [],
  // 是否显示页码 默认显示
  hasPaging: true,
  // 自动刷新时间选项 以\秒\为单位
  replaceTimeOptions: ['5', '10', '20'],
  pageSizeOptions: ['10', '20', '30', '50', '100'],
  // 选填，在请求发送前，处理请求参数方法，return 处理后的请求数据对象
  handleRequestMethod: undefined,
  expandedRowRender: undefined
}

export function createTableCfg(myCfg) {
  return { ...tableCfg_init, ...myCfg }
}
// tablex 中加载状态 。searchs  selection 都有外部维护
class Tablex extends React.Component {
  constructor(props) {
    super(props)
    this.timer = null
    const { paging, selection = [] } = this.props.tableCfg
    this.state = {
      loading: false,
      replaceTime: '5', //  如果有刷新 默认5s刷新
      selection,
      selectData: [], // 可能会出现不同步到情况
      paging: {
        size: (paging && paging.size) || 10,
        current: 1,
        total: 1
      }
    }
  }

  componentDidMount() {
    clearInterval(this.timer)
    if (this.props.autoReplace) {
      this.timer = setInterval(() => {
        !this.props.breakReplace && this.replace(this.props.tableCfg)
      }, this.state.replaceTime * 1000)
    }
    this.props.onRef && this.props.onRef(this)
    !this.props.stopAutoFetch && this.refresh({ ...this.props.tableCfg })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(this.props.tableCfg) !== JSON.stringify(prevProps.tableCfg)
    ) {
      const { selection } = this.props.tableCfg
      this.setState({ selection })
    }
  }

  beforeLoad = (tableCfg, showLoading = true) => {
    return new Promise(resolve => {
      if (showLoading) {
        !this.props.saveSelection && this.onSelectChange([], [])
        this.setState({
          loading: true
        })
      }
      let requestData = {}

      if (tableCfg.hasPaging) {
        const { size, current } = this.state.paging
        requestData = { ...requestData, size, current }
      }
      if (tableCfg.searchs) {
        for (const key in tableCfg.searchs) {
          if (tableCfg.searchs[key]) requestData[key] = tableCfg.searchs[key]
        }

        if (
          tableCfg.handleRequestMethod &&
          typeof tableCfg.handleRequestMethod === 'function'
        ) {
          requestData = tableCfg.handleRequestMethod(requestData)
        }
      }

      resolve(requestData)
    })
  }

  loadData = (tableCfg, showLoading = true) => {
    return new Promise(resolve => {
      this.beforeLoad(tableCfg, showLoading).then(requestData => {
        tableCfg
          .apiMethod(requestData)
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            this.setState({
              loading: false
            })
            message.error(error.message || error)
          })
      })
    })
  }

  afterLoad = (tableCfg, res) => {
    return new Promise(resolve => {
      wrapResponse(res)
        .then(() => {
          // 页码超出 显示最大
          if (res.data.current > res.data.pages && res.data.pages) {
            const { size } = this.state.paging
            return this.pageChange(res.data.pages, size)
          }
          this.setState({
            loading: false,
            data: res.data.data
              ? res.data.data.records || []
              : res.data.records || [],
            paging: {
              ...this.state.paging,
              total: res.data.data ? res.data.data.total : res.data.total
            }
          })
          this.props.afterLoad && this.props.afterLoad()
          resolve(res)
        })
        .catch(() => {
          this.setState({
            loading: false,
            data: []
          })
        })
    })
  }

  // 重置选择 和页码
  search = tableCfg => {
    return new Promise(resolve => {
      this.loadData(tableCfg).then(res => {
        this.afterLoad(tableCfg, res).then(() => resolve(res))
      })
    })
  }

  // 重置选择 保留页码
  refresh = tableCfg => {
    return new Promise(resolve => {
      this.loadData(tableCfg).then(res => {
        this.afterLoad(tableCfg, res).then(() => resolve(res))
      })
    })
  }

  // 保留选择 和页码 不显示刷新动画
  replace = tableCfg => {
    return new Promise(resolve => {
      this.loadData(tableCfg, false).then(res => {
        this.afterLoad(tableCfg, res).then(() => resolve(res))
      })
    })
  }

  getSelection = () => {
    return this.state.selection
  }

  getSelectData = () => {
    return this.state.selects
  }

  clearSelection = () => {
    this.setState({
      selection: [],
      selects: []
    })
  }

  getData = () => {
    return this.state.data
  }

  onSelectChange = (selectKeys, selects) => {
    const { onSelectChange } = this.props
    this.setState({
      selection: selectKeys,
      selects
    })
    onSelectChange && onSelectChange(selectKeys, selects)
  }

  showTotal = () => {
    const { total, size } = this.state.paging
    const totalPage =
      total % size === 0
        ? Math.floor(total / size)
        : Math.floor(total / size) + 1
    return `共 ${totalPage} 页 / ${total} 条记录`
  }

  pageChange = (page, size) => {
    this.setState(
      {
        paging: {
          total: 1,
          current: page,
          size
        }
      },
      () => this.refresh(this.props.tableCfg)
    )
  }

  sizeChange = (current, size) => {
    this.setState(
      {
        paging: {
          total: 1,
          current: 1,
          size
        }
      },
      () => this.refresh(this.props.tableCfg)
    )
  }

  setRepalceTime = value => {
    this.setState({
      replaceTime: value
    })
  }

  renderReplaceTime = () => {
    const { replaceTimeOptions } = this.props.tableCfg
    return replaceTimeOptions.map(item => (
      <Option key={item} value={item}>{`${item}s`}</Option>
    ))
  }

  render() {
    const { loading, data, selection, paging } = this.state
    const {
      columns,
      rowKey,
      expandedRowRender,
      pageSizeOptions,
      hasRowSelection,
      scroll
    } = this.props.tableCfg
    const { total, size, current } = paging
    const rowSelection = {
      selectedRowKeys: selection,
      onChange: this.onSelectChange
    }
    const { onChange } = this.props
    return (
      <React.Fragment>
        <Table
          className={this.props.className}
          rowSelection={hasRowSelection ? rowSelection : null}
          columns={columns}
          dataSource={data}
          rowKey={rowKey}
          loading={loading}
          pagination={false}
          scroll={scroll}
          expandedRowRender={expandedRowRender}
          onRow={this.props.onRow}
          onChange={onChange}
        />
        <div className="pagination-wrapper">
          <Button
            className="replace-button"
            icon="sync"
            onClick={() => this.refresh(this.props.tableCfg)}
          />
          {this.props.autoReplace && (
            <Select
              size="small"
              className="replace-select"
              value={this.state?.replaceTime}
              onChange={this.setRepalceTime}
            >
              {this.renderReplaceTime()}
            </Select>
          )}
          <Pagination
            size="small"
            total={total || 1} // 最小显示1
            pageSize={size}
            current={current}
            onChange={this.pageChange}
            onShowSizeChange={this.sizeChange}
            showTotal={this.showTotal}
            pageSizeOptions={pageSizeOptions}
            showSizeChanger
          />
        </div>
      </React.Fragment>
    )
  }
}
Tablex.createTableCfg = createTableCfg
Tablex.TableWrap = TableWrap
Tablex.ToolBar = ToolBar
Tablex.BarLeft = BarLeft
Tablex.BarRight = BarRight
// export { TableWrap, ToolBar, BarLeft, BarRight }
export default Tablex
