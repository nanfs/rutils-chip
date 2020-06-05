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

const cols = {
  onlinetimesum: {
    min: 0
  },
  datetime: {
    range: [0, 1]
  }
}

export default function DetailUseStatisticsChart(props) {
  const { dataSource } = props
  return (
    <Chart
      height={250}
      /* width={260} */ data={dataSource}
      scale={cols}
      forceFit
      padding="auto"
    >
      <Axis name="datetime" />
      <Axis name="onlinetimesum" />
      <Tooltip
        crosshairs={{
          type: 'y'
        }}
      />
      <Geom type="line" position="datetime*onlinetimesum" shape={'smooth'} />
      <Geom
        type="point"
        position="datetime*onlinetimesum"
        size={4}
        shape={'circle'}
        style={{
          stroke: '#fff',
          lineWidth: 1
        }}
      />
    </Chart>
  )
}
