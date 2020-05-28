import React from 'react'
import { Progress, Row, Col } from 'antd'

export default function DetailRender({ interfaces, disks }) {
  return (
    <div>
      <Row>
        <Col span={6}>网络名</Col>
      </Row>
      {interfaces.map((item, index) => (
        <Row key={index}>
          <Col span={6}>
            {item.name ? `${item.kind}/${item.name}` : '空网卡'}
          </Col>
        </Row>
      ))}

      <Row style={{ marginTop: '10px' }}>
        <Col span={6}>磁盘名</Col>
        <Col span={6}>大小</Col>
      </Row>
      {disks.map((item, index) => (
        <Row key={index}>
          <Col span={6}>{item.name}</Col>
          <Col span={6}>
            <Progress
              strokeWidth={16}
              percent={(item.actualSize / item.capacity) * 100}
              format={() => `${item.actualSize}G/${item.capacity}G`}
              status={
                +((item.actualSize / item.capacity) * 100) < 80
                  ? 'active'
                  : 'exception'
              }
            ></Progress>
          </Col>
        </Row>
      ))}
    </div>
  )
}
