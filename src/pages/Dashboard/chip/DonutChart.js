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

export default class DonutChart extends React.Component {
  render() {
    const { DonutChartData, guideTitle, dataSum } = this.props
    const { DataView } = DataSet
    const { Html } = Guide

    const dv = new DataView()
    dv.source(DonutChartData).transform({
      type: 'percent',
      field: 'count',
      dimension: 'name',
      as: 'percent'
    })
    const cols = {
      percent: {
        formatter: val => {
          // val = `${val * 100}%`
          return val
        }
      }
    }
    return (
      <div>
        <Chart
          height={190}
          width={450}
          data={dv}
          scale={cols}
          padding={[0, 100, 0, 0]}
          forceFit={true}
          className="dashboard-chart dashboard-donutchart"
        >
          <Coord type={'theta'} radius={0.9} innerRadius={0.8} />
          <Axis name="count" />
          <Legend
            position="right-center"
            offsetX={-10}
            offsetY={10}
            clickable={false}
            textStyle={{
              fill: '#404040', // 文本的颜色
              fontSize: '14' // 文本大小
              // fontWeight: 'bold', // 文本粗细
            }}
            marker="circle"
            itemFormatter={val => {
              let count = 0
              DonutChartData.forEach(item => {
                if (item.name === val) count = item.count
              })
              return `${val}    ${count}` // val 为每个图例项的文本值
            }}
          />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Guide>
            <Html
              position={['50%', '50%']}
              html={`<div style="color:#525252;font-size:1.3em;text-align: center;width: 10em;">${guideTitle}<br><span style="color:#285384;font-size:2em;font-style:italic;font-weight:500">${dataSum}</span></div>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          <Geom
            type="intervalStack"
            position="count"
            color={['name', ['#295385', '#cf6363']]}
            tooltip={[
              'name*count',
              (name, count) => {
                // percent = `${percent * 100}%`
                return {
                  name,
                  value: count
                }
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff'
            }}
          >
            {/* <Label
              content="percent"
              formatter={(val, name) => {
                return `${name.point.name}: ${val}`
              }}
            /> */}
          </Geom>
        </Chart>
      </div>
    )
  }
}
