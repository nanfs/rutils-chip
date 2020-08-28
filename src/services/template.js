import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      // timeout: 10000,
      url: '/templates',
      method: 'get',
      params: data
    })
  },
  addTem(data) {
    return axios({
      url: '/templates',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  delTem(data) {
    return axios({
      url: '/templates',
      method: 'delete',
      // timeout: 60000,
      data: qs.stringify(data)
    })
  },
  updateTem(data) {
    const { id, ...reqData } = data
    return axios({
      url: `/templates/${id}`,
      method: 'put',
      data: qs.stringify(reqData, { arrayFormat: 'indices', allowDots: true })
    })
  },
  detailTem(data) {
    return axios({
      url: '/desktops',
      method: 'get',
      params: data
    })
  },
  // 模板名称是否存在于导出域
  templateExistInExportDomain(data) {
    return axios({
      url: `/templates/templateNameExistInExportDomain`,
      method: 'post',
      params: data
    })
  },
  // 导出模板
  export(data) {
    return axios({
      url: `/templates/export`,
      method: 'post',
      params: data
    })
  },
  // 导出域下模板列表
  templateListInDomain(data) {
    return axios({
      url: `/templates/exportDomain`,
      method: 'post',
      params: data
    })
  },
  // 判断导入的模板名称重名
  templateExistInSystem(data) {
    return axios({
      url: `/templates/templateNameExistInSystem`,
      method: 'post',
      params: data
    })
  },
  // 导入模板
  import(data) {
    return axios({
      url: `/templates/import`,
      method: 'post',
      params: data
    })
  }
}
