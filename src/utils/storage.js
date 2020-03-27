import assetsApi from '@/services/assets'

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

export { setClusterToSession, setDataCenterToSession, setHostToSession }
