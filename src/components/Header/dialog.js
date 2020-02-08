import React from 'react'
import { Spin } from 'antd'
// import SetPwdForm from './SetPwdForm';

function AboutDialog(props) {
  const { aboutinfo = {} } = props
  return (
    <Spin spinning={aboutinfo.loading}>
      <h5>网安凌云安全虚拟桌面管理平台V2.1</h5>
      {aboutinfo.data && (
        <ul>
          <li>
            <span className="title">系统编号 :</span>
            <span>{aboutinfo.data.systemNumber}</span>
          </li>
          <li>
            <span className="title">产品类型 :</span>
            <span>{aboutinfo.data.productType}</span>
          </li>
          <li>
            <span className="title">许可数量 :</span>
            <span>{aboutinfo.data.permitNumber}</span>
          </li>
          <li>
            <span className="title">许可证有效期 :</span>
            <span>{aboutinfo.data.useTimeLimit}</span>
          </li>
        </ul>
      )}
      <h4>2018 CETC-Cloud (c)</h4>
    </Spin>
  )
}

// function SetPwd(props) {
//   return <SetPwdForm {...props} />;
// }
export { AboutDialog }
