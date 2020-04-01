import React from 'react'
import { columns, apiMethod } from '@/pages/Common/UserTableCfg'
import { Tag, message } from 'antd'
import terminalApi from '@/services/terminal'
import produce from 'immer'
import {
  Tablex,
  SelectSearch,
  Formx,
  Drawerx,
  Title,
  Diliver
} from '@/components'

// 是否翻页保存数据
const { createTableCfg, TableWrap, ToolBar } = Tablex
export default class SetUserDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    totalSelection: [],
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 10 },
      rowKey: record =>
        `${record.uuid}&${record.username}&${record.firstname}&${record.lastname}&${record.groupname}`,
      searchs: { domain: 'internal' },
      pageSizeOptions: ['5', '10', '20', '50']
    })
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

  removeUserSelection = key => {
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
      () => this.userTablex.replace(this.state.tableCfg)
    )
  }

  renderSelectUser = () => {
    const { totalSelection } = this.state
    return totalSelection.map(item => (
      <Tag key={item} closable onClose={() => this.removeUserSelection(item)}>
        {item && item.split('&')[1]}
      </Tag>
    ))
  }

  pop = sns => {
    // 如果是一个 获取当前分配的用户
    this.drawer.show()
    this.setState({
      sns,
      totalSelection: [],
      tableCfg: createTableCfg({
        columns,
        apiMethod,
        paging: { size: 10 },
        rowKey: record =>
          `${record.uuid}&${record.username}&${record.firstname}&${record.lastname}&${record.groupname}`,
        searchs: { domain: 'internal' },
        pageSizeOptions: ['5', '10', '20', '50']
      })
    })
    if (sns && sns.length === 1) {
      terminalApi
        .detail(sns[0])
        .then(res => {
          const { users } = res.data
          const totalSelection = users.map(
            item =>
              `${item.uuid}&${item.username}&${item.firstname}&${item.lastname}&${item.department}`
          )
          this.setState(
            produce(draft => {
              draft.totalSelection = totalSelection
              draft.tableCfg = {
                ...draft.tableCfg,
                selection: totalSelection
              }
            }),
            () => this.userTablex.replace(this.state.tableCfg)
          )
        })
        .catch(error => {
          console.log(error)
          message.error(error.message || error)
        })
    } else {
      this.userTablex.refresh(this.state.tableCfg)
    }
  }

  setUser = () => {
    const { sns, totalSelection } = this.state
    const users = totalSelection.map(item => {
      const [uuid, username, firstname, lastname, groupname] = item.split('&')
      return {
        uuid,
        username,
        firstname: firstname !== 'null' ? firstname : undefined,
        lastname: lastname !== 'null' ? lastname : undefined,
        department: groupname,
        domain: 'internal-authz'
      }
    })

    terminalApi
      .setUser({ sns, users })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
      })
  }

  search = (domain, username) => {
    const searchs = {}
    searchs.domain = domain
    searchs.username = username

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
    const searchOptions = JSON.parse(sessionStorage.getItem('domains'))
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.onClose}
        onOk={this.setUser}
        onSuccess={this.props.onSuccess}
      >
        <Formx className="p25">
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
              stopAutoFetch={true}
              saveSelection={true}
              tableCfg={this.state.tableCfg}
              onSelectChange={this.onSelectChange}
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
