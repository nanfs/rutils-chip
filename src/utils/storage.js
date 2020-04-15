import assetsApi from '@/services/assets'
import userApi from '@/services/user'
import { wrapResponse } from '@/utils/tool'

const setClusterToSession = () => {
  assetsApi.clusters().then(res =>
    wrapResponse(res)
      .then(() => {
        const clusters =
          res?.data?.map(item => ({
            value: item.id,
            text: item.name
          })) || null
        sessionStorage.setItem('clusters', JSON.stringify(clusters))
      })
      .catch(() => {
        sessionStorage.setItem('clusters', JSON.stringify([]))
      })
  )
}

const setDataCenterToSession = () => {
  assetsApi.datacenters().then(res =>
    wrapResponse(res)
      .then(() => {
        const datacenters =
          res?.data?.map(item => ({
            value: item.id,
            text: item.name
          })) || null
        sessionStorage.setItem('datacenters', JSON.stringify(datacenters))
      })
      .catch(() => {
        sessionStorage.setItem('datacenters', JSON.stringify([]))
      })
  )
}

const setHostToSession = () => {
  assetsApi.hosts().then(res =>
    wrapResponse(res)
      .then(() => {
        const hosts =
          res?.data?.map(item => ({
            value: item.id,
            text: item.name
          })) || null
        sessionStorage.setItem('hosts', JSON.stringify(hosts))
      })
      .catch(() => {
        sessionStorage.setItem('hosts', JSON.stringify([]))
      })
  )
}
const setDomainToSession = () => {
  userApi.domainlist().then(res =>
    wrapResponse(res)
      .then(() => {
        const hosts =
          res?.data?.map(item => ({
            value: item,
            label: item === 'internal' ? '本地组' : item
          })) || null
        sessionStorage.setItem('domains', JSON.stringify(hosts))
      })
      .catch(() => {
        sessionStorage.setItem('domains', JSON.stringify([]))
      })
  )
}
export {
  setClusterToSession,
  setDataCenterToSession,
  setHostToSession,
  setDomainToSession
}
