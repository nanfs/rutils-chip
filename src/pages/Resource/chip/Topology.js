import React from 'react'
import G6 from '@antv/g6'

import cloudPlatformImg from '@/assets/topology/cloudplatform.png'
import datacenterOnlineImg from '@/assets/topology/datacenter-online.png'
import datacenterOfflineImg from '@/assets/topology/datacenter-offline.png'
import clusterOnlineImg from '@/assets/topology/cluster-online.png'
import clusterOffImg from '@/assets/topology/cluster-offline.png'
import vmOnImg from '@/assets/topology/vm-on.png'
import vmOffImg from '@/assets/topology/vm-off.png'
import vmUnusualImg from '@/assets/topology/vm-unusual.png'
import vmRunningImg from '@/assets/topology/vm-running.png'

import '../index.less'

const cloudPlatformData = {
  id: 'root',
  img: cloudPlatformImg
}

const datacenterData = [
  {
    id: 'center1',
    label: '数据中心1',
    parentId: 'root'
  },
  {
    id: 'center2',
    label: '数据中心2',
    parentId: 'root'
  }
]

const clusterData = [
  {
    id: 'cluster1',
    label: '集群1',
    parentId: 'center1'
  },
  {
    id: 'cluster2',
    label: '集群2',
    parentId: 'center1'
  },
  {
    id: 'cluster3',
    label: '集群3',
    parentId: 'center2'
  },
  {
    id: 'cluster4',
    label: '集群4',
    parentId: 'center2'
  }
]

const hostData = [
  {
    id: 'host1',
    label: '主机1',
    parentId: 'cluster1'
  },
  {
    id: 'host2',
    label: '主机2',
    parentId: 'cluster2'
  }
]

const vmData = [
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm1',
    label: '虚拟机1',
    hostId: 'host1'
  },
  {
    id: 'vm2',
    label: '虚拟机2',
    hostId: '',
    clusterId: 'cluster1'
  },
  {
    id: 'vm3',
    label: '虚拟机3',
    hostId: 'host2'
  },
  {
    id: 'vm4',
    label: '虚拟机4',
    hostId: 'host1'
  },
  {
    id: 'vm5',
    label: '虚拟机5',
    hostId: 'host1'
  },
  {
    id: 'vm6',
    label: '虚拟机6',
    hostId: 'host1'
  },
  {
    id: 'vm7',
    label: '虚拟机7',
    hostId: '',
    clusterId: 'cluster3'
  },
  {
    id: 'vm8',
    label: '虚拟机8',
    hostId: '',
    clusterId: 'cluster3'
  },
  {
    id: 'vm9',
    label: '虚拟机9',
    hostId: '',
    clusterId: 'cluster4'
  },
  {
    id: 'vm10',
    label: '虚拟机10',
    hostId: 'host3'
  }
]

const edges = [
  {
    source: 'center1',
    target: 'cluster1',
    shape: 'circle-running',
    data: {
      source: 'center1',
      target: 'cluster1'
    }
  },
  {
    source: 'center2',
    target: 'cluster2',
    data: {
      source: 'center2',
      target: 'cluster2'
    }
  },
  {
    source: 'center2',
    target: 'cluster3',
    data: {
      source: 'center2',
      target: 'cluster3'
    }
  },
  {
    source: 'center2',
    target: 'cluster4',
    data: {
      source: 'center2',
      target: 'cluster4'
    }
  },
  {
    source: 'cluster1',
    target: 'host1',
    data: {
      source: 'cluster1',
      target: 'host1'
    }
  },
  {
    source: 'cluster1',
    target: 'host2',
    data: {
      source: 'cluster1',
      target: 'host2'
    }
  },
  {
    source: 'cluster1',
    target: 'host3',
    data: {
      source: 'cluster1',
      target: 'host3'
    }
  },
  {
    source: 'cluster1',
    target: 'host4',
    data: {
      source: 'cluster1',
      target: 'host4'
    }
  },
  {
    source: 'cluster2',
    target: 'host5',
    data: {
      source: 'cluster2',
      target: 'host5'
    }
  },
  {
    source: 'cluster2',
    target: 'host6',
    data: {
      source: 'cluster2',
      target: 'host6'
    }
  },
  {
    source: 'cluster3',
    target: 'host7',
    data: {
      source: 'cluster3',
      target: 'host7'
    }
  }
]

export default class Topology extends React.Component {
  state = {
    innerPath: undefined,
    tooltipItem: '',
    tooltipStyle: {}
  }

  node2tree() {
    // 给每个集群下插入一个未分配
    clusterData.forEach(cluster => {
      hostData.push({
        id: `emptyHost_${cluster.id}`,
        label: '未分配',
        parentId: cluster.id
      })
    })

    cloudPlatformData.children = []
    datacenterData.forEach((datacenter, index) => {
      datacenter.img = datacenterOnlineImg
      if (cloudPlatformData.id === datacenter.parentId) {
        cloudPlatformData.children.push(datacenter)
      }
      datacenter.children = []
      clusterData.forEach(cluster => {
        cluster.img = clusterOnlineImg
        if (datacenter.id === cluster.parentId) {
          datacenter.children.push(cluster)
        }
        cluster.children = []
        hostData.forEach(host => {
          // host.img = vmImg
          if (cluster.id === host.parentId) {
            cluster.children.push(host)
          }
          host.children = []
          host.collapsed = true
          vmData.forEach(vm => {
            vm.img = vmOnImg
            if (vm.hostId === '') {
              vm.hostId = `emptyHost_${vm.clusterId}`
            }
            vm.parentId = vm.hostId
            if (host.id === vm.parentId) {
              host.children.push(vm)
            }
          })
        })
      })
    })

    return cloudPlatformData
  }

  componentDidMount() {
    const data = this.node2tree()
    console.log(data)
    if (this.mountNode) {
      const graph = new G6.TreeGraph({
        container: this.mountNode, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: document.querySelector('.ant-layout-content').scrollWidth - 200, // Number，必须，图的宽度
        height: document.querySelector('.ant-layout-content').scrollHeight - 80, // Number，必须，图的高度
        fitView: true,
        fitViewPadding: 150,
        animate: true,
        modes: {
          default: [
            {
              type: 'collapse-expand', // 定义收缩/展开行为
              trigger: 'click',
              onChange(item, collapsed) {
                // console.log('graph now is going to do layout')
              }
            },
            /* {
              type: 'tooltip',
              formatText(model) {
                return (
                  `<div><span class="g6-tooltip-label">名称：</span><span class="g6-tooltip-value"><span>${model.label}</span></span><span class="g6-tooltip-label">状态：</span><span class="g6-tooltip-value"><span>${model.label}</span></span></div>` +
                  `<div><span class="g6-tooltip-label">名称：</span><span class="g6-tooltip-value"><span>${model.label}</span></span><span class="g6-tooltip-label">状态：</span><span class="g6-tooltip-value"><span>${model.label}</span></span></div>`
                )
              }
              // offset: 10
            } */
            // 允许拖拽画布、放缩画布、拖拽节点
            'drag-canvas',
            'zoom-canvas'
            // 'drag-node',
          ]
        },
        layout: {
          type: 'compactBox',
          direction: 'TB', // 树布局的方向
          nodeSep: 10, // 可选
          rankSep: 10, // 可选
          getVGap: function getVGap() {
            return 50
          },
          getHGap: function getHGap() {
            return 50
          }
        },
        defaultNode: {
          type: 'image',
          size: 40,
          labelCfg: {
            position: 'right',
            style: {
              fontSize: 12
            }
          }
        },
        defaultEdge: {
          type: 'quadratic',
          style: {
            stroke: '#1890ff',
            lineWidth: 0.8
          }
        }
      })
      graph.data(data)
      graph.render()

      // 鼠标进入节点
      graph.on('node:mouseenter', e => {
        console.log(e)
        clearTimeout(this.timer)
        const nodeItem = e.item // 获取鼠标进入的节点元素对象
        const { model } = e.item.defaultCfg
        console.log(model)
        this.setState({
          tooltipStyle: {
            visibility: 'visible',
            top: e.canvasY - 20,
            left: e.canvasX + 20
          },
          tooltipItem: (
            <div>
              <div>
                <span className="topology-tooltip-label">名称：</span>
                <span className="topology-tooltip-value">
                  <span>{model.label}</span>
                </span>
                <span className="topology-tooltip-label">状态：</span>
                <span className="topology-tooltip-value">
                  <span>{model.label}</span>
                </span>
              </div>
              <div>
                <span className="topology-tooltip-label">名称：</span>
                <span className="topology-tooltip-value">
                  <span>{model.label}</span>
                </span>
                <span className="topology-tooltip-label">状态：</span>
                <span className="topology-tooltip-value">
                  <span>{model.label}</span>
                </span>
              </div>
            </div>
          )
        })
        /* graph.updateItem(nodeItem, {
          img: vmImg
        }) // 修改当前节点展示 */
        graph.setItemState(nodeItem, 'hover', true) // 设置当前节点的 hover 状态为 true
      })

      // 鼠标离开节点
      graph.on('node:mouseleave', e => {
        const nodeItem = e.item // 获取鼠标离开的节点元素对象
        graph.setItemState(nodeItem, 'hover', false) // 设置当前节点的 hover 状态为 false
        this.timer = setTimeout(
          () =>
            this.setState({
              tooltipStyle: {
                visibility: 'hidden'
              }
            }),
          1000
        )
      })

      // 点击节点
      graph.on('node:click', e => {
        graph.zoom(10, { x: 100, y: 100 })
        graph.render()
        graph.refreshLayout(false)
      })
    }
  }

  render() {
    const { tooltipItem, tooltipStyle, actionItem } = this.state

    return (
      <React.Fragment>
        <div
          ref={ref => {
            this.mountNode = ref
          }}
          style={{ backgroundColor: '#fff' }}
        ></div>
        <div className="topology-tooltip" style={tooltipStyle}>
          {tooltipItem}
          {actionItem}
        </div>
      </React.Fragment>
    )
  }
}