// eslint-disable-next-line import/prefer-default-export
export const detailVersionColumns = [
  {
    title: '升级前版本',
    ellipsis: true,
    width: 300,
    dataIndex: 'beforeVersion'
  },
  {
    title: '升级后版本',
    dataIndex: 'afterVersion',
    width: 300,
    ellipsis: true
  },
  {
    title: '升级时间',
    ellipsis: true,
    dataIndex: 'upgradeTime'
  }
]
