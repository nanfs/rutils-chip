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
/* Shape.registerShape('interval', 'top', {
  draw(cfg, container) {
    *
     * 柱状图由四个点连线而成
     * points[1] --- points[2]
     *    |              |
     * points[0] --- points[3]
    
    const { points } = cfg
    let path = []
    path.push(['M', points[0].x, points[0].y])
    path.push(['L', points[1].x, points[1].y])
    path.push(['L', points[2].x, points[2].y])
    path.push(['L', points[3].x, points[3].y])
    path.push('Z')
    path = this.parsePath(path) // 将 0 - 1 转化为画布坐标
    return container.addShape('rect', {
      attrs: {
        x: path[1][1], // 矩形起始点为左上角
        y: path[1][2],
        width: path[2][1] - path[1][1],
        height: path[0][2] - path[1][2],
        fill: cfg.color,
        radius: (path[2][1] - path[1][1]) / 2
      }
    })
  }
}) */

export default class LineChart extends React.Component {
  render() {
    const { lineChartData, dataSum } = this.props
    const { DataView } = DataSet
    const { Html } = Guide

    const cols = {
      count: {
        ticks: [0, dataSum]
      }
    }

    return (
      <Chart
        height={150}
        width={550}
        data={lineChartData}
        scale={cols}
        padding={[45, 0, 0, 100]}
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
        <Geom
          type="interval"
          position="name*sum"
          color="#eef0f5"
          size={20}
          shape="top"
        >
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
          size={20}
          color={['name', ['#1bce88', '#1c69b6', '#ce6463']]}
        ></Geom>
      </Chart>
    )
  }
}
