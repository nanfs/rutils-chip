import React from 'react'
import { Table, Input, Form, Icon } from 'antd'
import '../index.less'

const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  state = {
    editing: false
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  save = e => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values })
    })
  }

  renderCell = form => {
    this.form = form
    const { children, dataIndex, record, title } = this.props
    const { editing } = this.state
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title}不能为空`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={node => {
              this.input = node
            }}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    )
  }

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    )
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [
      {
        dataIndex: 'nameStatus',
        render: (text, record) => {
          return text ? (
            <Icon
              type="warning"
              style={{ color: '#faad14', fontSize: '24px' }}
              title="名称在环境中已被使用，创建一个新名称"
            ></Icon>
          ) : null
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        editable: true
      },
      {
        title: '内存',
        dataIndex: 'storage'
      },
      {
        title: 'CPU',
        dataIndex: 'cpu'
      }
    ]
    this.state = {
      dataSource: this.props.dataSource
    }
  }

  handleSave = row => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => row.rowKey === item.rowKey)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    this.setState({ dataSource: newData })
    this.props.onChange(newData)
  }

  render() {
    const { dataSource } = this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      }
    })
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="id"
        />
      </div>
    )
  }
}
