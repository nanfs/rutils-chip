import React from 'react'

import { InnerPath } from '@/components'
import TableCompute from './chip/TableCompute'
import TableSave from './chip/TableSave'
import Topology from './chip/Topology'

import './index.less'
import { Icon } from 'antd'

export default class Resource extends React.Component {
  state = {
    innerPath: undefined,
    viewType: true
  }

  viewChange() {
    const viewType = !this.state.viewType
    this.setState({ viewType })
  }

  render() {
    return (
      <React.Fragment>
        {/* <span
          onClick={() => this.viewChange()}
          style={{
            float: 'right',
            marginRight: 30,
            marginTop: 15,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Icon type="swap" style={{ color: '#1990ff' }} />
          切换视图
        </span> */}
        <InnerPath location="资源概览" inner={this.state.inner} />
        {this.state.viewType && (
          <div>
            <TableCompute></TableCompute>
            <TableSave></TableSave>
          </div>
        )}
        {!this.state.viewType && <Topology></Topology>}
      </React.Fragment>
    )
  }
}
