import React, { useState } from 'react'
import { Button, Icon, Input } from 'antd'
import { staticsMenu } from '*/menu'
import { getItemFromLocal, setObjItemTolocal } from '@/utils/storage'
import './chip/staticmenu.less'

// [ name:link, name1:link1]
export default function StaticMenu() {
  const [favMenus, setFavMenus] = useState(getItemFromLocal('favMenus') || [])
  const [query, setQuery] = useState(null)

  // 修改菜单 保存到local
  const changeFavMenus = menus => {
    setObjItemTolocal('favMenus', { ...menus })
    setFavMenus(menus)
  }
  // 是否是收藏菜单
  const isFavedMenu = name => {
    return favMenus && Object.keys(favMenus).includes(name)
  }

  // --------------渲染----------------
  // 渲染收藏菜单
  const renderFavouriteMenu = () => {
    return (
      <div className="fav-menu menu-list">
        <h3>收藏路径</h3>
        {favMenus && (
          <div className="col3">
            {Object.keys(favMenus).map(item => (
              <div key={item} className="item">
                <a
                  href={favMenus[item]}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {item}
                </a>
                <Button
                  type="link"
                  className="is-favmenu"
                  onClick={() => {
                    const newfavMenus = { ...favMenus }
                    delete newfavMenus[item]
                    setFavMenus(newfavMenus)
                  }}
                  title={'取消收藏'}
                >
                  <Icon type="star" theme={'filled'} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 渲染所有菜单
  const renderMenus = () => {
    return (
      <div className="col3">
        {staticsMenu.map(item => {
          return (
            <div
              key={item.name}
              className="menu-list"
              hidden={
                query &&
                !item.child
                  .map(i => i.name)
                  .join()
                  .includes(query)
              }
            >
              <h3>{item.name}</h3>
              <ul>
                {item.child.map(citem => (
                  <li
                    key={citem.name}
                    className="item"
                    hidden={query && !citem.name.includes(query)}
                  >
                    <a
                      href={citem.link}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {citem.name}
                    </a>
                    {isFavedMenu(citem.name) ? (
                      <Button
                        type="link"
                        className="is-favmenu"
                        onClick={() => {
                          const newfavMenus = { ...favMenus }
                          delete newfavMenus[citem.name]
                          setFavMenus(newfavMenus)
                        }}
                        title={'取消收藏'}
                      >
                        <Icon type="star" theme={'filled'} />
                      </Button>
                    ) : (
                      <Button
                        type="link"
                        onClick={() => {
                          const newfavMenus = { ...favMenus }
                          newfavMenus[citem.name] = citem.link
                          changeFavMenus(newfavMenus)
                        }}
                        title={'点击收藏'}
                      >
                        <Icon type="star" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    )
  }

  const renderQuery = () => {
    return (
      <div className="query-wrap">
        <Input
          prefix={<Icon type="search" />}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="static-menu-wrap">
      <div className="static-menu">
        {renderQuery()}
        {renderFavouriteMenu()}
        {renderMenus()}
      </div>
      <div className="mask"></div>
    </div>
  )
}
