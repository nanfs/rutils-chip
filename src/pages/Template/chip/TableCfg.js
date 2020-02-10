import templateApi from '@/services/template'
import { Icon } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '模板名称',
    dataIndex: 'name'
  },
  {
    title: '已使用桌面',
    dataIndex: 'vmUsed'
  },
  {
    title: '父模板',
    dataIndex: 'parentName'
  },
  {
    title: '数据中心/集群',
    dataIndex: 'datacenterName'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '状态',
    dataIndex: 'status'
  }
]
export const apiMethod = templateApi.list
