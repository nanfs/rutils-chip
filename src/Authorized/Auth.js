import { checkAuth } from '@/utils/checkPermissions'
import { getItemFromLocal } from '@/utils/storage'

/**
 * @description
 * @author lishuai
 * @date 2020-05-09
 * @export
 * @param {*} props
 * force 设置
 * @returns
 */
export default function Auth(props) {
  const isDiscrete = getItemFromLocal('threePowersSwitch') || false

  // showOnDiscrete 用于展示开启三员功能时场景的组件
  const { children, role, showOnDiscrete } = props
  if (showOnDiscrete && !isDiscrete) {
    return null
  }
  if (checkAuth(role)) {
    return children
  }
  return null
}
