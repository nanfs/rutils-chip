/* eslint-disable no-nested-ternary */
import React from 'react'
import { Table, Pagination, Button, message, Select } from 'antd'
import { Resizable } from 'react-resizable'
import { wrapResponse } from '@/utils/tool'
import './index.less'
import TableWrap, { BarLeft, BarRight, ToolBar } from './TableWrap'

const { Option } = Select
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
  locale: { filterReset: '清空' },
  // 选填，设置表格是否可选择，默认可选
  hasRowSelection: true,
  // 选填，设置表格选择，一般为空数组
  selection: [],
  // 是否显示页码 默认显示
  hasPaging: true,
  // 自动刷新时间选项 以\秒\为单位
  replaceTimeOptions: ['5', '10', '20'],
  pageSizeOptions: ['5', '10', '20', '50'],
  // 选填, 是否自动请求表格数据
  autoFetch: true,
  // 选填，在请求发送前，处理请求参数方法，return 处理后的请求数据对象
  handleRequestMethod: undefined,
  // 选填, 扩展行显示
  expandedRowRender: undefined,
  // 选填, 是否自动刷新
  autoReplace: false,
  // 选填, 每次自动刷新结束后执行的函数
  autoCallback: undefined,
  // 选填, 缓存所选
  keepSelection: false,
  // 选填, 表格是否可以Resize
  isResize: false
}

export function createTableCfg(myCfg) {
  return { ...tableCfg_init, ...myCfg }
}
// 可以拖动Resize
const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props
  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation()
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  )
}
// tablex 中加载状态 。searchs  selection 都有外部维护
class Tablex extends React.Component {
  constructor(props) {
    super(props)
    this.timer = null
    const { paging, columns, selection = [] } = this.props.tableCfg
    this.state = {
      loading: false,
      replaceTime: '5', //  如果有刷新 默认5s刷新
      selection,
      selectData: [], // 可能会出现不同步到情况
      columns,
      columnsWidth: {},
      paging: {
        size: (paging && paging.size) || 10,
        current: 1,
        total: 0 // 默认0
      }
    }
  }

  // 头部标题拖动
  components = {
    header: {
      cell: ResizableTitle
    }
  }

  // 头部标题拖动 处理保存
  // 不能超过最大宽度
  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns]
      const { columnsWidth } = this.state
      const { maxWidth, minWidth } = columns[index]
      const width =
        size.width < minWidth
          ? minWidth
          : size.width > maxWidth
          ? maxWidth
          : size.width
      nextColumns[index] = {
        ...nextColumns[index],
        width
      }
      // 保存对应栏目的宽度
      columnsWidth[columns[index].dataIndex] = width
      this.setState({ columnsWidth })
      return { columns: nextColumns }
    })
  }

  autoLoopReplace = () => {
    return setInterval(() => {
      // 如果手动暂停 或者正在请求 则不发送请求
      if (!this.props.breakReplace && !this.state.loading) {
        const { autoCallback } = this.props.tableCfg
        this.reload(this.props.tableCfg).then(() => {
          autoCallback &&
            autoCallback(this.getSelection(), this.getSelectData())
        })
      }
    }, this.state.replaceTime * 1000)
  }

  componentDidMount() {
    clearInterval(this.timer)
    const { autoReplace, autoFetch } = this.props.tableCfg
    if (autoReplace) {
      this.timer = this.autoLoopReplace()
    }
    this.props.onRef && this.props.onRef(this)
    autoFetch && this.refresh({ ...this.props.tableCfg })
    // 给columns 添加minwidth 默认最大宽度500
    const { columns } = this.state
    const addMinCol = columns.map(item => ({
      ...item,
      minWidth: item.width ? item.minWidth || item.width : undefined,
      maxWidth: item.maxWidth || 500
    }))
    this.setState({ columns: addMinCol })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(this.props.tableCfg) !== JSON.stringify(prevProps.tableCfg)
    ) {
      const { columnsWidth } = this.state
      const { selection, columns } = this.props.tableCfg
      const styleColumns = columns.map(item => ({
        ...item,
        width: columnsWidth[item.dataIndex] || item.width
      }))
      this.setState({ selection, columns: styleColumns })
    }
  }

  beforeLoad = (tableCfg, showLoading = true) => {
    return new Promise(resolve => {
      if (showLoading) {
        !this.props.tableCfg.keepSelection && this.onSelectChange([], [])
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
      this.setState({ paging: { ...this.state.paging, current: 1 } }, () =>
        this.loadData(tableCfg).then(res => {
          this.afterLoad(tableCfg, res).then(() => resolve(res))
        })
      )
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

  // 保留选择 和页码 不显示刷新动画 添加getType搜索字段 用于排除后端session刷新
  reload = tableCfg => {
    const reloadTableCfg = {
      ...tableCfg,
      searchs: { ...tableCfg.searchs, getType: 'reload' }
    }
    return new Promise(resolve => {
      this.loadData(reloadTableCfg, false).then(res => {
        this.afterLoad(reloadTableCfg, res).then(() => resolve(res))
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

  // 获取选择的
  getSelection = () => {
    return this.state.selection
  }

  // 获取选择的数据 如果有自动刷新表格 取数据过滤
  getSelectData = () => {
    const { autoReplace, rowKey } = this.props.tableCfg
    if (autoReplace) {
      const data = this.getData()
      const selectedRowKeys = this.getSelection()
      return data.filter(item => selectedRowKeys.includes(item[rowKey]))
    }
    return this.state.selectData
  }

  clearSelection = () => {
    this.setState({
      selection: [],
      selectData: []
    })
  }

  getData = () => {
    return this.state.data
  }

  onSelectChange = (selectKeys, selectData) => {
    const { onSelectChange } = this.props
    this.setState({
      selection: selectKeys,
      selectData
    })
    onSelectChange && onSelectChange(selectKeys, selectData)
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
          total: this.state?.paging?.total || 1,
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
          total: this.state?.paging?.total || 1,
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
    clearInterval(this.timer)
    setTimeout(() => {
      this.timer = this.autoLoopReplace()
    }, value)
  }

  renderReplaceTime = () => {
    const { replaceTimeOptions } = this.props.tableCfg
    return replaceTimeOptions.map(item => (
      <Option key={item} value={item}>{`${item}s`}</Option>
    ))
  }

  render() {
    const { loading, data, selection, paging, columns, isResize } = this.state
    const {
      rowKey,
      expandedRowRender,
      pageSizeOptions,
      hasRowSelection,
      scroll,
      locale,
      autoReplace
    } = this.props.tableCfg
    const { total, size, current } = paging
    const rowSelection = {
      selectedRowKeys: selection,
      onChange: this.onSelectChange,
      getCheckboxProps: () => ({
        disabled: this.props.disabled
      })
    }
    const { onChange } = this.props
    const columnsResize = columns.map((col, index) => {
      // 如果columns里面有resize 则表格可以resize
      if (!this.state.isResize && col.resize) {
        this.setState({ isResize: true })
      }
      return {
        ...col,
        minWidth: col.width,
        onHeaderCell: !col.resize
          ? undefined
          : column => ({
              width: column.width,
              onResize: this.handleResize(index)
            })
      }
    })
    return (
      <React.Fragment>
        <Table
          className={this.props.className}
          rowSelection={hasRowSelection ? rowSelection : null}
          columns={isResize ? columnsResize : columns}
          components={isResize ? this.components : undefined}
          dataSource={data}
          rowKey={rowKey}
          loading={loading}
          pagination={false}
          scroll={scroll}
          locale={locale}
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
          {autoReplace && (
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
