import React from 'react'
import InnerPath from '@/components/InnerPath'
import TableCompute from './chip/TableCompute'
import TableSave from './chip/TableSave'
import styles from './index.m.scss'

export default class Resource extends React.Component {
  state = {
    innerPath: undefined
  }

  render() {
    return (
      <React.Fragment>
        <InnerPath location="资源概览" inner={this.state.inner} />
        <TableCompute></TableCompute>
        <TableSave></TableSave>
      </React.Fragment>
    )
  }
}
