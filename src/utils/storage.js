/**
 * @description 获取项目参数
 * @author lishuai
 * @date 2020-05-07
 * @returns
 */
export function getPropertieslocal() {
  return JSON.parse(sessionStorage.getItem('properties')) || {}
}

/**
 * @description 设置项目参数
 * @author lishuai
 * @date 2020-05-07
 * @param {*} properties
 */
export function setPropertiesToLocal(properties) {
  if (properties) {
    sessionStorage.setItem('properties', JSON.stringify(properties))
  } else {
    sessionStorage.removeItem('properties')
  }
}

/**
 * @description
 * @author lishuai
 * @date 2020-05-08
 * @param {*} user
 */
export function setItemToLocal(Obj) {
  if (Obj) {
    for (const [key, value] of Object.entries(Obj)) {
      sessionStorage.setItem(key, JSON.stringify(value))
    }
  } else {
    sessionStorage.clear()
  }
}
/**
 * @description
 * @author lishuai
 * @date 2020-05-08
 * @param {*} user
 */
export function setObjItemTolocal(ObjName, Obj) {
  if (!ObjName) {
    sessionStorage.clear()
  } else if (Obj) {
    sessionStorage.setItem(ObjName, JSON.stringify(Obj))
  } else {
    sessionStorage.removeItem(ObjName)
  }
}

/**
 * @description 从本地获取
 * @author lishuai
 * @date 2020-05-08
 * @param {*} item
 * @returns
 */
export function getItemFromLocal(item) {
  return JSON.parse(sessionStorage.getItem(item)) || ''
}
