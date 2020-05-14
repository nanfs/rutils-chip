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

  // hiddenOnNotDiscrete 用于处理没有开启三员功能时场景的组件
  const { children, role, hiddenOnNotDiscrete } = props
  if (hiddenOnNotDiscrete && !isDiscrete) {
    return null
  }
  if (checkAuth(role)) {
    return children
  }
  return null
}
