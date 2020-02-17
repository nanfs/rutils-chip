import React from 'react'
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from 'bizcharts'
import DataSet from '@antv/data-set'

const { DataView } = DataSet
const { Html } = Guide

const data = [
  {
    name: '正在使用',
    count: 100,
    sum: 800
  },
  {
    name: '已分配',
    count: 300,
    sum: 800
  }
]

/* const ds = new DataSet()
const dv = ds
  .createView()
  .source(data)
  .transform({
    type: 'fold',
    field: ['isNum', 'notNum'],
    type: 'type', // key字段
    value: 'count', // value字段
    retains: ['name']
  })

console.log(dv) */
const cols = {
  count: {
    ticks: [0, 800]
  }
}

export default function WorkOvertimeChart(props) {
  const { lineChartData } = props

  return (
    <Chart
      height={220}
      width={550}
      data={data}
      scale={cols}
      padding={(0, 0, 0, 70)}
      forceFit={true}
      className="dashboard-chart dashboard-linechart"
    >
      <Axis name="name" tickLine={null} line={null} />
      <Axis name="count" visible={false} />
      <Axis name="sum" visible={false} />
      <Coord transpose />
      {/*  <Tooltip
        crosshairs={{
          type: 'y'
        }}
      /> */}
      <Geom type="interval" position="name*sum" color="#eef0f5">
        <Label
          content="count"
          htmlTemplate={(text, item, index) => {
            // text 为每条记录 x 属性的值
            // item 为映射后的每条数据记录，是一个对象，可以从里面获取你想要的数据信息
            // index 为每条记录的索引
            let color = '#1bce88'
            if (index === 1) {
              color = '#1c69b6'
            } else if (index === 2) {
              color = '#ce6463'
            }
            // 自定义 html 模板
            return `<span style="display: block;margin-top: -40px;font-size:20px;font-weight: 500;color:${color}">${text}</span>`
          }}
        />
      </Geom>
      <Geom
        type="interval"
        position="name*count"
        color={['name', ['#1bce88', '#1c69b6', '#ce6463']]}
      ></Geom>
    </Chart>
  )
}
