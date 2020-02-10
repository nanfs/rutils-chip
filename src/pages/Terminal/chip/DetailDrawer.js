import React from 'react'
import { Row, Col } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'


export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  render() {
    // const { getFieldDecorator } = this.props.form
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        
          
      </Drawerx>
    )
  }
}
