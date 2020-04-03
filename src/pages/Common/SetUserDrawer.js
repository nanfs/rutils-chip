import React from 'react'
import {
  Drawerx,
  Formx,
  SelectSearch,
  Title,
  Diliver,
  Tablex
} from '@/components'
import { columns, apiMethod } from '@/pages/Common/UserTableCfg'
import { Tag, message } from 'antd'
import desktopsApi from '@/services/desktops'
import produce from 'immer'

const { createTableCfg, TableWrap, ToolBar } = Tablex
// 是否翻页保存数据
export default class SetUserDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    totalSelection: [],
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      selection: [],
      searchs: { domain: 'internal' },
      pageSizeOptions: ['5', '10', '20', '50']
    })
  }

  onSelectChange = selection => {
    console.log('newSelection', selection)
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
    return totalSelection.map(item => {
      const [, username, , , , domain] = item.split('&')
      const domainFix = domain === 'internal-authz' ? '本地组' : domain
      return (
        <Tag key={item} closable onClose={() => this.removeUserSelection(item)}>
          {`${username}@${domainFix}`}
        </Tag>
      )
    })
  }

  pop = ids => {
    // 如果是一个 获取当前分配的用户
    this.drawer.show()
    this.setState({
      ids,
      totalSelection: [],
      tableCfg: createTableCfg({
        columns,
        apiMethod,
        paging: { size: 10 },
        selection: [],
        rowKey: record =>
          `${record.uuid}&${record.username}&${record.firstname}&${record.lastname}&${record.groupname}&${record.domain}`,
        searchs: { domain: 'internal' },
        pageSizeOptions: ['5', '10', '20', '50']
      })
    })
    if (ids && ids.length === 1) {
      desktopsApi
        .detail(ids[0])
        .then(res => {
          const { owner } = res.data
          const totalSelection = owner.map(
            item =>
              `${item.uuid}&${item.username}&${item.firstname}&${item.lastname}&${item.department}&${item.domain}`
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
          message.error(error.message || error)
          console.log(error)
        })
    } else {
      this.userTablex.refresh(this.state.tableCfg)
    }
  }

  setUser = () => {
    const { ids, totalSelection } = this.state
    const users = totalSelection.map(item => {
      const [
        uuid,
        username,
        firstname,
        lastname,
        groupname,
        domain
      ] = item.split('&')
      return {
        uuid,
        username,
        firstname: firstname !== 'null' ? firstname : '',
        lastname: lastname !== 'null' ? lastname : '',
        department: groupname,
        domain
      }
    })

    desktopsApi
      .setUser({ ids, users })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(error => {
        this.drawer.break(error)
        console.log(error)
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
        onClose={this.props.onClose}
        onOk={this.setUser}
        onSuccess={this.props.onSuccess}
      >
        <Formx className="pt15">
          <TableWrap>
            <ToolBar>
              <SelectSearch
                options={searchOptions}
                onSelectChange={this.onSearchSelectChange}
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
