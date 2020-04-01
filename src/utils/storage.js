import assetsApi from '@/services/assets'
import userApi from '@/services/user'

const setClusterToSession = () => {
  assetsApi
    .clusters()
    .then(res => {
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
}

const setDataCenterToSession = () => {
  assetsApi
    .datacenters()
    .then(res => {
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
}

const setHostToSession = () => {
  assetsApi
    .hosts()
    .then(res => {
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
}
const setDomainToSession = () => {
  userApi
    .domainlist()
    .then(res => {
      const hosts =
        res?.data?.map(item => ({
          value: item,
          label: item
        })) || null
      sessionStorage.setItem('domains', JSON.stringify(hosts))
    })
    .catch(() => {
      sessionStorage.setItem('domains', JSON.stringify([]))
    })
}
export {
  setClusterToSession,
  setDataCenterToSession,
  setHostToSession,
  setDomainToSession
}
