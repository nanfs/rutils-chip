export default function prefixType(type, model) {
  const prefixedType = `${model.namespace}/${type}`
  return prefixedType
}
