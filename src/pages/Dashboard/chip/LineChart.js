import React from 'react'
import { Chart, Geom, Axis, Coord, Label, Shape } from 'bizcharts'
/**
 * @memberof LineChart
 * @description 柱状图圆角 在<Geom>中配置shape属性
 */
Shape.registerShape('interval', 'topRadius', {
  draw(cfg, container) {
    /*  *
     * 柱状图由四个点连线而成
     * points[1] --- points[2]
     *    |              |
     * points[0] --- points[3]
     */
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
        x: path[0][1],
        y: path[2][2],
        width: path[1][1] - path[0][1],
        height: 16,
        fill:
          cfg.origin._origin.count === 0 && cfg.color !== '#eef0f5'
            ? '#fff'
            : cfg.color,
        radius: 7
      }
    })
  }
})

export default class LineChart extends React.Component {
  /**
   * @returns
   * @memberof LineChart
   * @description 父组件传入的lineChartData格式为{name: 'aa', count: '100', sum:'200'}
   */
  render() {
    const { lineChartData, dataSum } = this.props
    const cols = {
      count: {
        ticks: [0, dataSum + parseInt(dataSum / 10, 10)]
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
        <Geom
          type="interval"
          position="name*sum"
          color="#eef0f5"
          size={16}
          shape="topRadius"
        >
          <Label
            content="count"
            htmlTemplate={(text, item, index) => {
              // text 为每条记录 x 属性的值
              // item 为映射后的每条数据记录，是一个对象，可以从里面获取你想要的数据信息
              // index 为每条记录的索引
              let color = '#1c68b6'
              if (index === 1) {
                color = '#1ccd87'
              } else if (index === 2) {
                color = '#cf6363'
              }
              // 自定义 html 模板
              return `<span style="display: block;margin-top: -40px;font-size:20px;font-weight: 500;color:${color}">${text}</span>`
            }}
          />
        </Geom>
        <Geom
          type="interval"
          position="name*count"
          size={16}
          color={['name', ['#1c68b6', '#1ccd87', '#cf6363']]}
          shape="topRadius"
        ></Geom>
      </Chart>
    )
  }
}
