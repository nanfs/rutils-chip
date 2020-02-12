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
    name: '已分配',
    type: '1',
    count: 40
  },
  /* {
    name: '未分配',
    type: '1',
    count: 21
  }, */
  {
    name: '正在使用',
    type: '2',
    count: 21
  }
  /* {
    name: '未使用',
    type: '2',
    count: 40
  } */
]
/* 
const ds = new DataSet()
const dv = ds
  .createView()
  .source(data)
  .transform({
    type: 'aggregate',
    field: ['count'],
    operations: ['sum'],
    groupBy: ['type'],
    as: 'sum'
  }) */

const cols = {
  count: {
    min: 0
  },
  date: {
    range: [0, 1]
  }
}

export default function WorkOvertimeChart(props) {
  const { lineChartData } = props

  return (
    <Chart
      height={180}
      width={550}
      data={data}
      scale={cols}
      padding={(30, 50, 30, 60)}
      className="dashboard-chart"
    >
      <Axis name="name" tickLine={null} line={null} />
      <Axis name="count" visible={false} />
      <Coord transpose />
      {/*  <Tooltip
        crosshairs={{
          type: 'y'
        }}
      /> */}
      <Geom
        type="interval"
        position="name*count"
        shape="rect"
        color={['name', ['#1bce88', '#1c69b6', '#ce6463']]}
      >
        <Label content={['name*count', (name, value) => value]} />
      </Geom>
    </Chart>
  )
}
