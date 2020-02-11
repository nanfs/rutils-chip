import React from 'react'
import Drawerx from '@/components/Drawerx'
import Title, { Diliver } from '@/components/Title'
import MyRadio from '@/components/MyRadio'

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  renderTemplate = () => {
    // axios获取数据
    const options = [
      { label: '模板一', value: '1' },
      { label: '模板二', value: '2' },
      { label: '模板三', value: '3' },
      { label: '模板四', value: '4' }
    ]
    return <MyRadio options={options} />
  }

  renderNetWork = () => {
    const options = [
      { label: '网络一', value: '1' },
      { label: '网络二', value: '2' },
      { label: '网络三', value: '3' },
      { label: '网络四', value: '4' }
    ]
    return <MyRadio options={options} />
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        <Title slot="基础设置"></Title>
      </Drawerx>
    )
  }
}
