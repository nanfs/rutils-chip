export const dict = {
  AddVm: '添加虚拟机',
  Cluster: '集群',
  Creating: '正在创建',
  VM: '虚拟机',
  in: '在'
}
export function transform(Text) {
  let TextStr = Text
  Object.keys(dict).forEach(item => {
    TextStr = TextStr.replace(new RegExp(item), dict[item])
  })
  return TextStr
}
