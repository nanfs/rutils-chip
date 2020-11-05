import { checkAuth } from '@/utils/checkPermissions';
import { getItemFromLocal } from '@/utils/storage';
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
  var isDiscrete = getItemFromLocal('threePowersSwitch') || false; // showOnDiscrete 用于展示开启三员功能时场景的组件

  var children = props.children,
      role = props.role,
      showOnDiscrete = props.showOnDiscrete;

  if (showOnDiscrete && !isDiscrete) {
    return null;
  }

  if (checkAuth(role)) {
    return children;
  }

  return null;
}