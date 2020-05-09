import assetsApi from '@/services/assets'
import userApi from '@/services/user'
import { wrapResponse } from '@/utils/tool'
import { setObjItemTolocal } from '@/utils/storage'

/**
 * @description
 * @author lishuai
 * @date 2020-05-09
 * @export
 */
export function setDataCenterToSession() {
  assetsApi.datacenters().then(res =>
    wrapResponse(res)
      .then(() => {
        const datacenters =
          res?.data?.map(item => ({
            value: item.id,
            text: item.name
          })) || null
        setObjItemTolocal('datacenters', datacenters)
      })
      .catch(() => {
        setObjItemTolocal('datacenters', null)
      })
  )
}

/**
 * @description 用于筛选
 * @author lishuai
 * @date 2020-05-09
 * @export
 */
export function setHostToSession() {
  assetsApi.hosts().then(res =>
    wrapResponse(res)
      .then(() => {
        const hosts =
          res?.data?.map(item => ({
            value: item.id,
            text: item.name
          })) || null
        setObjItemTolocal('hosts', hosts)
      })
      .catch(() => {
        setObjItemTolocal('hosts', null)
      })
  )
}

/**
 * @description 用于筛选
 * @author lishuai
 * @date 2020-05-09
 * @export
 */
export function setDomainToSession() {
  userApi.domainlist().then(res =>
    wrapResponse(res)
      .then(() => {
        const domain =
          res?.data?.map(item => ({
            value: item,
            label: item === 'internal' ? '本地组(internal)' : item
          })) || null
        setObjItemTolocal('domains', domain)
      })
      .catch(() => {
        setObjItemTolocal('domains', null)
      })
  )
}

/**
 * @description
 * @author lishuai
 * @date 2020-05-09
 * @export
 */
export function setClusterToSession() {
  assetsApi.clusters().then(res =>
    wrapResponse(res)
      .then(() => {
        const clusters =
          res?.data?.map(item => ({
            value: item.id,
            text: item.name
          })) || null
        setObjItemTolocal('clusters', clusters)
      })
      .catch(() => {
        setObjItemTolocal('clusters', null)
      })
  )
}
